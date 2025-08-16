import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, User, Menu, Phone, Mail, MapPin, Minus, Plus, Trash2 } from 'lucide-react'
import Link from "next/link"
export default function CartPage() {
  const cartItems = [
    {
      id: 1,
      name: "Cheese burger",
      description: "Extra Cheese",
      price: 6,
      quantity: 1,
      image: "/cheese burger.jpg",
    },
    {
      id: 2,
      name: "Chicken Burger",
      description: "Extra Chicken",
      price: 5,
      quantity: 1,
      image: "/double-chicken-burger-1700648383939-removebg-preview.png",
    },
    {
      id: 3,
      name: "Coke",
      description: "No Extra",
      price: 1,
      quantity: 1,
      image: "/CokeinCan-removebg-preview.png",
    },
    {
      id: 4,
      name: "Strawberry Ice-Cream",
      description: "No Extra",
      price: 3,
      quantity: 1,
      image: "/Strawberry-Ice-Cream-removebg-preview.png",
    },
  ]

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const saleTaxes = 1.5
  const grandTotal = subtotal + saleTaxes

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
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 italic">Your Cart</h1>
          </div>

          {/* Cart Table */}
          <div className="bg-orange-200/50 rounded-lg p-6 mb-8">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 mb-6 font-semibold text-gray-800  ">
              <div className="col-span-5">Items</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Total</div>
              <div className="col-span-1"></div>
            </div>

            {/* Cart Items */}
            <div className="space-y-4 ">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm transition-transform duration-200 hover:scale-105">
                  <div className="grid grid-cols-12 gap-4 items-center ">
                    {/* Item Info */}
                    <div className="col-span-5 flex items-center gap-4 ">
                      <div className="w-16 h-16 bg-orange-400 rounded-full flex items-center justify-center overflow-hidden ">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="col-span-2 flex items-center justify-center gap-2">
                      <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent">
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Price */}
                    <div className="col-span-2 text-center font-semibold">{item.price}$</div>

                    {/* Total */}
                    <div className="col-span-2 text-center font-semibold">{item.price * item.quantity}$</div>

                    {/* Delete Button */}
                    <div className="col-span-1 flex justify-center">
                      <Button variant="ghost" size="sm" className="w-8 h-8 p-0 text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="flex justify-end ">
            <div className="w-full max-w-md space-y-4 ">
              {/* Subtotal */}
              <div className="bg-white rounded-lg p-4 flex justify-between items-center transition-transform duration-200 hover:scale-105">
                <span className="font-medium">SubTotal:</span>
                <span className="font-semibold">{subtotal}$</span>
              </div>

              {/* Sale Taxes */}
              <div className="bg-white rounded-lg p-4 flex justify-between items-center transition-transform duration-200 hover:scale-105">
                <span className="font-medium">SaleTaxes:</span>
                <span className="font-semibold">{saleTaxes}$</span>
              </div>

              {/* Coupon Code */}
              <div className="bg-white rounded-lg p-4 transition-transform duration-200 hover:scale-105">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Cupon Code:</span>
                  <Button variant="link" className="text-orange-500 p-0 h-auto font-normal">
                    Add Cupon
                  </Button>
                </div>
              </div>

              {/* Grand Total */}
              <div className="bg-white rounded-lg p-4 flex justify-between items-center border-2 border-orange-200 transition-transform duration-200 hover:scale-105">
                <span className="font-semibold text-lg">Grand Total:</span>
                <span className="font-bold text-lg">{grandTotal.toFixed(2)}$</span>
              </div>

              {/* Check Out Button */}
              <Link href="/payment">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-transform duration-200 hover:scale-105">
                Check Out
              </Button>
              </Link>
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
