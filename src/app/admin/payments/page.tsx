"use client";
import { useEffect, useState, useRef } from "react";
import { getPayments, confirmPayment, deletePayment, deleteAllPayments } from "@/action/payment";
import { createClient } from "@supabase/supabase-js";

type Payment = {
  id: string;
  order_id: string;
  payment_method: string;
  payment_status: string;
  items: any;
  subtotal: number;
  shipping_cost: number;
  customer_phone: string;
  customer_location: string;
  card_last_four?: string;
  card_type?: string;
  cardholder_name?: string;
  created_at?: string;
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [popupPayment, setPopupPayment] = useState<Payment | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      const result = await getPayments();
      if (result.error) {
        setError((result.error as any).message || "An unknown error occurred.");
        setPayments([]);
        setPendingCount(0);
      } else if (result.data && Array.isArray(result.data)) {
        setPayments(result.data);
        setPendingCount(result.data.filter((p: any) => p.payment_status === "pending").length);
      } else {
        setPayments([]);
        setPendingCount(0);
      }
      setLoading(false);
    };
    fetchPayments();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const channel = supabase
      .channel("payments-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "payments" },
        (payload: { new: Payment }) => {
          const newPayment = payload.new;
          setPayments(prev => [newPayment, ...prev]);
          setPendingCount(count => count + (newPayment.payment_status === "pending" ? 1 : 0));
          setPopupPayment(newPayment);
          if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
          popupTimeoutRef.current = setTimeout(() => setPopupPayment(null), 5000);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
      if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
    };
  }, []);

  const handleConfirm = async (id: string) => {
    const result = await confirmPayment(id);
    if (result.success) {
      setPayments(payments =>
        payments.map(p => p.id === id ? { ...p, payment_status: "completed" } : p)
      );
      setPendingCount(count => (count > 0 ? count - 1 : 0));
    } else {
      alert("Failed to confirm: " + result.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment?")) {
      return;
    }
    const result = await deletePayment(id);
    if (result.success) {
      setPayments(payments => payments.filter(p => p.id !== id));
    } else {
      alert("Failed to delete: " + result.error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete ALL payments? This action cannot be undone.")) {
      return;
    }
    const result = await deleteAllPayments();
    if (result.success) {
      setPayments([]);
      setPendingCount(0);
    } else {
      alert("Failed to delete all payments: " + result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 flex items-center justify-center gap-2">
        Payments
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
          disabled={payments.length === 0}
        >
          Delete All Payments
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 text-left">Payment ID</th>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Method</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Items</th>
              <th className="py-3 px-4 text-left">Subtotal</th>
              <th className="py-3 px-4 text-left">Shipping</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Location</th>
              <th className="py-3 px-4 text-left">Card Last 4</th>
              <th className="py-3 px-4 text-left">Card Type</th>
              <th className="py-3 px-4 text-left">Card Holder</th>
              <th className="py-3 px-4 text-left">Created At</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={14} className="py-6 text-center text-gray-500">
                  Loading payments...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={14} className="py-6 text-center text-red-500">
                  Error: {error}
                </td>
              </tr>
            ) : payments.length === 0 ? (
              <tr>
                <td colSpan={14} className="py-6 text-center text-gray-500">
                  No payments found.
                </td>
              </tr>
            ) : (
              payments.map(payment => (
                <tr key={payment.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4 font-mono text-xs">{payment.id}</td>
                  <td className="py-2 px-4 font-mono text-xs">{payment.order_id}</td>
                  <td className="py-2 px-4">{payment.payment_method}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded ${
                      payment.payment_status === "completed" || payment.payment_status === "confirmed"
                        ? "bg-green-100 text-green-700" 
                        : payment.payment_status === "declined" 
                          ? "bg-red-100 text-red-700" 
                          : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {payment.payment_status}
                    </span>
                  </td>
                  <td className="py-2 px-4">{JSON.stringify(payment.items)}</td>
                  <td className="py-2 px-4">${payment.subtotal}</td>
                  <td className="py-2 px-4">${payment.shipping_cost}</td>
                  <td className="py-2 px-4">{payment.customer_phone}</td>
                  <td className="py-2 px-4">{payment.customer_location}</td>
                  <td className="py-2 px-4">{payment.card_last_four ?? "-"}</td>
                  <td className="py-2 px-4">{payment.card_type ?? "-"}</td>
                  <td className="py-2 px-4">{payment.cardholder_name ?? "-"}</td>
                  <td className="py-2 px-4 text-xs">{payment.created_at ? new Date(payment.created_at).toLocaleString() : "-"}</td>
                  <td className="py-2 px-4 flex gap-2">
                    {payment.payment_status === "pending" && (
                      <button
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                        onClick={() => handleConfirm(payment.id)}
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      onClick={() => handleDelete(payment.id)}
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
      {popupPayment && (
        <div className="fixed top-6 right-6 z-50 bg-white border border-red-400 shadow-lg rounded-lg px-6 py-4 flex items-center gap-4 animate-bounce">
          <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            +1
          </span>
          <span className="text-gray-800 font-medium">
            New payment for order {popupPayment.order_id}
          </span>
        </div>
      )}
    </div>
  );
}