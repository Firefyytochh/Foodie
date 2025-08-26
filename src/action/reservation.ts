"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";


function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}



async function getServerUser() {
  const supabase = getSupabaseAdmin(); // Use the shared getSupabaseAdmin

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
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return { error: { message: 'Failed to create reservation. Please try again.' } };
    }

    return { data, success: true };
    
  } catch (error: unknown) {
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
    
  } catch (error: unknown) {
    return { data: null, error: (error as Error).message };
  }
}

export async function getAllReservations() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("reservations")
      .select("id, first_name, last_name, email, phone, guest_count, reservation_date, reservation_time, status")
      .order("created_at", { ascending: false });

    return { data, error };
  } catch (error: any) {
    return { data: [], error: error.message || "Unknown error" };
  }
}

export async function submitReservation(formData: {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
}) {
  try {
    // Get current user first
    const { user, error: userError } = await getServerUser();
    
    if (userError || !user) {
      return { success: false, error: 'You must be logged in to make a reservation' };
    }

    const supabaseAdmin = getSupabaseAdmin();
    
    // Split name into first and last name
    const nameParts = formData.name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    const { data, error } = await supabaseAdmin
      .from('reservations')
      .insert([{
        user_id: user.id,  // Add the required user_id
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        phone: formData.phone,
        reservation_date: formData.date,
        reservation_time: formData.time,
        guest_count: parseInt(formData.guests),
        status: 'pending'  // Match your table default
      }])
      .select()
      .single();

    if (error) {
      console.error('Reservation error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Reservation submission failed:', error);
    return { success: false, error: 'Failed to submit reservation' };
  }
}

export async function getReservations() {
  // For admin: get all reservations
  return await getAllReservations();
}

export async function confirmReservation(id: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from('reservations')
      .update({ status: 'confirmed' })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Unknown error" };
  }
}

export async function declineReservation(id: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from('reservations')
      .update({ status: 'declined' })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Unknown error" };
  }
}

export async function deleteReservation(id: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from("reservations")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Unknown error" };
  }
}

export async function deleteAllReservations() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from("reservations")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Unknown error" };
  }
}