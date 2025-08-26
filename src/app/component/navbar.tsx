"use client";

import Image from "next/image";
import { ShoppingCart, User } from 'lucide-react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Added
import { useState, useEffect } from 'react';
import { getCurrentUser, logoutUser } from '../../action/auth'; // Corrected path
import { useRouter } from 'next/navigation';
import { getUseCartStore } from "@/store/cart"; // Added

interface User {
  id: string;
}

export default function Navbar() { // Renamed component for clarity
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const useCartStore = getUseCartStore(); // Added
  const { cartItemCount } = useCartStore(); // Added

  useEffect(() => {
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const fetchUser = async () => {
      const { user: currentUser } = await getCurrentUser();
      setUser(currentUser);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-400 to-orange-300 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Foodie Logo"
              width={500}
              height={500}
              className="rounded-full"
            />
          </div>
        </div>

        <nav className="hidden md:flex space-x-8">
          <Link href="/landingpage" className="text-white hover:text-orange-100 transition-colors">Home</Link>
          <Link href="/Aboutus" className="text-white hover:text-orange-100 transition-colors">About Us</Link>
          <Link href="/menu" className="text-white hover:text-orange-100 transition-colors">Menu</Link>
          <Link href="#footer" className="text-white hover:text-orange-100 transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/Cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-white cursor-pointer hover:text-orange-100" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Link>
              <Link href="/Profile">
                <User className="w-6 h-6 text-white cursor-pointer hover:text-orange-100" />
              </Link>
              <Button onClick={handleLogout} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md">Login</Button>
              </Link>
              <Link href="/Signup">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
