"use client";

import { createClient } from "../../utils/supabase/client";
import type { User } from "@supabase/supabase-js";

// Forgot password
export async function forgotPassword(email: string): Promise<{
  error?: string;
  success?: boolean;
  data?: object;
}> {
  if (!email) {
    return { error: "Email is required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Invalid email format." };
  }

  const supabase = createClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/resetpw`;
  
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) return { error: error.message };
    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unexpected error occurred." };
  }
}

// Request password reset
export async function requestPasswordReset(email: string) {
  const supabase = createClient();
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:3000/resetpw',
  });
  
  if (error) {
    return { error: error.message };
  }
  
  return { success: true };
}

// Login function
export async function loginUser(email: string, password: string): Promise<{
  user?: User | null;
  error?: string;
}> {
  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Invalid email format." };
  }

  const supabase = createClient();
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) return { error: error.message };
    return { user: data.user };
  } catch (err) {
    console.error("Network error:", err);
    return { error: "Network error. Check Supabase URL and CORS." };
  }
}

// Logout
export async function logoutUser(): Promise<{
  error?: string;
  success?: boolean;
}> {
  const supabase = createClient();
  
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return { error: error.message };
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to logout." };
  }
}

// Get current user
export async function getCurrentUser(): Promise<{
  user?: User | null;
  error?: string;
}> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) return { error: error.message };
    return { user: data.user };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to get current user." };
  }
}

// Update user profile
export async function updateUserProfile(updates: { 
  data: { 
    full_name: string; 
    mobile: string; 
  } 
}): Promise<{
  user?: User;
  error?: string;
}> {
  if (!updates.data.full_name && !updates.data.mobile) {
    return { error: "At least one field (full_name or mobile) is required for update." };
  }

  const supabase = createClient();
  
  try {
    const { data, error } = await supabase.auth.updateUser(updates);

    if (error) {
      console.error('Error updating profile:', error);
      return { error: error.message };
    }
    return { user: data.user };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Failed to update profile." };
  }
}