"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ShoppingCart, User, Phone, Mail, Calendar as CalendarIcon } from "lucide-react" 
import Image from "next/image"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar" 
import { format } from "date-fns" 
import { cn } from "@/lib/utils" 
import { createReservation } from "../../action/reservation"
import { useRouter } from "next/navigation"
import { createClient } from "../../../utils/supabase/client"

interface User {
  id: string;
  email: string;
}

export default function FoodieReservation() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();
    const supabase = createClient();

    // Check if user is logged in
    useEffect(() => {
        const checkUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                
                if (error || !user) {
                    alert('Please log in to make a reservation');
                    router.push('/login');
                    return;
                }
                
                setUser(user);
            } catch (error) {
                console.error('Auth error:', error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, [supabase.auth, router]);

    // Restrict phone input: only allow numbers starting with 0
    const validatePhone = (value: string) => {
        return /^0\d{7,}$/.test(value); // starts with 0, at least 8 digits
    };

    // Restrict email input: must be a valid email format
    const validateEmail = (value: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    };

    // Restrict special notes: max 200 characters
    const validateSpecialNotes = (value: string) => {
        return value.length <= 200;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!user) {
            alert('Please log in to make a reservation');
            router.push('/login');
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);

        // Phone validation
        const phone = formData.get('phone') as string;
        if (!validatePhone(phone)) {
            alert('Phone number must start with 0 and be at least 8 digits.');
            setIsSubmitting(false);
            return;
        }

        // Email validation
        const email = formData.get('email') as string;
        if (!validateEmail(email)) {
            alert('Please enter a valid email address (e.g., Example@gmail.com).');
            setIsSubmitting(false);
            return;
        }

        // Special notes validation
        const specialNotes = formData.get('specialNotes') as string;
        if (!validateSpecialNotes(specialNotes)) {
            alert('Special notes must be 200 characters or less.');
            setIsSubmitting(false);
            return;
        }

        // Add the selected date to form data
        if (date) {
            formData.set('reservationDate', format(date, 'yyyy-MM-dd'));
        }

        // Pass userId as second parameter
        const result = await createReservation(formData, user.id);

        if (result.error) {
            alert(`Error: ${result.error.message}`);
        } else {
            alert('Reservation created successfully!');
            router.push('/Rdone');
        }

        setIsSubmitting(false);
    };

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-300 via-orange-200 to-yellow-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">⏳</div>
                    <p className="text-orange-800 text-lg">Checking authentication...</p>
                </div>
            </div>
        );
    }

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
                <h1 className="text-4xl font-bold text-gray-800 italic">Make Your Reservation</h1>
                {user && (
                    <p className="text-lg text-gray-700">Welcome, {user.email}!</p>
                )}
            </div>

            {/* Main Content */}
            <div className="px-6 py-8">
                {/* Foodie Logo Section */}
                <div className="text-center mb-12">
                                        <Image src="/logo.png" alt="Foodie Logo" width={96} height={96} className="h-24 w-auto mx-auto mb-4" />
                    <h2 className="text-4xl font-bold text-gray-800 italic mb-8">Please Enter Your Information</h2>
                </div>

                {/* Form */}
                <form ref={formRef} onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
                    {/* Name Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-2xl font-bold text-gray-800 mb-2">First Name *</label>
                            <Input 
                                name="firstName"
                                placeholder="First Name" 
                                required
                                className="h-12 bg-white/80 border-gray-300 transition-transform duration-200 hover:scale-105" 
                            />
                        </div>
                        <div>
                            <label className="block text-2xl font-bold text-gray-800 mb-2">Last Name *</label>
                            <Input 
                                name="lastName"
                                placeholder="Last Name" 
                                required
                                className="h-12 bg-white/80 border-gray-300 transition-transform duration-200 hover:scale-105" 
                            />
                        </div>
                    </div>

                    {/* Email Section */}
                    <div>
                        <label className="block text-2xl font-bold text-gray-800 mb-2">Email *</label>
                        <Input 
                            name="email"
                            type="email"
                            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                            placeholder="Example@gmail.com"
                            required
                            className="h-12 bg-white/80 border-gray-300 max-w-2xl transition-transform duration-200 hover:scale-105" 
                            title="Please enter a valid email address (e.g., Example@gmail.com)"
                        />
                    </div>

                    {/* Phone Number Section */}
                    <div>
                        <label className="block text-2xl font-bold text-gray-800 mb-2">Phone Number *</label>
                        <Input 
                            name="phone"
                            type="tel"
                            pattern="0\d{7,}"
                            placeholder="Enter your phone number (start with 0)"
                            required
                            className="h-12 bg-white/80 border-gray-300 max-w-2xl transition-transform duration-200 hover:scale-105" 
                            title="Phone number must start with 0 and be at least 8 digits"
                        />
                    </div>

                    {/* Number of Guests */}
                    <div>
                        <label className="block text-2xl font-bold text-gray-800 mb-2">Number of Guests *</label>
                        <Input 
                            name="guestCount"
                            type="number"
                            min="1"
                            max="20"
                            placeholder="Enter number of guests" 
                            required
                            className="h-12 bg-white/80 border-gray-300 max-w-2xl transition-transform duration-200 hover:scale-105" 
                        />
                    </div>

                    {/* Reservation Date and Time */}
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">Reservation Date and Time</h3>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Date Section */}
                            <div>
                                <h4 className="text-xl font-bold text-gray-800 mb-4">Date *</h4>
                                <div className="relative">
                                    <Button
                                        type="button"
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
                                                disabled={(date) => date < new Date()}
                                                initialFocus
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Time Section */}
                            <div>
                                <h4 className="text-xl font-bold text-gray-800 mb-4">Time *</h4>
                                <Input 
                                    name="reservationTime"
                                    type="time"
                                    required
                                    className="h-12 bg-white/80 border-gray-300 mb-6 transition-transform duration-200 hover:scale-105" 
                                />

                                {/* Location Map */}
                                <div className="mb-4 transition-transform duration-200 hover:scale-105">
                                    <Link href="https://www.google.com/maps/place/Phnom+Penh+location">
                                        <Image src="/location.png" alt="Location Map" width={128} height={96} className="w-32 h-24 rounded border" />
                                        <p className="text-sm text-gray-600 mt-1">Here is the location</p>
                                    </Link>
                                </div>

                                {/* Special Notes */}
                                <div>
                                    <label className="block text-lg font-bold text-gray-800 mb-2">Special Notes</label>
                                    <Textarea 
                                        name="specialNotes"
                                        maxLength={200}
                                        placeholder="Any special requests or dietary requirements... (max 200 characters)" 
                                        className="bg-white/80 border-gray-300 h-24 transition-transform duration-200 hover:scale-105" 
                                    />
                                    <span className="text-xs text-gray-500 block mt-1">Max 200 characters</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reserve Button */}
                    <div className="text-center pt-8 transition-transform duration-200 hover:scale-105">
                        <Button 
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-12 py-4 text-xl font-bold rounded-full disabled:opacity-50"
                        >
                            {isSubmitting ? 'Creating Reservation...' : 'Reserve'}
                        </Button>
                    </div>
                </form>
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
                  <a href="mailto:foodieburgerr@gmail.com" className="underline">foodieburgerr@gmail.com</a>
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
