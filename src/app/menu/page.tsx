"use client";
import { useEffect, useState } from "react";
import { getMenuItems } from "@/action/admin";
import { getUseCartStore } from "@/store/cart";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, Mail, Phone } from "lucide-react";
import Navbar from "../component/navbar";

// Type for menu items
type MenuItem = {
  id: string;
  name: string;
  price: number;
  rating: number;
  description?: string;
  image_url?: string;
};

// Expanded static items (add all from landing page)
const staticMenuItems: MenuItem[] = [
  {
    id: "1",
    name: "Cheese Burger",
    price: 6,
    rating: 4.9,
    description: "Classic cheese burger with juicy beef patty and cheddar cheese.",
    image_url: "/cheese_burger-removebg-preview.png",
  },
  {
    id: "2",
    name: "Strawberry Ice-Cream",
    price: 3,
    rating: 5,
    description: "Fresh strawberry ice-cream, creamy and sweet.",
    image_url: "/Strawberry-Ice-Cream-removebg-preview.png",
  },
  {
    id: "3",
    name: "Chicken Burger",
    price: 5,
    rating: 4.7,
    description: "Southern fried chicken burger with crispy chicken fillet.",
    image_url: "/Southern-Fried-Chicken-Burger-1-removebg-preview.png",
  },
  {
    id: "4",
    name: "French Fries",
    price: 2.5,
    rating: 4.6,
    description: "Air-fried crispy golden French fries.",
    image_url: "/Air-fried-french-fries-removebg-preview.png",
  },
  {
    id: "5",
    name: "Chocolate Ice-Cream",
    price: 3,
    rating: 4.8,
    description: "Rich chocolate ice-cream.",
    image_url: "/Chocolate-ice-cream-removebg-preview.png",
  },
  {
    id: "6",
    name: "Vanilla Ice-Cream",
    price: 3,
    rating: 4.7,
    description: "Classic vanilla ice-cream.",
    image_url: "/vanilla-ice-cream-removebg-preview.png",
  },
  {
    id: "7",
    name: "Banana Ice-Cream",
    price: 3,
    rating: 4.7,
    description: "Fresh banana ice-cream.",
    image_url: "/Banana-ice-cream-removebg-preview.png",
  },
  {
    id: "8",
    name: "Coke in Can",
    price: 2,
    rating: 4.8,
    description: "Refreshing cold Coca Cola.",
    image_url: "/CokeinCan-removebg-preview.png",
  },
  {
    id: "9",
    name: "Pepsi Cola",
    price: 2,
    rating: 4.7,
    description: "Chilled Pepsi Cola.",
    image_url: "/pepsi-cola-24x033cl-removebg-preview.png",
  },
  {
    id: "10",
    name: "Double Chicken Burger",
    price: 7,
    rating: 4.9,
    description: "Double chicken patty burger.",
    image_url: "/double-chicken-burger-1700648383939-removebg-preview.png",
  },
  {
    id: "11",
    name: "Sheep Burger",
    price: 8,
    rating: 4.8,
    description: "Unique sheep burger.",
    image_url: "/sheepburger-removebg-preview.png",
  },
  {
    id: "12",
    name: "Vegan Meat",
    price: 6,
    rating: 4.6,
    description: "Delicious vegan meat burger.",
    image_url: "/vegan_meat-removebg-preview.png",
  },
  {
    id: "13",
    name: "Berry Banana Ice Cream",
    price: 3.5,
    rating: 4.8,
    description: "Fluffy berry banana ice cream.",
    image_url: "/fluffy-berry-banana-ice-cream-5-removebg-preview.png",
  },
  // Add more items as needed, using the exact filenames from your public folder!
];

export default function FoodieWebsite() {
  const useCartStore = getUseCartStore();
  const { addToCart } = useCartStore();
  const [search, setSearch] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      const result = await getMenuItems();
      if (result.success && result.data) {
        // Combine static items and Supabase items
        setMenuItems([...staticMenuItems, ...result.data]);
      } else {
        setMenuItems([...staticMenuItems]);
      }
      setLoading(false);
    };
    fetchMenu();
  }, []);

  const filteredMenu = menuItems.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Best Sell items (your static items)
  const bestSellItems = staticMenuItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-orange-200 to-yellow-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Best Sell Section */}
        <section className="px-6 py-16">
                  <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-orange-900 mb-12">Best Sell</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                      <Card className="overflow-hidden shadow-lg transition-transform duration-200 hover:scale-105">
                        <div className="aspect-square relative">
                          <Image
                            src="/cheese_burger-removebg-preview.png"
                            alt="Cheese Burger"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-center mb-4">Cheese Burger</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-orange-600">$6</span>
                            <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6" onClick={() => addToCart({ id: "1", name: "Cheese Burger", price: 6, quantity: 1, image: "/cheese_burger-removebg-preview.png" })}>
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
                            src="/Strawberry-Ice-Cream-removebg-preview.png"
                            alt="Strawberry Ice-Cream"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-center mb-4">Strawberry Ice-Cream</h3>
                          <div className="flex items-center bg-light-orange justify-between">
                            <span className="text-2xl font-bold text-orange-600">$3</span>
                            <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6" onClick={() => addToCart({ id: "2", name: "Strawberry Ice-Cream", price: 3, quantity: 1, image: "/Strawberry-Ice-Cream-removebg-preview.png" })}>
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
                            src="/Southern-Fried-Chicken-Burger-1-removebg-preview.png"
                            alt="Chicken Burger"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bold text-center mb-4">Chicken Burger</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-orange-600">$5</span>
                            <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6" onClick={() => addToCart({ id: "3", name: "Chicken Burger", price: 5, quantity: 1, image: "/Southern-Fried-Chicken-Burger-1-removebg-preview.png" })}>
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
          {loading ? (
            <div className="text-center py-8">Loading menu...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMenu.map((item) => (
                <Card
                  key={item.id + item.name}
                  className="bg-white rounded-xl shadow-md p-1 transition-transform duration-200 hover:scale-105 w-full max-w-[180px] mx-auto"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 mb-2 flex items-center justify-center rounded-full bg-orange-100">
                      <Image
                        src={item.image_url && item.image_url.startsWith("http") ? item.image_url : item.image_url || "/default.jpg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium text-center mb-1 text-xs">{item.name}</h3>
                    <div className="flex items-center justify-between w-full mt-2">
                      <span className="font-bold text-xs">{`$${item.price}`}</span>
                      <div className="flex-1 flex justify-center">
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1 rounded"
                          onClick={() =>
                            addToCart({
                              id: item.id,
                              name: item.name,
                              price: item.price,
                              quantity: 1,
                              image: item.image_url,
                            })
                          }
                        >
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
          )}
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
            <div className="space-y-2 text-orange-200 underline">
              <Link href="/Aboutus">About us</Link>
            </div>
            <div className="space-y-2 text-orange-200 underline">
              <Link href="/menu">Menu</Link>
            </div>
            <div className="space-y-2 text-orange-200 underline">
              <Link href="/Cart">Cart</Link>
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-4">Main Menu</h4>
            <div className="space-y-2 text-orange-200 underline">
              <Link href="/landingpage?category=burger ">Burger</Link>
            </div>
            <div className="space-y-2 text-orange-200 underline">
              <Link href="/landingpage?category=drink">Drink</Link>
            </div>
            <div className="space-y-2 text-orange-200 underline">
              <Link href="/landingpage?category=ice-cream">Ice Cream</Link>
            </div>
            <div className="space-y-2 text-orange-200 underline">
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
  );
}
