import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ShoppingCart, User, Edit3, FileText, CreditCard, MapPin, ScrollText, HelpCircle, Mail, Phone } from 'lucide-react'

export default function UserProfile() {
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
            <Link href="/Aboutus" className="text-white hover:text-orange-100 transition-colors">About Us</Link>
            <Link href="/menu" className="text-white hover:text-orange-100 transition-colors">Menu</Link>
            <Link href="#footer" className="text-white hover:text-orange-100 transition-colors">Contact</Link>
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-black mb-12 font-serif italic">
          User Profile
        </h1>

        {/* Profile Information Cards */}
        <div className="space-y-6 mb-12">
          {/* Name Field */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg transition-transform duration-200 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Name</p>
                <p className="text-xl font-semibold text-black">Pery Somnang</p>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black">
                <Edit3 className="h-5 w-5" />
              </Button>
            </div>
          </Card>

          {/* Email Field */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg transition-transform duration-200 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-xl font-semibold text-black">Perysomnang24$kit.edu.kh</p>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black">
                <Edit3 className="h-5 w-5" />
              </Button>
            </div>
          </Card>

          {/* Mobile Number Field */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg transition-transform duration-200 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mobile Number</p>
                <p className="text-xl font-semibold text-black">0965582129</p>
              </div>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-black">
                <Edit3 className="h-5 w-5" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Top Row */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-transform duration-200 hover:scale-105 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <FileText className="h-8 w-8 mb-3 text-black" />
              <span className="font-semibold text-black">Order</span>
            </div>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-transform duration-200 hover:scale-105 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <CreditCard className="h-8 w-8 mb-3 text-black" />
              <span className="font-semibold text-black">Payments</span>
            </div>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-transform duration-200 hover:scale-105 cursor-pointer">
            <div className="flex flex-col items-center text-center">
              <MapPin className="h-8 w-8 mb-3 text-black" />
              <span className="font-semibold text-black">Address</span>
            </div>
          </Card>

          {/* Bottom Row */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-transform duration-200 hover:scale-105 cursor-pointer col-span-1">
            <div className="flex items-center">
              <ScrollText className="h-6 w-6 mr-3 text-black" />
              <span className="font-semibold text-black">Term of Service</span>
            </div>
          </Card>

          <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-transform duration-200 hover:scale-105 cursor-pointer col-span-1">
            <div className="flex items-center">
              <HelpCircle className="h-6 w-6 mr-3 text-black" />
              <span className="font-semibold text-black">Help</span>
            </div>
          </Card>
        </div>

        {/* Logout Button */}
        <div className="flex justify-center">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold text-lg">
            Log out
          </Button>
        </div>
      </main>

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
            <div className="space-y-2 text-orange-200">
              <div>About us</div>
              <div>Menu</div>
              <div>Cart</div>
              <div>Favorite</div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Main Menu</h4>
            <div className="space-y-2 text-orange-200">
              <div>Cheese Burger</div>
              <div>Drink</div>
              <div>Best</div>
              <div>Reservation</div>
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
