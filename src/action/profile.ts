"use server";

import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function uploadProfileImage(formData: FormData, userId: string) {
  try {
    const file = formData.get('avatar') as File;
    if (!file) {
      return { error: 'No file provided' };
    }

    const supabaseAdmin = getSupabaseAdmin();
    
    // Create a clean filename
    const fileExt = file.name.split('.').pop();
    const cleanFileName = `${userId}/avatar.${fileExt}`; // Simple, clean filename
    
    // Delete old avatar first (optional)
    await supabaseAdmin.storage
      .from('avatars')
      .remove([`${userId}/avatar.jpg`, `${userId}/avatar.png`, `${userId}/avatar.jpeg`]);
    
    // Upload new file
    const { data: uploadData, error: uploadError } = await supabaseAdmin
      .storage
      .from('avatars')
      .upload(cleanFileName, file, {
        upsert: true,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { error: uploadError.message };
    }

    // Get the public URL
    const { data: urlData } = supabaseAdmin
      .storage
      .from('avatars')
      .getPublicUrl(cleanFileName);

    const publicUrl = urlData.publicUrl;
    console.log('Generated public URL:', publicUrl);
    
    // Update profile table
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        avatar_url: publicUrl
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return { error: updateError.message };
    }

    return { 
      success: true, 
      url: publicUrl
    };
    
  } catch (error: unknown) {
    console.error('Upload function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return { error: errorMessage };
  }
}

export async function getProfile(userId: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('username, avatar_url, phone_number')  // Changed from 'phone' to 'phone_number'
      .eq('id', userId)
      .single();
    
    if (error && error.code === 'PGRST116') {
      return { data: null, error: null };
    }
      
    return { data, error };
  } catch (error) {
    if (error instanceof Error) {
        return { data: null, error: error.message };
    }
    return { data: null, error: "An unknown error occurred" };
  }
}

export async function updateProfile(userId: string, updates: {
  username?: string;
  phone_number?: string;  // Changed from 'phone' to 'phone_number'
}) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId);
      
    if (error) return { error: error.message };
    
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
        return { error: error.message };
    }
    return { error: "An unknown error occurred" };
  }
}