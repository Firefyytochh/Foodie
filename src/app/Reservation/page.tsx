"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Clock, Users, Phone, Mail, User, ShoppingCart, MapPin } from "lucide-react";

export default function Reservation() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleLogout = async () => {
    try {
      const { logoutUser } = await import('../../action/auth');
      await logoutUser();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
<header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-orange-200 px-6 py-4">
  <div className="max-w-7xl mx-auto flex items-center justify-between">
    <Link href="/landingpage" className="flex items-center space-x-2">
      <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
        <Image src="/logo.png" alt="Foodie Logo" width={32} height={32} className="rounded-full" />
      </div>
      <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
        Foodie
      </span>
    </Link>

    {/* Desktop Navigation */}
    <nav className="hidden md:flex space-x-8">
      <Link 
        href="/landingpage" 
        className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
      >
        Home
      </Link>
      <Link 
        href="/Aboutus" 
        className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
      >
        About Us
      </Link>
      <Link 
        href="/menu" 
        className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
      >
        Menu
      </Link>
      <Link 
        href="/Reservation" 
        className="text-orange-600 font-bold border-b-2 border-orange-600"
      >
        Reservation
      </Link>
      <Link 
        href="#footer" 
        className="text-gray-700 hover:text-orange-600 transition-colors font-medium"
      >
        Contact
      </Link>
    </nav>

    {/* Right Side - Cart and User */}
    <div className="flex items-center space-x-4">
      {/* Cart Icon with Badge */}
      <Link href="/Cart" className="relative">
        <div className="p-2 hover:bg-orange-50 rounded-full transition-colors">
          <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-orange-600" />
        </div>
      </Link>

      {user ? (
        /* Logged In State */
        <div className="flex items-center space-x-3">
          {/* Profile Link */}
          <Link href="/Profile" className="flex items-center space-x-2 hover:bg-orange-50 rounded-full p-2 transition-colors">
            {user.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt="Profile"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover border-2 border-orange-200"
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
            <span className="hidden sm:block text-gray-700 font-medium">
              {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Profile'}
            </span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-medium"
          >
            Logout
          </button>
        </div>
      ) : (
        /* Not Logged In State */
        <div className="flex items-center space-x-3">
          <Link
            href="/login"
            className="text-gray-700 hover:text-orange-600 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-orange-50"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
          >
            Sign Up
          </Link>
        </div>
      )}

      {/* Mobile Menu Button */}
      <button className="md:hidden p-2 hover:bg-orange-50 rounded-lg transition-colors">
        <div className="w-6 h-6 flex flex-col justify-center space-y-1">
          <div className="w-full h-0.5 bg-gray-700"></div>
          <div className="w-full h-0.5 bg-gray-700"></div>
          <div className="w-full h-0.5 bg-gray-700"></div>
        </div>
      </button>
    </div>
  </div>

  {/* Mobile Navigation Menu (Hidden by default) */}
  <div className="md:hidden border-t border-orange-200 mt-4 pt-4">
    <nav className="flex flex-col space-y-2">
      <Link 
        href="/landingpage" 
        className="text-gray-700 hover:text-orange-600 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-orange-50"
      >
        Home
      </Link>
      <Link 
        href="/Aboutus" 
        className="text-gray-700 hover:text-orange-600 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-orange-50"
      >
        About Us
      </Link>
      <Link 
        href="/menu" 
        className="text-gray-700 hover:text-orange-600 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-orange-50"
      >
        Menu
      </Link>
      <Link 
        href="/Reservation" 
        className="text-orange-600 font-bold py-2 px-4 rounded-lg bg-orange-50"
      >
        Reservation
      </Link>
      <Link 
        href="#footer" 
        className="text-gray-700 hover:text-orange-600 transition-colors font-medium py-2 px-4 rounded-lg hover:bg-orange-50"
      >
        Contact
      </Link>
    </nav>
  </div>
</header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Make a Reservation</h1>
          <p className="text-xl text-gray-600">Book your table for an unforgettable dining experience</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Guests Field */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 mr-2" />
                  Number of Guests
                </label>
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map(num => (
                    <option key={num} value={num.toString()}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                  ))}
                </select>
              </div>

              {/* Date Field */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Reservation Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Time Field */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  Reservation Time
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select Time</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="12:00">12:00 PM</option>
                  <option value="12:30">12:30 PM</option>
                  <option value="13:00">1:00 PM</option>
                  <option value="13:30">1:30 PM</option>
                  <option value="14:00">2:00 PM</option>
                  <option value="14:30">2:30 PM</option>
                  <option value="15:00">3:00 PM</option>
                  <option value="15:30">3:30 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="18:30">6:30 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="19:30">7:30 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="20:30">8:30 PM</option>
                  <option value="21:00">9:00 PM</option>
                  <option value="21:30">9:30 PM</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? 'Submitting...' : 'Make Reservation'}
              </button>
            </div>
          </form>
        </div>

        {/* Enhanced Reservation Information */}
        <div className="mt-12">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Reservation Information</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-orange-600" />
                </div>
                <p className="font-semibold text-gray-900">Opening Hours</p>
                <p className="text-sm text-gray-600 mt-1">Mon-Thu: 11AM-10PM<br />Fri-Sat: 11AM-11PM<br />Sun: 12PM-9PM</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-8 h-8 text-orange-600" />
                </div>
                <p className="font-semibold text-gray-900">Cancellation</p>
                <p className="text-sm text-gray-600 mt-1">Free cancellation up to 2 hours before your reservation</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-8 h-8 text-orange-600" />
                </div>
                <p className="font-semibold text-gray-900">Contact</p>
                <p className="text-sm text-gray-600 mt-1">Call us at<br />(555) 123-4567<br />for special requests</p>
              </div>
              <div className="text-center">
                <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-orange-600" />
                </div>
                <p className="font-semibold text-gray-900">Group Dining</p>
                <p className="text-sm text-gray-600 mt-1">Parties of 8+ please call ahead for special arrangements</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Location Section */}
      <div className="mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Us</h2>
          <p className="text-xl text-gray-600">Visit our restaurant at this convenient location</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            <div className="h-96 relative">
              <iframe
                src="https://www.google.com/maps/place/Kirirom+National+Park/@11.3194083,104.0841247,11z/data=!4m6!3m5!1s0x3108e916ce8d630f:0x415b7ade62b8f17f!8m2!3d11.3076399!4d104.0397902!16s%2Fm%2F03hh9vh?entry=ttu&g_ep=EgoyMDI1MDgxOS4wIKXMDSoASAFQAw%3D%3D"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-t-2xl"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Interactive Map</h3>
              <p className="text-gray-600">Click and drag to explore the area around our restaurant</p>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-6">
            {/* Address Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Restaurant Address</h3>
                  <p className="text-gray-700 leading-relaxed">
                    123 Food Street<br />
                    Porsenchey District<br />
                    Phnompenh City <br />
                    Cambodia
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Phone className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Contact Information</h3>
                  <div className="space-y-2 text-gray-700">
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-orange-500" />
                      <span>(855) 96-5582129</span>
                    </p>
                    <p className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-orange-500" />
                      <span>reservations@foodie.com</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Directions Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div className="w-full">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Getting Here</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">🚗 By Car</h4>
                      <p className="text-gray-600 text-sm">Free parking available. Take Exit 15 from Highway 101.</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">🚇 Public Transport</h4>
                      <p className="text-gray-600 text-sm">Metro Line 2, stop at Food District Station (5 min walk).</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">🚶 Walking</h4>
                      <p className="text-gray-600 text-sm">Located in the heart of the Porsenchey district, easily accessible on foot.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="https://www.google.com/maps/place/Kirirom+National+Park/@11.3194083,104.0841247,11z/data=!4m6!3m5!1s0x3108e916ce8d630f:0x415b7ade62b8f17f!8m2!3d11.3076399!4d104.0397902!16s%2Fm%2F03hh9vh?entry=ttu&g_ep=EgoyMDI1MDgxOS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/20 hover:bg-white/30 transition-colors rounded-lg p-4 text-center backdrop-blur-sm"
                >
                  <MapPin className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Get Directions</span>
                </a>
                <a
                  href="tel:+855965582129"
                  className="bg-white/20 hover:bg-white/30 transition-colors rounded-lg p-4 text-center backdrop-blur-sm"
                >
                  <Phone className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">Call Us</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Landmark Information */}
      <div className="mt-12">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Nearby Landmarks</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🏛️</span>
              </div>
              <h4 className="font-medium text-gray-900">City Museum</h4>
              <p className="text-sm text-gray-600">2 blocks north</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🛍️</span>
              </div>
              <h4 className="font-medium text-gray-900">Shopping Center</h4>
              <p className="text-sm text-gray-600">1 block east</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🅿️</span>
              </div>
              <h4 className="font-medium text-gray-900">Parking Garage</h4>
              <p className="text-sm text-gray-600">Across the street</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer id="footer" className="bg-orange-800 text-white px-6 py-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
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
            <p className="text-orange-200 mb-4">Made by food lover for food lover</p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Useful links</h4>
            <div className="space-y-2">
              <Link href="/Aboutus" className="block text-orange-200 underline">About us</Link>
              <Link href="/menu" className="block text-orange-200 underline">Menu</Link>
              <Link href="/Cart" className="block text-orange-200 underline">Cart</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Main Menu</h4>
            <div className="space-y-2">
              <Link href="/landingpage?category=burger" className="block text-orange-200 underline">Burger</Link>
              <Link href="/landingpage?category=drink" className="block text-orange-200 underline">Drink</Link>
              <Link href="/landingpage?category=ice-cream" className="block text-orange-200 underline">Ice Cream</Link>
              <Link href="/landingpage?category=dessert" className="block text-orange-200 underline">Dessert</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <div className="space-y-2 text-orange-200">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Foodieburger@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+855 96 55 82 129</span>
              </div>
              <div className="mt-4">
                <div className="font-bold mb-2">Social Media</div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Image
                      src="/face-book-removebg-preview.png"
                      alt="Facebook"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Image
                      src="/instagram-removebg-preview.png"
                      alt="Instagram"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <Image
                      src="/x-removebg-preview.png"
                      alt="X"
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
