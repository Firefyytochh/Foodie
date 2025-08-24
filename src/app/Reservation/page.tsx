"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Users, Phone, Mail, User, ShoppingCart } from "lucide-react";
import { useRouter } from 'next/navigation';

export default function Reservation() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // Move Supabase initialization to useEffect to avoid SSR issues
  useEffect(() => {
    const checkUser = async () => {
      try {
        const { getCurrentUser } = await import('../../action/auth');
        const { user: currentUser } = await getCurrentUser();
        
        if (currentUser) {
          // Get user profile including avatar
          try {
            const { getProfile } = await import('../../action/profile');
            const { data: profile } = await getProfile(currentUser.id);
            
            setUser({
              ...currentUser,
              avatar_url: profile?.avatar_url || null
            });
          } catch (error) {
            setUser(currentUser);
          }
          
          setFormData(prev => ({
            ...prev,
            name: currentUser.user_metadata?.full_name || "",
            email: currentUser.email || ""
          }));
        }
      } catch (error) {
        console.error('Error checking user:', error);
      }
    };

    checkUser();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if user is logged in
      if (!user) {
        alert('Please log in to make a reservation');
        router.push('/login');
        return;
      }

      const { submitReservation } = await import('../../action/reservation');
      const result = await submitReservation(formData);
      
      if (result.success) {
        alert('Reservation submitted successfully!');
        setFormData({
          name: user?.user_metadata?.full_name || "",
          email: user?.email || "",
          phone: "",
          date: "",
          time: "",
          guests: "2"
        });
      } else {
        alert('Failed to submit reservation: ' + result.error);
      }
    } catch (error) {
      console.error('Reservation error:', error);
      alert('Failed to submit reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-orange-200 to-yellow-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-400 to-orange-300 px-6 py-4">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    <Link href="/landingpage" className="flex items-center space-x-2">
      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
        <Image src="/logo.png" alt="Foodie Logo" width={60} height={60} className="rounded-full" />
      </div>
      <span className="text-white text-2xl font-bold hidden sm:block">Foodie</span>
    </Link>

    <nav className="hidden md:flex space-x-8">
      <Link href="/landingpage" className="text-white hover:text-orange-100 transition-colors">Home</Link>
      <Link href="/Aboutus" className="text-white hover:text-orange-100 transition-colors">About Us</Link>
      <Link href="/menu" className="text-white hover:text-orange-100 transition-colors">Menu</Link>
      <Link href="/Reservation" className="text-white hover:text-orange-100 transition-colors font-bold">Reservation</Link>
      <Link href="#footer" className="text-white hover:text-orange-100 transition-colors">Contact</Link>
    </nav>

    <div className="flex items-center space-x-4">
      <Link href="/Cart">
        <ShoppingCart className="w-6 h-6 text-white cursor-pointer hover:text-orange-100" />
      </Link>
      
      {user ? (
        <div className="flex items-center space-x-2">
          <Link href="/Profile">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt="Profile"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover border-2 border-white"
              />
            ) : (
              <User className="w-6 h-6 text-white cursor-pointer hover:text-orange-100" />
            )}
          </Link>
          <button
            onClick={() => {
              // Add logout function
              router.push('/login');
            }}
            className="text-white text-sm hover:text-orange-100 transition-colors"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Link
            href="/login"
            className="text-white hover:text-orange-100 transition-colors px-3 py-1 rounded"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-white text-orange-500 hover:bg-orange-100 transition-colors px-3 py-1 rounded font-medium"
          >
            Sign Up
          </Link>
        </div>
      )}
    </div>
  </div>
</header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-black mb-12 font-serif italic">
          Make a Reservation
        </h1>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4" />
                  Number of Guests
                </label>
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num.toString()}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4" />
                  Time
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select time</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="12:30">12:30 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="13:30">1:30 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="18:30">6:30 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="19:30">7:30 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="20:30">8:30 PM</option>
                  <option value="21:00">9:00 PM</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Make Reservation'}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-orange-800 text-white px-6 py-12 mt-16" id="footer">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Image
                src="/logo.png"
                width={40}
                height={40}
                className="rounded-full"
                alt="Foodie Logo"
              />
            </div>
            <span className="text-2xl font-bold">Foodie</span>
          </div>
          <p className="text-orange-200">Made by food lover for food lover</p>
        </div>
      </footer>
    </div>
  );
}
