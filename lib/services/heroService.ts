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
