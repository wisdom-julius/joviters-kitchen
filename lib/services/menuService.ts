import { supabase, hasSupabaseClient } from '../supabase'
import { MenuItem } from '@/types'
import { menuData } from '@/constants/menuData'

// Image Upload Service
export async function uploadMenuImage(file: File): Promise<string | null> {
  try {
    if (!hasSupabaseClient() || !supabase) {
      console.warn('Supabase not configured, cannot upload image');
      return null;
    }

    const supabaseAny = supabase as any;
    
    // Create a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `menu/${fileName}`;

    // Upload the file
    const { data, error } = await supabaseAny.storage
      .from('menu-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    // Get the public URL
    const { data: urlData } = supabaseAny.storage
      .from('menu-images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading menu image:', error);
    return null;
  }
}

// Delete menu image from storage
export async function deleteMenuImage(imageUrl: string): Promise<boolean> {
  try {
    if (!hasSupabaseClient() || !supabase) {
      return false;
    }

    const supabaseAny = supabase as any;
    
    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const filePath = urlParts.slice(urlParts.indexOf('menu')).join('/');

    const { error } = await supabaseAny.storage
      .from('menu-images')
      .remove([filePath]);

    return !error;
  } catch (error) {
    console.error('Error deleting menu image:', error);
    return false;
  }
}

// Get all menu items
export async function getMenuItems(category?: MenuItem['category'] | 'all'): Promise<MenuItem[]> {
  try {
    // Check if Supabase is configured and available
    if (hasSupabaseClient() && supabase) {
      const supabaseAny = supabase as any;
      let query = supabaseAny.from('menu_items').select('*').order('name');
      
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (!error && data) {
        // Map Supabase data to our types
        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          image: item.image,
          category: item.category,
          ingredients: item.ingredients || [],
          preparationTime: item.preparation_time,
          isAvailable: item.is_available
        }));
      } else if (error) {
        console.warn('Supabase query failed, falling back to static data:', error)
      }
    }
    
    // Fallback to static data
    console.log('Using static menu data (Supabase not configured)');
    if (category && category !== 'all') {
      return menuData.filter(item => item.category === category);
    }
    return menuData;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    // Fallback to static data
    if (category && category !== 'all') {
      return menuData.filter(item => item.category === category);
    }
    return menuData;
  }
}

// Get single menu item by id
export async function getMenuItem(id: string): Promise<MenuItem | null> {
  try {
    // Check if Supabase is configured and available
    if (hasSupabaseClient() && supabase) {
      const supabaseAny = supabase as any;
      const { data, error } = await supabaseAny
        .from('menu_items')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          description: data.description,
          price: Number(data.price),
          image: data.image,
          category: data.category,
          ingredients: data.ingredients || [],
          preparationTime: data.preparation_time,
          isAvailable: data.is_available
        };
      } else if (error) {
        console.warn('Supabase query failed, falling back to static data:', error)
      }
    }
    
    // Fallback to static data
    return menuData.find(item => item.id === id) || null;
  } catch (error) {
    console.error('Error fetching menu item:', error);
    // Fallback to static data
    return menuData.find(item => item.id === id) || null;
  }
}

// Create a new menu item
export async function createMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem | null> {
  try {
    if (hasSupabaseClient() && supabase) {
      const supabaseAny = supabase as any;
      const { data, error } = await supabaseAny
        .from('menu_items')
        .insert([{
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          category: item.category,
          ingredients: item.ingredients,
          preparation_time: item.preparationTime,
          is_available: item.isAvailable
        }])
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          description: data.description,
          price: Number(data.price),
          image: data.image,
          category: data.category,
          ingredients: data.ingredients || [],
          preparationTime: data.preparation_time,
          isAvailable: data.is_available
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error creating menu item:', error);
    return null;
  }
}

// Update an existing menu item
export async function updateMenuItem(id: string, item: Partial<MenuItem>): Promise<MenuItem | null> {
  try {
    if (hasSupabaseClient() && supabase) {
      const supabaseAny = supabase as any;
      const { data, error } = await supabaseAny
        .from('menu_items')
        .update({
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          category: item.category,
          ingredients: item.ingredients,
          preparation_time: item.preparationTime,
          is_available: item.isAvailable
        })
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          name: data.name,
          description: data.description,
          price: Number(data.price),
          image: data.image,
          category: data.category,
          ingredients: data.ingredients || [],
          preparationTime: data.preparation_time,
          isAvailable: data.is_available
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Error updating menu item:', error);
    return null;
  }
}

// Delete a menu item
export async function deleteMenuItem(id: string): Promise<boolean> {
  try {
    if (hasSupabaseClient() && supabase) {
      // First get the item to get the image URL
      const item = await getMenuItem(id);
      if (item?.image) {
        await deleteMenuImage(item.image);
      }

      const supabaseAny = supabase as any;
      const { error } = await supabaseAny
        .from('menu_items')
        .delete()
        .eq('id', id);

      return !error;
    }
    return false;
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return false;
  }
}
