"use server";

import { createClient } from '@supabase/supabase-js';

// Use service role key for admin actions
function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key here
  );
}

// Use anon key for public actions (like login)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function adminLogin(email: string, password: string) {
  // Sign in using Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { success: false, error: "Invalid credentials" };
  }

  // Check is_admin in profiles table
  const supabaseAdmin = getSupabaseAdmin();
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('users')
    .select('is_admin')
    .eq('email', email)
    .single();

  if (profileError || !profile || !profile.is_admin) {
    return { success: false, error: "Invalid admin credentials" };
  }

  // Success!
  return { success: true, error: null };
}

// Menu items management
export async function addMenuItem(formData: FormData) {
  try {
    const supabase = getSupabaseAdmin();
    
    const name = formData.get('name') as string;
    const price = parseFloat(formData.get('price') as string);
    const rating = parseFloat(formData.get('rating') as string);
    const description = formData.get('description') as string;
    const imageFile = formData.get('image') as File;
    const category = formData.get('category') as string;

    let image_url = null;

    // Upload image if provided
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(fileName, imageFile);

      if (uploadError) {
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data } = supabase.storage
        .from('menu-images')
        .getPublicUrl(fileName);
      
      image_url = data.publicUrl;
    }

    // Insert menu item
    const { data, error } = await supabase
      .from('menu_items')
      .insert([{
        name,
        price,
        rating,
        description,
        image_url,
        category
      }])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data, error: null };
  } catch (error: unknown) {
    return { success: false, data: null, error: (error as Error).message };
  }
}

export async function getMenuItems() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { success: false, data: [], error: error.message };
  }
  return { success: true, data, error: null };
}

export async function deleteMenuItem(id: string) {
  try {
    const supabase = getSupabaseAdmin();
    
    // Get the item to delete the image
    const { data: item } = await supabase
      .from('menu_items')
      .select('image_url')
      .eq('id', id)
      .single();

    // Delete the image from storage if it exists
    if (item?.image_url) {
      const fileName = item.image_url.split('/').pop();
      if (fileName) {
        await supabase.storage
          .from('menu-images')
          .remove([fileName]);
      }
    }

    // Delete the menu item
    const { error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, error: null };
  } catch (error: unknown) {
    return { success: false, error: (error as Error).message };
  }
}

// About content management
export async function getAboutContent() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('about_content')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    return { success: false, data: null, error: error.message };
  }
  return { success: true, data, error: null };
}

export async function updateAboutContent(title: string, subtitle: string, content: string) {
  const supabase = getSupabaseAdmin();

  // Get the latest row id
  const { data: existing, error: fetchError } = await supabase
    .from('about_content')
    .select('id')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (fetchError || !existing?.id) {
    return { success: false, error: "No about_content row found to update." };
  }

  // Update the row
  const { data, error } = await supabase
    .from('about_content')
    .update({
      title,
      subtitle,
      content,
      updated_at: new Date().toISOString(),
      updated_by: 'admin'
    })
    .eq('id', existing.id)
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data };
}