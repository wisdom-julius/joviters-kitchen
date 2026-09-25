import { supabase, hasSupabaseClient } from '../supabase'

// Upload a user's profile picture to their own folder in the "avatars"
// bucket and return its public URL. Requires database/avatar_storage_setup.sql
// to have been run (creates the bucket and per-user RLS policies).
export async function uploadAvatarImage(userId: string, file: File): Promise<string | null> {
  try {
    if (!hasSupabaseClient() || !supabase) {
      console.warn('Supabase not configured, cannot upload avatar');
      return null;
    }

    const supabaseAny = supabase as any;

    const fileExt = file.name.split('.').pop();
    const fileName = `avatar-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error } = await supabaseAny.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading avatar:', error);
      return null;
    }

    const { data: urlData } = supabaseAny.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    return null;
  }
}
