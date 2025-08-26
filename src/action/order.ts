"use server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for admin actions
);

export async function getOrders() {
  const { data, error } = await supabase.from("orders").select("*");

  if (error) {
    console.error("Error fetching orders:", error.message);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

export async function placeOrder(orderData: any) {
  const { data, error } = await supabase.from("orders").insert([orderData]).select();

  if (error) {
    console.error("Error placing order:", error.message);
    return { success: false, error: error.message };
  }
  return { success: true, data };
}

export async function confirmOrder(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: "confirmed", updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select()
    .maybeSingle();

  return { success: !error, data, error: error?.message };
}