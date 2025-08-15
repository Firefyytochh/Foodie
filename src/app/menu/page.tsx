"use client"

import { Search, ShoppingCart, User, Star, Heart, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import Image from "next/image";
import { useState } from 'react'
import Link from "next/link"

const featuredItems = [
  {
    id: 1,
    name: "Cheese Burger",
    price: 6,
    rating: 4.9,
    image: "/cheese_burger-removebg-preview.jpg"
  },
  {
    id: 2,
    name: "Straw berry Ice-Cream",
    price: 3,
    rating: 5,
    image: "/strawberry_ice_cream.jpg"
  },
  {
    id: 3,
    name: "Chicken Burger",
    price: 5,
    rating: 4.8,
    image: "/chicken_burger.jpg"
  }
]

const menuItems = [
  { name: "Chicken Burger", price: 5, rating: 4.9, category: "burger",image: "/Southern-Fried-Chicken-Burger-1-removebg-preview.png" },
  { name: "Beef Burger", price: 5.5, rating: 4.6, category: "burger", image: "/burger1.jpg" },
  { name: "Sheep Burger", price: 8, rating: 4.2, category: "burger", image: "/sheepburger-removebg-preview.png" },
  { name: "Crocodile burger", price: 15, rating: 3.6, category: "burger", image: "/Crocodile-removebg-preview.png" },
  { name: "Vegetable Burger", price: 5, rating: 3.6, category: "burger", image: "/images-removebg-preview.png" },
  { name: "Vegan meat", price: 5, rating: 4.9, category: "burger", image: "/vegan_meat-removebg-preview.png" },
  { name: "Cheese Burger", price: 6, rating: 4, category: "burger", image: "/cheese_burger-removebg-preview.png" },
  { name: "Double Chicken", price: 9, rating: 4.5, category: "burger", image: "/double-chicken-burger-1700648383939-removebg-preview.png" },
  { name: "Family Set", price: 25, rating: 4.3, category: "set", image: "/family-party-removebg-preview.png" },
  { name: "Coke", price: 1, rating: 4.9, category: "drink", image: "/CokeinCan-removebg-preview.png" },
  { name: "Pepsi", price: 1, rating: 4.9, category: "drink", image: "/pepsi-cola-24x033cl-removebg-preview.png" },
  { name: "BoBa", price: 2.5, rating: 4.6, category: "drink", image: "/Bona-removebg-preview.png" },
  { name: "Stawberry Ice-cream", price: 3, rating: 5, category: "dessert", image: "/Strawberry-Ice-Cream-removebg-preview.png" },
  { name: "Banana Ice-cream", price: 3, rating: 4.7, category: "dessert", image: "/Banana-ice-cream-removebg-preview.png" },
  { name: "Chocolate Ice-cream", price: 3, rating: 4.6, category: "dessert", image: "/Chocolate-ice-cream-removebg-preview.png" },
  { name: "Vanilla Ice-cream", price: 3, rating: 4.6, category: "dessert", image: "/vanilla-ice-cream-removebg-preview.png" },
  { name: "Banana+strawberry", price: 3, rating: 4.9, category: "dessert", image: "/fluffy-berry-banana-ice-cream-5-removebg-preview.png" },
  { name: "Kids-set", price: 6, rating: 3.8, category: "set", image: "/beb-hero-kids-meal-removebg-preview.png" },
  { name: "Beef+chicken", price: 8, rating: 4.4, category: "burger", image: "/Beef+chicken-removebg-preview.png" },
  { name: "Sheep+Crocodile", price: 15, rating: 4.7, category: "burger", image: "/Sheep+crocodile-removebg-preview.png" },
  { name: "French fries", price: 3, rating: 5, category: "side", image: "/Air-fried-french-fries-removebg-preview.png" }
]

export default function FoodieWebsite() {
  const [search, setSearch] = useState("");

  const filteredMenu = menuItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

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

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Best Recommendations */}
         <section className="px-6 py-16">
                <div className="max-w-7xl mx-auto">
                  <h2 className="text-4xl font-bold text-center text-orange-900 mb-12">Best Sell</h2>
                  <div className="grid md:grid-cols-3 gap-8">
                    <Card className="overflow-hidden shadow-lg transition-transform duration-200 hover:scale-105">
                      <div className="aspect-square relative">
                        <Image
                          src="/cheese_burger-removebg-preview.png?height=300&width=300"
                          alt="Cheese Burger"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-center mb-4">Cheese Burger</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-orange-600">$6</span>
                          <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6">
                            Add to Cart
                          </Button>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">4.9</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden shadow-lg transition-transform duration-200 hover:scale-105">
                      <div className="aspect-square relative">
                        <Image
                          src="/Strawberry-Ice-Cream-removebg-preview.png?height=300&width=300"
                          alt="Strawberry Ice-Cream"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-center mb-4">Strawberry Ice-Cream</h3>
                        <div className="flex items-center bg-light-orange justify-between">
                          <span className="text-2xl font-bold text-orange-600">$3</span>
                          <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6">
                            Add to Cart
                          </Button>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">5</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="overflow-hidden shadow-lg transition-transform duration-200 hover:scale-105">
                      <div className="aspect-square relative">
                        <Image
                          src="/Southern-Fried-Chicken-Burger-1-removebg-preview.png?height=300&width=300"
                          alt="Chicken Burger"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-center mb-4">Chicken Burger</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-orange-600">$5</span>
                          <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6">
                            Add to Cart
                          </Button>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">4.7</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </section>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for your favorite Burger, drinks and ice cream..."
              className="pl-4 pr-12 py-3 rounded-full border-2 border-orange-200 focus:border-orange-400 bg-white"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Menu Grid */}
        <section>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMenu.map((item, index) => (
              <Card
                key={index}
                className="bg-white rounded-xl shadow-md p-1 transition-transform duration-200 hover:scale-105 w-full max-w-[180px] mx-auto"
              >
                <div className="flex flex-col items-center">
                  {/* Bigger round light orange box behind the image */}
                  <div className="w-24 h-24 mb-2 flex items-center justify-center rounded-full bg-orange-100">
                    <Image
                      src={item.image || "/default.jpg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-center mb-1 text-xs">{item.name}</h3>
                  {/* Price, Add to Cart, Star row */}
                  <div className="flex items-center justify-between w-full mt-2">
                    <span className="font-bold text-xs">{`$${item.price}`}</span>
                    <div className="flex-1 flex justify-center">
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1 rounded">
                        Add to Cart
                      </Button>
                    </div>
                    <div className="flex items-center ml-2">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs ml-1">{item.rating}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
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
