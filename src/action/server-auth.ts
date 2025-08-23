"use server";

import { createClient } from "@supabase/supabase-js";

// Define types for user and profile
interface UserProfile {
    username: string;
    avatar_url: string;
    // Add other profile fields if any
}

interface UserWithProfile {
    id: string;
    email: string;
    role: string;
    profiles: UserProfile | null;
}

function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL environment variable is required')
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function signupUser(
  email: string, 
  password: string, 
  username?: string
): Promise<{
  error?: string;
  userId?: string;
}> {
  console.log('=== CREATING USER ACCOUNT ===');
  console.log('Email:', email);
  console.log('Username:', username);
  
  // Input validation
  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Invalid email format." };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }
  
  const supabaseAdmin = getSupabaseAdmin();

  try {
    // 1. Create the auth user
    console.log('Creating auth user...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since we verified via code
    });

    if (authError || !authData.user) {
      console.error("Auth creation error:", authError);
      return { error: `Failed to create account: ${authError?.message}` };
    }

    const userId = authData.user.id;
    console.log('Auth user created with ID:', userId);

    // 2. Create entry in your custom users table (without 'allowed' column)
    console.log('Creating users table entry...');
    const { error: usersError } = await supabaseAdmin
      .from("users")
      .insert([{
        id: userId,
        email,
        role: 'user'
        // Removed 'allowed: true' since the column doesn't exist
      }]);

    if (usersError) {
      console.error("Users table error:", usersError);
      // Clean up auth user if users table insert fails
      try {
        await supabaseAdmin.auth.admin.deleteUser(userId);
      } catch (deleteError) {
        console.error("Failed to cleanup auth user:", deleteError);
      }
      return { error: `Failed to create user profile: ${usersError.message}` };
    }
    console.log('Users table entry created');

    // 3. Create entry in profiles table
    console.log('Creating profile entry...');
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert([{
        id: userId,
        username: username || email.split('@')[0], // Use email prefix as default username
        updated_at: new Date().toISOString()
      }]);

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // Clean up both auth user and users table entry
      try {
        await supabaseAdmin.auth.admin.deleteUser(userId);
        await supabaseAdmin.from("users").delete().eq("id", userId);
      } catch (deleteError) {
        console.error("Failed to cleanup user data:", deleteError);
      }
      return { error: `Failed to create user profile: ${profileError.message}` };
    }
    console.log('Profile entry created');

    console.log('✅ User account created successfully');
    return { error: undefined, userId };

  } catch (error) {
    console.error("=== SIGNUP ERROR ===");
    console.error('Error:', error);
    return { error: "An unexpected error occurred during account creation." };
  }
}

export async function deleteUser(userId: string): Promise<{
  error?: string;
}> {
  if (!userId) {
    return { error: "User ID is required." };
  }

  const supabaseAdmin = getSupabaseAdmin();

  try {
    // Delete from custom tables first
    await supabaseAdmin.from("profiles").delete().eq("id", userId);
    await supabaseAdmin.from("users").delete().eq("id", userId);
    
    // Delete from auth
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) {
      console.error("Error deleting auth user:", error);
      return { error: error.message };
    }

    return {};
  } catch (error) {
    console.error("Delete user error:", error);
    return { error: "Failed to delete user" };
  }
}

export async function getUserById(userId: string): Promise<{
  user?: UserWithProfile | null;
  error?: string;
}> {
  if (!userId) {
    return { error: "User ID is required." };
  }

  const supabaseAdmin = getSupabaseAdmin();

  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select(`
        *,
        profiles (*)
      `)
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      return { error: error.message };
    }

    return { user: data, error: undefined };
  } catch (error) {
    console.error("Get user error:", error);
    return { error: "Failed to fetch user" };
  }
}