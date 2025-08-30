"use client";
import { useEffect, useState, useRef } from "react";
import { getReservations, confirmReservation, declineReservation, deleteReservation, deleteAllReservations } from "@/action/reservation";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Reservation = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  guest_count: number;
  reservation_date: string;
  reservation_time: string;
  special_notes?: string;
  status: string;
};
export default function AdminReservationsPage() {
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const popupTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [popupReservation, setPopupReservation] = useState<Reservation | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const result = await getReservations();
        if (result.data && Array.isArray(result.data)) {
          setReservations(
            result.data.map((r: any) => ({
              id: r.id,
              user_id: r.user_id ?? "",
              first_name: r.first_name,
              last_name: r.last_name,
              email: r.email,
              phone: r.phone,
              guest_count: r.guest_count,
              reservation_date: r.reservation_date,
              reservation_time: r.reservation_time,
              special_notes: r.special_notes,
              status: r.status,
            }))
          );
          setPendingCount(result.data.filter((r: any) => r.status === "pending").length);
        } else {
          setReservations([]);
          setPendingCount(0);
        }
      } catch (err) {
        setReservations([]);
        setPendingCount(0);
      }
      setLoading(false);
    };
    fetchReservations();
  }, []);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const channel = supabase
      .channel("reservations-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reservations" },
        (payload: { new: Reservation }) => {
          const newReservation = payload.new;
          setReservations(prev => [newReservation, ...prev]);
          setPendingCount(count => count + (newReservation.status === "pending" ? 1 : 0));
          setPopupReservation(newReservation);
          if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
          popupTimeoutRef.current = setTimeout(() => setPopupReservation(null), 5000);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
      if (popupTimeoutRef.current) clearTimeout(popupTimeoutRef.current);
    };
  }, []);

  const handleConfirm = async (id: string) => {
    const result = await confirmReservation(id);
    if (result.success) {
      setReservations(res =>
        res.map(r => r.id === id ? { ...r, status: "confirmed" } : r)
      );
      setPendingCount(count =>
        count > 0 ? count - 1 : 0
      );
    } else {
      alert("Failed to confirm: " + result.error);
    }
  };

  const handleDecline = async (id: string) => {
    const result = await declineReservation(id);
    if (result.success) {
      setReservations(res =>
        res.map(r => r.id === id ? { ...r, status: "declined" } : r)
      );
      setPendingCount(count =>
        count > 0 ? count - 1 : 0
      );
    } else {
      alert("Failed to decline: " + result.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this reservation?")) {
      return;
    }
    const result = await deleteReservation(id);
    if (result.success) {
      setReservations(reservations => reservations.filter(r => r.id !== id));
    } else {
      alert("Failed to delete: " + result.error);
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete ALL reservations? This action cannot be undone.")) {
      return;
    }
    const result = await deleteAllReservations();
    if (result.success) {
      setReservations([]);
      setPendingCount(0);
    } else {
      alert("Failed to delete all reservations: " + result.error);
    }
  };

  return (
              
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 px-4 py-8">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/admin/dashboard')}
              >
                ← Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 text-center item-center">Menu Management</h1>
            </div>
            
        {pendingCount > 0 && (
          <span className="inline-block bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {pendingCount}
          </span>
        )}
        <div className="text-center mb-4">
        <button
          onClick={handleDeleteAll}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:bg-red-400 item-center"
          disabled={reservations.length === 0}
        >
          Delete All Reservations
        </button>
      </div>
      </div>
      </div>
      
      </header>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-4 text-left">Reservation ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Guests</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Time</th>
              <th className="py-3 px-4 text-left">Notes</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11} className="py-6 text-center text-gray-500">
                  Loading reservations...
                </td>
              </tr>
            ) : reservations.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-6 text-center text-gray-500">
                  No reservations found.
                </td>
              </tr>
            ) : (
              reservations.map(reservation => (
                <tr key={reservation.id} className="border-t border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4 font-mono text-xs">{reservation.id}</td>
                  <td className="py-2 px-4">{reservation.first_name} {reservation.last_name}</td>
                  <td className="py-2 px-4">{reservation.email}</td>
                  <td className="py-2 px-4">{reservation.phone}</td>
                  <td className="py-2 px-4">{reservation.guest_count}</td>
                  <td className="py-2 px-4">{reservation.reservation_date}</td>
                  <td className="py-2 px-4">{reservation.reservation_time}</td>
                  <td className="py-2 px-4">{reservation.special_notes || "-"}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded ${reservation.status === "confirmed" ? "bg-green-100 text-green-700" : reservation.status === "declined" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                      {reservation.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    {reservation.status === "pending" && (
                      <>
                        <button
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                          onClick={() => handleConfirm(reservation.id)}
                        >
                          Confirm
                        </button>
                        <button
                          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                          onClick={() => handleDecline(reservation.id)}
                        >
                          Decline
                        </button>
                      </>
                    )}
                    <button
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      onClick={() => handleDelete(reservation.id)}
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
      {popupReservation && (
        <div className="fixed top-6 right-6 z-50 bg-white border border-red-400 shadow-lg rounded-lg px-6 py-4 flex items-center gap-4 animate-bounce">
          <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            +1
          </span>
          <span className="text-gray-800 font-medium">
            New reservation from {popupReservation.first_name} {popupReservation.last_name}
          </span>
        </div>
      )}

    </div>
  );
}