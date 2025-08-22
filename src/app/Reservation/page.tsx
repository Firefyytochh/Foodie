"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingCart, User, Menu, Phone, Mail, MapPin, Calendar as CalendarIcon } from "lucide-react" 
import Image from "next/image"

import Link from "next/link"
import { Calendar } from "@/components/ui/calendar" 
import { format } from "date-fns" 
import { cn } from "@/lib/utils" 

export default function FoodieReservation() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-300 via-orange-200 to-yellow-100">
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
                        <Link href="/about" className="text-white hover:text-orange-100 transition-colors">About Us</Link>
                        <Link href="/menu" className="text-white hover:text-orange-100 transition-colors">Menu</Link>
                        <Link href="/contact" className="text-white hover:text-orange-100 transition-colors">Contact</Link>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <Link href="/Cart">
                            <ShoppingCart className="w-6 h-6 text-white cursor-pointer hover:text-orange-100" />
                        </Link>
                        <Link href="/Profile">
                            <User className="w-6 h-6 text-white cursor-pointer hover:text-orange-100" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* Thank You Message */}
            <div className="flex items-center justify-between px-6 py-8 bg-gradient-to-r from-orange-300 to-orange-200">
                <h1 className="text-4xl font-bold text-gray-800 italic">Thank You for your Reservation</h1>
            </div>

            {/* Main Content */}
            <div className="px-6 py-8">
                {/* Foodie Logo Section */}
                <div className="text-center mb-12">
                    <img src="/logo.png" alt="Foodie Logo" className="h-24 w-auto h-70 mx-auto mb-4" />
                    <h2 className="text-4xl font-bold text-gray-800 italic mb-8 ">Please Enter Your Information</h2>
                </div>

                {/* Form */}
                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Name Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-2xl font-bold text-gray-800 mb-2">Name</label>
                            <Input placeholder="First Name" className="h-12 bg-white/80 border-gray-300 transition-transform duration-200 hover:scale-105" />
                            <p className="text-sm text-gray-600 mt-1">First Name</p>
                        </div>
                        <div>
                            <div className="mt-10">
                                <Input placeholder="Last Name" className="h-12 bg-white/80 border-gray-300 transition-transform duration-200 hover:scale-105" />
                                <p className="text-sm text-gray-600 mt-1">Last Name</p>
                            </div>
                        </div>
                    </div>

                    {/* Gmail Section */}
                    <div>
                        <label className="block text-2xl font-bold text-gray-800 mb-2">Gmail</label>
                        <Input placeholder="Enter your Gmail" className="h-12 bg-white/80 border-gray-300 max-w-2xl transition-transform duration-200 hover:scale-105" />
                        <p className="text-sm text-gray-600 mt-1">Enter your Gmail</p>
                    </div>

                    {/* Phone Number Section */}
                    <div>
                        <label className="block text-2xl font-bold text-gray-800 mb-2">Phone No</label>
                        <Input placeholder="Enter your Phone No." className="h-12 bg-white/80 border-gray-300 max-w-2xl transition-transform duration-200 hover:scale-105" />
                        <p className="text-sm text-gray-600 mt-1">Enter your Phone No.</p>
                    </div>

                    {/* Number of Guests */}
                    <div>
                        <label className="block text-2xl font-bold text-gray-800 mb-2">No of Guess</label>
                        <Input placeholder="Enter No. of guess" className="h-12 bg-white/80 border-gray-300 max-w-2xl transition-transform duration-200 hover:scale-105" />
                        <p className="text-sm text-gray-600 mt-1">Enter No. of guess</p>
                    </div>

                    {/* Reservation Date and Time */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Reservation Date and Time</h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Date Section */}
                            <div>
                                <h4 className="text-xl font-bold text-gray-800 mb-4">Date</h4>
                                <div className="relative">
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[280px] justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                        onClick={() => setIsCalendarOpen(!isCalendarOpen)} 
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                    {isCalendarOpen && (
                                        <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded-md shadow-lg p-0">
                                            <Calendar
                                                mode="single"
                                                selected={date}
                                                onSelect={(selectedDate) => {
                                                    setDate(selectedDate);
                                                    setIsCalendarOpen(false); 
                                                }}
                                                initialFocus
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Time Section */}
                            <div>
                                <h4 className="text-xl font-bold text-gray-800 mb-4">Time</h4>
                                <Input placeholder="Enter the time you will come" className="h-12 bg-white/80 border-gray-300 mb-2 transition-transform duration-200 hover:scale-105" />
                                <p className="text-sm text-gray-600 mb-6">Enter the time you will come</p>

                                {/* Location Map */}
                                <div className="mb-4 transition-transform duration-200 hover:scale-105">
                                    <Link href="https://www.google.com/maps/place/Phnom+Penh+location">
                                        <img src="/location.png" alt="Location Map" className="w-32 h-24 rounded border" />
                                        <p className="text-sm text-gray-600 mt-1">Here is the location</p>
                                    </Link>
                                </div>

                                {/* Special Notes */}
                                <div>
                                    <Textarea placeholder="Special Notes" className="bg-white/80 border-gray-300 h-24 transition-transform duration-200 hover:scale-105" />
                                    <p className="text-sm text-gray-600 mt-1">Special Notes</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reserve Button */}
                    <div className="text-center pt-8 transition-transform duration-200 hover:scale-105">
                        <Link href="/Rdone">
                        <Button className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 text-xl font-bold rounded-full">
                            Reserve
                        </Button>
                        </Link>
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
              <div className="space-y-2 text-orange-200 underline">
                <Link href="/Aboutus">About us</Link>

              </div>
              <div className="space-y-2 text-orange-200  underline">

                <Link href="/menu">Menu</Link>

              </div>
              <div className="space-y-2 text-orange-200  underline">

                <Link href="/Cart">Cart</Link>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Main Menu</h4>
              <div className="space-y-2 text-orange-200  underline">
                <Link href="/landingpage?category=burger ">Burger</Link>


              </div>
              <div className="space-y-2 text-orange-200  underline">

                <Link href="/landingpage?category=drink">Drink</Link>

              </div>
              <div className="space-y-2 text-orange-200  underline">

                <Link href="/landingpage?category=ice-cream">Ice Cream</Link>

              </div>
              <div className="space-y-2 text-orange-200  underline">

                <Link href="/landingpage?category=dessert">Dessert</Link>

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
    )
}
