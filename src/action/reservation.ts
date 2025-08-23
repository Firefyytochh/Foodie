"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from 'next/headers';

function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

import { createClient } from "../../utils/supabase/server"; // Import the shared createClient

async function getServerUser() {
  const supabase = createClient(); // Use the shared createClient

  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

export async function createReservation(formData: FormData, userId: string) {
  try {
    if (!userId) {
      return { error: { message: 'You must be logged in to make a reservation' } };
    }

    // Extract form data
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const guestCount = parseInt(formData.get('guestCount') as string);
    const reservationDate = formData.get('reservationDate') as string;
    const reservationTime = formData.get('reservationTime') as string;
    const specialNotes = formData.get('specialNotes') as string;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !guestCount || !reservationDate || !reservationTime) {
      return { error: { message: 'Please fill in all required fields' } };
    }

    // Validate guest count
    if (guestCount < 1 || guestCount > 20) {
      return { error: { message: 'Guest count must be between 1 and 20' } };
    }

    // Validate date (must be today or future)
    const selectedDate = new Date(reservationDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return { error: { message: 'Reservation date must be today or in the future' } };
    }

    const supabaseAdmin = getSupabaseAdmin();
    
    // Insert reservation
    const { data, error } = await supabaseAdmin
      .from('reservations')
      .insert([
        {
          user_id: userId,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          guest_count: guestCount,
          reservation_date: reservationDate,
          reservation_time: reservationTime,
          special_notes: specialNotes?.trim() || null,
          status: 'confirmed'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return { error: { message: 'Failed to create reservation. Please try again.' } };
    }

    return { data, success: true };
    
  } catch (error: any) {
    console.error('Reservation error:', error);
    return { error: { message: 'An unexpected error occurred. Please try again.' } };
  }
}

export async function getUserReservations(userId: string) {
  try {
        const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('reservations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
    
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function getAllReservations() {
  try {
        const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('reservations')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return { data: null, error: error.message };
    }

    return { data, error: null };
    
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}