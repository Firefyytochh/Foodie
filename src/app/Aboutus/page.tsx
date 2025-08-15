import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ShoppingCart, User, Menu, Phone, Mail, MapPin } from 'lucide-react'
import Link from "next/link"
export default function AboutPage() {
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
            <Link href="/login">
              <User className="w-6 h-6 text-white cursor-pointer hover:text-orange-100" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-6xl font-bold text-center text-gray-800 mb-8" style={{ fontFamily: "serif" }}>
          About Us
        </h1>

        <p className="text-xl italic text-center text-gray-700 mb-12">
          Bite Into Happiness – Fresh, Juicy, Unforgettable.
        </p>

        <div className="space-y-6 text-gray-800 leading-relaxed">
          <p className="text-lg">
            Welcome to Foodie, where every burger is more than just a meal—it's a moment of pure happiness. We started
            Foodie with one simple mission: to serve the freshest, juiciest, and most flavorful burgers that bring
            people together.
          </p>

          <p className="text-lg">
            Our journey began with a love for quality ingredients and bold flavors. Every burger we serve is made from
            freshly grilled patties, soft and fluffy buns, crisp garden-fresh vegetables, and our signature sauces
            crafted in-house. We believe great food starts with great care—from sourcing the best ingredients to
            perfecting every recipe in our kitchen.
          </p>

          <p className="text-lg">
            At Foodie, variety is our flavor. Whether you're craving a classic cheeseburger, a spicy adventure, or a
            creative twist on a favorite, we've got something for every taste. And because we care about freshness,
            every order is made hot and ready just for you—never pre-made.
          </p>

          <p className="text-lg">
            We're more than a burger shop—we're a place where friends laugh, families connect, and memories are made
            over delicious bites. From our kitchen to your table, we serve with passion, quality, and a smile.
          </p>

          <p className="text-lg">
            So, whether you're dining in, taking out, or ordering online, Foodie is here to make your burger experience
            unforgettable.
          </p>
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
