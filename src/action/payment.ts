"use server";

import { createClient } from "@supabase/supabase-js";



function getSupabaseAdmin() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  // @ts-ignore
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function createPayment(
  paymentData: {
    orderId: string;
    paymentMethod: 'card' | 'qr';
    items: unknown[];
    subtotal: number;
    shippingCost: number;
    totalAmount: number;
    customerPhone?: string;
    customerLocation?: string;
    cardData?: {
      cardholderName: string;
      cardLastFour: string;
      cardType: string;
    };
  },
  userId: string
) {
  try {
    if (!userId) {
      return { error: { message: 'You must be logged in to make a payment' } };
    }

    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('payments')
      .insert([
        {
          user_id: userId,
          order_id: paymentData.orderId,
          payment_method: paymentData.paymentMethod,
          payment_status: 'pending',
          items: paymentData.items,
          subtotal: paymentData.subtotal,
          shipping_cost: paymentData.shippingCost,
          total_amount: paymentData.totalAmount,
          customer_phone: paymentData.customerPhone,
          customer_location: paymentData.customerLocation,
          card_last_four: paymentData.cardData?.cardLastFour,
          card_type: paymentData.cardData?.cardType,
          cardholder_name: paymentData.cardData?.cardholderName,
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return { error: { message: 'Failed to process payment. Please try again.' } };
    }

    return { data, success: true };
    
  } catch (error: unknown) {
    console.error('Payment error:', error);
    return { error: { message: 'An unexpected error occurred. Please try again.' } };
  }
}

export async function getUserPayments(userId: string) {
  try {
    if (!userId) {
      return { data: null, error: 'User ID is required' };
    }

    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('payments')
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

export async function getPayments() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("payments")
      .select("id, order_id, payment_method, payment_status, items, subtotal, shipping_cost, customer_phone, customer_location, card_last_four, card_type, cardholder_name, created_at, updated_at")
      .order("created_at", { ascending: false });

    return { data, error };
  } catch (error: any) {
    return { data: [], error: error.message || "Unknown error" };
  }
}

export async function confirmPayment(id: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from("payments")
      .update({ payment_status: "confirmed" })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Unknown error" };
  }
}

export async function deletePayment(id: string) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from("payments")
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

export async function deleteAllPayments() {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { error } = await supabaseAdmin
      .from("payments")
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