"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { isAdmin, clearAdminStatus } from '@/utils/admin';
import Link from 'next/link';
import { getOrders } from "@/action/order";
import { createClient } from '@/utils/supabase/client';

export default function AdminDashboard() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [orderCount, setOrderCount] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!isAdmin()) {
      router.push('/admin/login');
    }
  }, [router]);

  useEffect(() => {
    const fetchOrders = async () => {
      const result = await getOrders();
      if (result.success && result.data) setOrderCount(result.data.length);
    };
    fetchOrders();

    const supabase = createClient();
    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          if (payload.new.status === "accepted") {
            setOrderCount((prev) => (prev !== null ? prev + 1 : 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleLogout = () => {
    clearAdminStatus();
    router.push('/');
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-400"></div>
      </div>
    );
  }

  if (!isAdmin()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Header */}
      <header className="bg-orange-100 border-b border-orange-200 shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo" className="h-10 w-10 rounded-full shadow bg-white" />
              <h1 className="text-3xl font-extrabold text-orange-700 tracking-tight">Admin Dashboard</h1>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => router.push('/')}>View Website</Button>
              <Button
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded shadow transition"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
       
        {/* Section Divider */}
        <div className="border-b border-orange-200 mb-10"></div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href="/admin/menu">
            <div className="bg-white rounded-xl shadow-md p-7 hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="flex items-center">
                <div className="p-4 bg-orange-100 rounded-xl group-hover:bg-orange-200 transition">
                  <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-xl font-semibold text-gray-900">Menu Management</h3>
                  <p className="text-gray-600">Add, edit, and manage menu items</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/about">
            <div className="bg-white rounded-xl shadow-md p-7 hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="flex items-center">
                <div className="p-4 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-xl font-semibold text-gray-900">About Page</h3>
                  <p className="text-gray-600">Edit About Us page content</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/orders">
            <div className="bg-white rounded-xl shadow-md p-7 hover:shadow-xl transition-shadow cursor-pointer group relative">
              <div className="flex items-center">
                <div className="p-4 bg-green-100 rounded-xl group-hover:bg-green-200 transition relative">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {orderCount !== null && orderCount > 0 && (
                    <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow">
                      {orderCount}
                    </span>
                  )}
                </div>
                <div className="ml-5">
                  <h3 className="text-xl font-semibold text-gray-900">Orders</h3>
                  <p className="text-gray-600">
                    {orderCount === null ? "Loading..." : `${orderCount} orders`}
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/reservations">
            <div className="bg-white rounded-xl shadow-md p-7 hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="flex items-center">
                <div className="p-4 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition">
                  <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2M7 8V6a5 5 0 0110 0v2" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-xl font-semibold text-gray-900">Reservations</h3>
                  <p className="text-gray-600">View and manage shop reservations</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/payments">
            <div className="bg-white rounded-xl shadow-md p-7 hover:shadow-xl transition-shadow cursor-pointer group">
              <div className="flex items-center">
                <div className="p-4 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a5 5 0 00-10 0v2M5 9h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2z" />
                  </svg>
                </div>
                <div className="ml-5">
                  <h3 className="text-xl font-semibold text-gray-900">User Payment</h3>
                  <p className="text-gray-600">View and manage payments</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Welcome Message */}
        <div className="mt-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl p-8 text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-3 drop-shadow">Welcome to Foodie Admin Panel!</h2>
          <p className="text-orange-100 text-lg">
            Manage your restaurant&apos;s menu items and content from this dashboard.<br />
            You can add new burgers, update prices, and edit your About Us page.
          </p>
        </div>
      </main>
    </div>
  );
}