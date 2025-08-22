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
    
    if (!file) return { error: 'No file selected' };
    
    const supabaseAdmin = getSupabaseAdmin();
    
    // Upload to Supabase Storage
    const fileName = `${userId}-${Date.now()}.${file.name.split('.').pop()}`;
    const { data, error } = await supabaseAdmin.storage
      .from('avatars')
      .upload(fileName, file);
      
    if (error) return { error: error.message };
    
    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('avatars')
      .getPublicUrl(fileName);
      
    // Update profile
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);
      
    if (updateError) return { error: updateError.message };
    
    return { success: true, url: publicUrl };
  } catch (error: any) {
    return { error: error.message };
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
  } catch (error: any) {
    return { data: null, error: error.message };
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
  } catch (error: any) {
    return { error: error.message };
  }
}