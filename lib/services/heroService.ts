import { supabase, hasSupabaseClient } from '../supabase'

export interface HeroImage {
  id: string
  imageUrl: string
  displayOrder: number
}

// Get all hero images, ordered for display. Returns an empty array (not an
// error) when Supabase isn't configured or none have been added yet, so the
// homepage can simply fall back to its plain background with no images.
export async function getHeroImages(): Promise<HeroImage[]> {
  try {
    if (!hasSupabaseClient() || !supabase) {
      return []
    }

    const supabaseAny = supabase as any
    const { data, error } = await supabaseAny
      .from('hero_images')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error || !data) {
      if (error) console.warn('Failed to load hero images:', error)
      return []
    }

    return data.map((row: any) => ({
      id: row.id,
      imageUrl: row.image_url,
      displayOrder: row.display_order
    }))
  } catch (error) {
    console.error('Error fetching hero images:', error)
    return []
  }
}

// Upload an image file to the hero-images bucket and return its public URL.
export async function uploadHeroImageFile(file: File): Promise<string | null> {
  try {
    if (!hasSupabaseClient() || !supabase) {
      console.warn('Supabase not configured, cannot upload image')
      return null
    }

    const supabaseAny = supabase as any
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `hero/${fileName}`

    const { error } = await supabaseAny.storage
      .from('hero-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading hero image:', error)
      return null
    }

    const { data: urlData } = supabaseAny.storage
      .from('hero-images')
      .getPublicUrl(filePath)

    return urlData.publicUrl
  } catch (error) {
    console.error('Error uploading hero image:', error)
    return null
  }
}

// Save an already-uploaded image's URL as a hero_images row.
export async function addHeroImage(imageUrl: string, displayOrder: number): Promise<HeroImage | null> {
  try {
    if (!hasSupabaseClient() || !supabase) return null

    const supabaseAny = supabase as any
    const { data, error } = await supabaseAny
      .from('hero_images')
      .insert([{ image_url: imageUrl, display_order: displayOrder }])
      .select()
      .single()

    if (error || !data) {
      console.error('Error saving hero image:', error)
      return null
    }

    return { id: data.id, imageUrl: data.image_url, displayOrder: data.display_order }
  } catch (error) {
    console.error('Error saving hero image:', error)
    return null
  }
}

// Remove a hero image's storage file and its database row.
export async function deleteHeroImage(id: string, imageUrl: string): Promise<boolean> {
  try {
    if (!hasSupabaseClient() || !supabase) return false

    const supabaseAny = supabase as any

    const urlParts = imageUrl.split('/')
    const heroIndex = urlParts.indexOf('hero')
    if (heroIndex !== -1) {
      const filePath = urlParts.slice(heroIndex).join('/')
      await supabaseAny.storage.from('hero-images').remove([filePath])
    }

    const { error } = await supabaseAny
      .from('hero_images')
      .delete()
      .eq('id', id)

    return !error
  } catch (error) {
    console.error('Error deleting hero image:', error)
    return false
  }
}

export interface HeroSettings {
  imagesEnabled: boolean
  videoEnabled: boolean
  videoUrl: string | null
}

const DEFAULT_HERO_SETTINGS: HeroSettings = {
  imagesEnabled: true,
  videoEnabled: false,
  videoUrl: null
}

// Get the current display-mode settings (which layer is switched on, and
// the active video's URL if any). Falls back to "images on, video off" if
// Supabase isn't configured or the settings row hasn't been created yet.
export async function getHeroSettings(): Promise<HeroSettings> {
  try {
    if (!hasSupabaseClient() || !supabase) {
      return DEFAULT_HERO_SETTINGS
    }

    const supabaseAny = supabase as any
    const { data, error } = await supabaseAny
      .from('hero_settings')
      .select('*')
      .eq('id', 1)
      .single()

    if (error || !data) {
      if (error) console.warn('Failed to load hero settings:', error)
      return DEFAULT_HERO_SETTINGS
    }

    return {
      imagesEnabled: data.images_enabled,
      videoEnabled: data.video_enabled,
      videoUrl: data.video_url
    }
  } catch (error) {
    console.error('Error fetching hero settings:', error)
    return DEFAULT_HERO_SETTINGS
  }
}

// Update one or more display-mode settings.
export async function updateHeroSettings(
  updates: Partial<{ imagesEnabled: boolean; videoEnabled: boolean; videoUrl: string | null }>
): Promise<boolean> {
  try {
    if (!hasSupabaseClient() || !supabase) return false

    const supabaseAny = supabase as any
    const payload: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (updates.imagesEnabled !== undefined) payload.images_enabled = updates.imagesEnabled
    if (updates.videoEnabled !== undefined) payload.video_enabled = updates.videoEnabled
    if (updates.videoUrl !== undefined) payload.video_url = updates.videoUrl

    const { error } = await supabaseAny
      .from('hero_settings')
      .update(payload)
      .eq('id', 1)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error updating hero settings:', error)
    return false
  }
}

// Upload the looping background video to the hero-videos bucket and
// return its public URL.
export async function uploadHeroVideoFile(file: File): Promise<string | null> {
  try {
    if (!hasSupabaseClient() || !supabase) {
      console.warn('Supabase not configured, cannot upload video')
      return null
    }

    const supabaseAny = supabase as any
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `hero/${fileName}`

    const { error } = await supabaseAny.storage
      .from('hero-videos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Error uploading hero video:', error)
      return null
    }

    const { data: urlData } = supabaseAny.storage
      .from('hero-videos')
      .getPublicUrl(filePath)

    return urlData.publicUrl
  } catch (error) {
    console.error('Error uploading hero video:', error)
    return null
  }
}

// Remove the current hero video's storage file and clear it from settings.
export async function deleteHeroVideo(videoUrl: string): Promise<boolean> {
  try {
    if (!hasSupabaseClient() || !supabase) return false

    const supabaseAny = supabase as any

    const urlParts = videoUrl.split('/')
    const heroIndex = urlParts.indexOf('hero')
    if (heroIndex !== -1) {
      const filePath = urlParts.slice(heroIndex).join('/')
      await supabaseAny.storage.from('hero-videos').remove([filePath])
    }

    return await updateHeroSettings({ videoUrl: null, videoEnabled: false })
  } catch (error) {
    console.error('Error deleting hero video:', error)
    return false
  }
}
