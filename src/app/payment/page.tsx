'use client'

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, ShoppingCart, User, Menu, Phone, Mail, MapPin } from 'lucide-react'
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCartStore } from "../../store/cart"

export default function CheckoutPage() {
    const { items } = useCartStore();
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = 4;
    const subtotal = totalPrice;
    const finalTotal = totalPrice + shippingCost;
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
            <main className="relative z-10 px-6 py-8">
                <h1 className="text-5xl font-bold text-center text-gray-800 mb-12 italic">Check out</h1>

                <div className="max-w-6xl mx-auto">
                    {/* Location Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Location Link</h2>
                        <Input
                            type="url"
                            placeholder="Paste your location link here (e.g., Google Maps link)"
                            className="w-full max-w-md bg-white/50 transition-transform duration-200 hover:scale-105"
                        />
                    </div>           


                    {/* Phone Number Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Phone Number</h2>
                        <Card className="bg-white/90 backdrop-blur-sm transition-transform duration-200 hover:scale-105">
                            <CardContent className="p-6">
                                <Label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    className="bg-white/50"
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Payment Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment</h2>

                        <div className="grid md:grid-cols-2 gap-8 ">
                            {/* Card Payment */}
                            <Card className="bg-white/90 backdrop-blur-sm transition-transform duration-200 hover:scale-105">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-4">Card Details</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Card type</label>
                                            <div className="flex gap-2">
                                                <div className="w-8 h-5 bg-red-600 rounded bg-white text-white text-xs flex items-center justify-center font-bold">
                                                    <Image
                                                        src="/mastercard-featured-image-1080x628.webp"
                                                        alt="Foodie Logo"
                                                        width={500}
                                                        height={500}
                                                        className="rounded-full"
                                                    />
                                                </div>
                                                <div className="w-8 h-5 bg-blue-600 rounded bg-white text-white text-xs flex items-center justify-center font-bold">
                                                    <Image
                                                        src="/VISA-logo.png"
                                                        alt="Foodie Logo"
                                                        width={500}
                                                        height={500}
                                                        className="rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="block text-sm font-medium mb-2">Name on card</Label>
                                            <Input placeholder="Name" className="bg-white/50" />
                                        </div>

                                        <div>
                                            <Label className="block text-sm font-medium mb-2">Card Number</Label>
                                            <Input placeholder="1111 2222 3333 4444" className="bg-white/50" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="block text-sm font-medium mb-2">Expiration date</Label>
                                                <Input placeholder="mm/yy" className="bg-white/50" />
                                            </div>
                                            <div>
                                                <Label className="block text-sm font-medium mb-2">CVV</Label>
                                                <Input placeholder="123" className="bg-white/50" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Subtotal</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Shipping</span>
                                            <span>${shippingCost.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold">
                                            <span>Total (Tax incl.)</span>
                                            <span>${finalTotal.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Link href="/Paymentdone"><Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white transition-transform duration-200 hover:scale-105">${finalTotal.toFixed(2)} Pay now</Button></Link>
                                </CardContent>
                            </Card>

                            {/* QR Code Payment */}
                            <Card className="bg-white/90 backdrop-blur-sm transition-transform duration-200 hover:scale-105">
                                <CardContent className="p-6">
                                    <div className="text-center mb-4">
                                        <div className="w-48 h-48 mx-auto bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4">
                                            <Image
                                                src="/qrcode.jpg" // Placeholder path for the QR code image
                                                alt="QR Code for Payment"
                                                width={192} // Equivalent to w-48 (48 * 4 = 192px)
                                                height={192} // Equivalent to h-48 (48 * 4 = 192px)
                                                className="rounded-lg"
                                            />
                                        </div>
                                        <p className="text-lg font-medium"></p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Subtotal</span>
                                            <span>${subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Shipping</span>
                                            <span>${shippingCost.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold">
                                            <span>Total (Tax incl.)</span>
                                            <span>${finalTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                    <Link href="/Paymentdone"><Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white transition-transform duration-200 hover:scale-105">${finalTotal.toFixed(2)} Pay now</Button></Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
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
