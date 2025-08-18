import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ShoppingCart, User, Menu, Phone, Mail, MapPin } from 'lucide-react'
import Link from "next/link"
export default function FoodieWebsite() {
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
        {/* Hero Section */}
        <section className="px-6 py-12 md:py-20">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-orange-900 mb-6 leading-tight">
                Best Burger<br />
                For Your Test
              </h1>
              <p className="text-orange-800 text-lg mb-8 leading-relaxed">
                Sink your teeth into the juiciest, most flavorful burgers in town. Freshly grilled, packed with premium ingredients, and served with love – every bite is a celebration of taste.
              </p>
              <div className="flex gap-4">
                <Link href="/Cart">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full text-lg transition-transform duration-200 hover:scale-105">
                    Order Now
                  </Button>
                </Link>
                <Link href="/menu">
                  <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-3 rounded-full text-lg transition-transform duration-200 hover:scale-105">
                    Explore Our Menu
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center transition-transform duration-200 hover:scale-105">
              <Image
                src="/burger1.jpg" // Place your burger image in the public folder
                alt="Delicious burger"
                width={400}
                height={400}
                className="w-full max-w-md"
              />
            </div>
          </div>
        </section>

        {/* Best Sell Section */}
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

        {/* Explore Our Menu Section */}
        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-orange-900 mb-12">Explore Our Menu</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {/* Sidebar Menu */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Menu className="w-5 h-5" />
                  Menu
                </h3>
                <div className="space-y-2">
                  <div className="bg-orange-600 text-white px-4 py-2 rounded-lg font-medium">Burger</div>
                  <div className="text-orange-800 px-4 py-2 hover:bg-orange-100 rounded-lg cursor-pointer">Drink</div>
                  <div className="text-orange-800 px-4 py-2 hover:bg-orange-100 rounded-lg cursor-pointer">Ice Cream</div>
                  <Link href="/Reservation">
                    <div className="text-orange-800 px-4 py-2 hover:bg-orange-100 rounded-lg cursor-pointer">
                      Reservation
                    </div>
                  </Link>
                </div>
              </div>

              {/* Menu Items Grid */}
              <div className="md:col-span-3 grid md:grid-cols-3 gap-6">
                {[
                  { name: "Chicken Burger", price: "$5", rating: 4.8, image: "/Southern-Fried-Chicken-Burger-1-removebg-preview.png" },
                  { name: "Beef Burger", price: "$6", rating: 4.9, image: "/burger1.jpg" },
                  { name: "Double Chicken", price: "$8", rating: 4.7, image: "/double-chicken-burger-1700648383939-removebg-preview.png" },
                  { name: "Sheep Burger", price: "$7", rating: 4.6, image: "/sheepburger-removebg-preview.png" },
                  { name: "Crocodile Burger", price: "$12", rating: 4.5, image: "/Crocodile-removebg-preview.png" },
                  { name: "Banana Ice-Cream", price: "$4", rating: 4.3, image: "/Banana-ice-cream-removebg-preview.png" }
                ].map((item, index) => (
                  <Card key={index} className="overflow-hidden shadow-lg transition-transform duration-200 hover:scale-105">
                    <div className="aspect-square relative">
                      <Image
                        src={`${item.image}?height=200&width=200&query=${item.name.toLowerCase()}`}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold text-center mb-2">{item.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-600">{item.price}</span>
                        <Badge className="bg-orange-600 text-white">Add to cart</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{item.rating}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="px-6 py-16 bg-gradient-to-r from-orange-100 to-orange-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-orange-900 mb-8">About Us</h2>
            <p className="text-xl italic text-orange-800 mb-6">
              "Bite Into Happiness - Fresh, Juicy, Unforgettable."
            </p>
            <p className="text-orange-800 text-lg leading-relaxed mb-8">
              This sparks curiosity and appetite, making visitors want to click Read More. Do you want me to give you 2-3 more variations so you can choose the best one?
            </p>
            <Link href="/Aboutus">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full text-lg transition-transform duration-200 hover:scale-105">
                Read More
              </Button>
            </Link>
          </div>
        </section>

        {/* Customer Testimonials */}
        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="w-80 h-80 bg-orange-600 rounded-full flex items-center justify-center mx-auto">
                  <Image
                    src="/photo_2025-08-14_13-43-10-removebg-preview.png?height=300&width=300"
                    alt="Our Best Chef"
                    width={200}
                    height={200}
                    className="rounded-full transition-transform duration-200 hover:scale-105"
                  />
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-white text-orange-600 px-4 py-2 text-sm font-medium">
                    Our Best Chef 👨‍🍳
                  </Badge>
                </div>
              </div>

              <div>
                <h2 className="text-4xl font-bold text-orange-900 mb-8">
                  What Our Customers Say About Us
                </h2>
                <blockquote className="text-lg text-orange-800 mb-6 leading-relaxed">
                  "I had the pleasure of having fast food at Foodie last night, and I'm still raving about the experience! The attention to detail in presentation and service was impeccable."
                </blockquote>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex gap-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    ))}
                  </div>
                  <div>
                    <div className="font-bold text-orange-900">Customer Feedback</div>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-sm text-orange-700">4.8 (1.1k Reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

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
      </main>
    </div>
  )
}
