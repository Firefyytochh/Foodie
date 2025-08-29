"use client";

import { createClient } from "../utils/supabase/client";
import type { User } from "@supabase/supabase-js";

// Send OTP for password reset using resetPasswordForEmail
export async function sendPasswordResetOTP(email: string) {
  const supabase = createClient();
  
  try {
    // This will now send the OTP template instead of magic link
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      console.error('Send reset OTP error:', error);
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Send reset OTP error:', error);
    return { error: "Failed to send verification code." };
  }
}

// Verify the recovery OTP code
export async function verifyPasswordResetOTP(email: string, token: string) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: token,
      type: 'recovery' // Use recovery type for password reset OTP
    });

    if (error) {
      console.error('Verify recovery OTP error:', error);
      return { error: "Invalid or expired verification code." };
    }

    if (data.session) {
      return { success: true, session: data.session };
    }

    return { error: "Verification failed." };
  } catch (error) {
    console.error('Verify recovery OTP error:', error);
    return { error: "Failed to verify code." };
  }
}

// Update password after OTP verification
export async function updatePasswordAfterVerification(newPassword: string) {
  const supabase = createClient();
  
  try {
    // Check if user is authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      return { error: "Session expired. Please verify your code again." };
    }

    // Update the password
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      console.error('Update password error:', error);
      return { error: error.message };
    }

    // Don't automatically sign out - let user stay logged in
    
    return { success: true };
  } catch (error) {
    console.error('Update password error:', error);
    return { error: "Failed to update password." };
  }
}

// Keep all your existing functions unchanged...
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

// Debug function to check session state
export async function debugSessionState() {
  const supabase = createClient();
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    console.log('Debug Session State:', {
      hasSession: !!session,
      sessionUser: session?.user?.email,
      hasUser: !!userData.user,
      directUser: userData.user?.email,
      sessionError: error?.message,
      userError: userError?.message
    });
    
    return {
      session,
      user: userData.user,
      errors: { sessionError: error, userError }
    };
  } catch (error) {
    console.error('Debug session error:', error);
    return { error };
  }
}