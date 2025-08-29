"use server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for admin actions
);

export async function getOrders() {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("id, items, total, status, customer_phone, customer_location, created_at") // Removed updated_at
      .order("created_at", { ascending: false });

    return { success: true, data, error };
  } catch (error: any) {
    return { success: false, data: [], error: error.message || "Unknown error" };
  }
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
  try {
    console.log('Confirming order with ID:', orderId);
    
    if (!orderId || orderId.trim() === '') {
      throw new Error('Invalid order ID provided');
    }

    // Simple update without updated_at
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'confirmed'
      })
      .eq('id', orderId);
    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }

    console.log('Order status updated successfully');
    return { success: true, data: { id: orderId, status: 'confirmed' } };
    
  } catch (error) {
    console.error('Error confirming order:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to confirm order'
    };
  }
}

export async function deleteOrder(orderId: string) {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', orderId);

  if (error) {
    console.error("Error deleting order:", error.message);
    return { success: false, error: error.message };
  }
  return { success: true };
}

export async function deleteAllOrders() {
  const { error } = await supabase
    .from('orders')
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (error) {
    console.error("Error deleting all orders:", error.message);
    return { success: false, error: error.message };
  }
  return { success: true };
}