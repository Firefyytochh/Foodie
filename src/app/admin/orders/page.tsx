"use client";
import { useEffect, useState, useRef } from "react";
import { getOrders, confirmOrder, deleteOrder, deleteAllOrders } from "@/action/order";

type Order = {
  id: string;
  items?: any;
  total?: number;
  status?: string;
  customer_phone?: string;
  customer_location?: string;
  created_at?: string;
  updated_at?: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [popupOrder, setPopupOrder] = useState<Order | null>(null);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch orders on load
  useEffect(() => {
    const fetchOrders = async () => {
      const result = await getOrders();
      if (result.success && result.data) {
        setOrders(result.data);
        setPendingCount(result.data.filter((o: any) => o.status !== 'confirmed').length);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  // Real-time notification (client-side only)
  useEffect(() => {
    // Only run if window is defined (client)
    if (typeof window === "undefined") return;
    const { createClient } = require("@supabase/supabase-js");
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload: { new: Order }) => {
          const newOrder = payload.new;
          setOrders((prev) => [newOrder, ...prev]);
          if (newOrder.status !== 'confirmed') {
            setPendingCount(count => count + 1);
          }
          setPopupOrder(newOrder);
          if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
          popupTimeoutRef.current = setTimeout(() => setPopupOrder(null), 5000);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
      if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
    };
  }, []);

  // Confirm order handler
  const handleConfirm = async (orderId: string) => {
    const result = await confirmOrder(orderId);
    if (result.success) {
      setOrders(orders =>
        orders.map(order =>
          order.id === orderId ? { ...order, status: "confirmed" } : order
        )
      );
      setPendingCount(count => (count > 0 ? count - 1 : 0));
    } else {
      alert("Failed to confirm order: " + result.error);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) {
      return;
    }
    const result = await deleteOrder(orderId);
    if (result.success) {
      const deletedOrder = orders.find(o => o.id === orderId);
      setOrders(orders => orders.filter(o => o.id !== orderId));
      if (deletedOrder && deletedOrder.status !== 'confirmed') {
        setPendingCount(count => (count > 0 ? count - 1 : 0));
      }
    } else {
      alert("Failed to delete order: " + result.error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete ALL orders? This action cannot be undone.")) {
      return;
    }
    const result = await deleteAllOrders();
    if (result.success) {
      setOrders([]);
      setPendingCount(0);
    } else {
      alert("Failed to delete all orders: " + result.error);
    }
  };

  // Render items
  const renderItems = (items: any) => {
    if (!items) return "-";
    try {
      const arr = typeof items === "string" ? JSON.parse(items) : items;
      return Array.isArray(arr)
        ? arr.map((item: any) => `${item.name} x${item.quantity}`).join(", ")
        : "-";
    } catch {
      return "-";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center gap-2">
        Orders
        {pendingCount > 0 && (
          <span className="inline-block bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {pendingCount}
          </span>
        )}
      </h1>

      <div className="text-center mb-4">
        <button
          onClick={handleDeleteAll}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:bg-red-400"
          disabled={orders.length === 0}
        >
          Delete All Orders
        </button>
      </div>

      {/* Popup Notification */}
      {popupOrder && (
        <div className="fixed top-6 left-1/2 z-50 transform -translate-x-1/2 bg-white shadow-lg rounded-lg border border-green-400 px-6 py-4 flex flex-col items-center animate-fade-in transition-all">
          <div className="flex justify-between w-full items-center mb-2">
            <span className="font-semibold text-green-700">New Order Received!</span>
            <button
              className="ml-4 text-gray-400 hover:text-gray-700"
              onClick={() => setPopupOrder(null)}
            >
              &times;
            </button>
          </div>
          <div className="text-sm text-gray-700 mb-1">
            <strong>Order ID:</strong> {popupOrder.id}
          </div>
          <div className="text-sm text-gray-700 mb-1">
            <strong>Customer Phone:</strong> {popupOrder.customer_phone || "N/A"}
          </div>
          <div className="text-sm text-gray-700 mb-1">
            <strong>Items:</strong> {renderItems(popupOrder.items)}
          </div>
          <div className="text-sm text-gray-700 mb-1">
            <strong>Total:</strong> ${popupOrder.total ?? "N/A"}
          </div>
          <div className="text-xs text-gray-500">
            <strong>Created:</strong>{" "}
            {popupOrder.created_at
              ? new Date(popupOrder.created_at).toLocaleString()
              : "N/A"}
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Items</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Customer Phone</th>
              <th className="py-3 px-4 text-left">Customer Location</th>
              <th className="py-3 px-4 text-left">Created At</th>
              <th className="py-3 px-4 text-left">Updated At</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="py-6 text-center text-gray-500">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-6 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4 font-mono text-xs">{order.id}</td>
                  <td className="py-2 px-4">{renderItems(order.items)}</td>
                  <td className="py-2 px-4">${order.total ?? "N/A"}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded ${order.status === "confirmed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {order.status ?? "pending"}
                    </span>
                  </td>
                  <td className="py-2 px-4">{order.customer_phone ?? "N/A"}</td>
                  <td className="py-2 px-4">{order.customer_location ?? "N/A"}</td>
                  <td className="py-2 px-4 text-xs">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4 text-xs">
                    {order.updated_at
                      ? new Date(order.updated_at).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    {order.status !== "confirmed" && (
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        onClick={() => handleConfirm(order.id)}
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      onClick={() => handleDelete(order.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease;
        }
      `}</style>
    </div>
  );
}
