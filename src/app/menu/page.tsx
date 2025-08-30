"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, Mail, Phone, X } from "lucide-react";
import Navbar from "../component/navbar";
import { getMenuItems } from "@/action/admin";
import { getUseCartStore } from "@/store/cart";
import { Footer } from "../component/footer";

// Type for menu items
type MenuItem = {
  id: string;
  name: string;
  price: number;
  rating: number;
  description?: string;
  image_url?: string;
  category?: string;
};

export default function FoodieWebsite() {
  const useCartStore = getUseCartStore();
  const { addToCart, cart } = useCartStore();
  const [search, setSearch] = useState("");
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null); // New state for modal

  // Ensure cart is always an array
  const safeCart = Array.isArray(cart) ? cart : [];

  useEffect(() => {
    const fetchMenu = async () => {
      const result = await getMenuItems();
      if (result.success && result.data) {
        setMenuItems(result.data);
      } else {
        setMenuItems([]);
      }
      setLoading(false);
    };
    fetchMenu();
  }, []);

  const filteredMenu = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Add to cart with feedback
  const handleAddToCartWithFeedback = (item: MenuItem) => {
    if (!safeCart.some(cartItem => cartItem.id === item.id)) {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image_url,
      });
      setJustAdded(item.id);
      setTimeout(() => setJustAdded(null), 2000);
    }
  };

  // Helper to get correct image path
  function getImageSrc(image_url?: string) {
    if (!image_url || image_url.trim() === "") {
      return "/default.jpg";
    }
    if (image_url.startsWith("http")) {
      return image_url;
    }
    return `/uploads/${image_url}`;
  }

  // Close modal when clicking outside
  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedItem(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-orange-200 to-yellow-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Best Sell Section */}
        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-orange-900 mb-12">Best Sell</h2>
            {loading ? (
              <div className="text-center py-8">Loading menu...</div>
            ) : menuItems.length === 0 ? (
              <div className="flex items-center justify-center h-64 w-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl">
                <span className="text-2xl text-orange-600 font-bold">More menu will be available soon</span>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {menuItems
                  .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
                  .slice(0, 3)
                  .map(item => (
                    <Card key={item.id} className="group bg-white/90 backdrop-blur-sm overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-0 rounded-2xl cursor-pointer">
                      <div className="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-orange-50 to-orange-100" onClick={() => setSelectedItem(item)}>
                        <Image
                          src={getImageSrc(item.image_url)}
                          alt={item.name}
                          width={300}
                          height={300}
                          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-semibold text-gray-700">{item.rating}</span>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6 space-y-4">
                        <h3 className="text-xl font-bold text-center text-gray-800 group-hover:text-orange-600 transition-colors duration-200" onClick={() => setSelectedItem(item)}>{item.name}</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold text-orange-600">${item.price}</span>
                          <Button
                            className={`rounded-full px-6 py-2 font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 ${
                              safeCart.some(cartItem => cartItem.id === item.id) || justAdded === item.id
                                ? 'bg-green-500 text-white border-0 hover:bg-green-600'
                                : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 hover:from-orange-600 hover:to-orange-700'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCartWithFeedback(item);
                            }}
                          >
                            {safeCart.some(cartItem => cartItem.id === item.id) || justAdded === item.id ? "Added ✓" : "Add to Cart"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            )}
          </div>
        </section>

        {/* Search and Category Section */}
        <section className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {/* Category Sidebar */}
              <aside className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6">
                <h4 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                  <Search className="w-5 h-5 text-orange-500" /> Categories
                </h4>
                <div className="space-y-3">
                  <div
                    className={`px-4 py-3 rounded-xl font-medium flex items-center gap-3 cursor-pointer transition-all duration-200 ${
                      activeCategory === "all" 
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg" 
                        : "text-orange-800 hover:bg-orange-50 hover:shadow-md"
                    }`}
                    onClick={() => setActiveCategory("all")}
                  >
                    <span>All Items</span>
                  </div>
                  <div
                    className={`px-4 py-3 rounded-xl font-medium flex items-center gap-3 cursor-pointer transition-all duration-200 ${
                      activeCategory === "burger" 
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg" 
                        : "text-orange-800 hover:bg-orange-50 hover:shadow-md"
                    }`}
                    onClick={() => setActiveCategory("burger")}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20">
                      <Image src="/cheese_burger-removebg-preview.png" alt="Burger" width={32} height={32} className="w-full h-full object-cover" />
                    </div>
                    <span>Burger</span>
                  </div>
                  <div
                    className={`px-4 py-3 rounded-xl font-medium flex items-center gap-3 cursor-pointer transition-all duration-200 ${
                      activeCategory === "drink" 
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg" 
                        : "text-orange-800 hover:bg-orange-50 hover:shadow-md"
                    }`}
                    onClick={() => setActiveCategory("drink")}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20">
                      <Image src="/CokeinCan-removebg-preview.png" alt="Drink" width={32} height={32} className="w-full h-full object-cover" />
                    </div>
                    <span>Drink</span>
                  </div>
                  <div
                    className={`px-4 py-3 rounded-xl font-medium flex items-center gap-3 cursor-pointer transition-all duration-200 ${
                      activeCategory === "ice-cream" 
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg" 
                        : "text-orange-800 hover:bg-orange-50 hover:shadow-md"
                    }`}
                    onClick={() => setActiveCategory("ice-cream")}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20">
                      <Image src="/Strawberry-Ice-Cream-removebg-preview.png" alt="Ice Cream" width={32} height={32} className="w-full h-full object-cover" />
                    </div>
                    <span>Ice Cream</span>
                  </div>
                  <div
                    className={`px-4 py-3 rounded-xl font-medium flex items-center gap-3 cursor-pointer transition-all duration-200 ${
                      activeCategory === "dessert" 
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg" 
                        : "text-orange-800 hover:bg-orange-50 hover:shadow-md"
                    }`}
                    onClick={() => setActiveCategory("dessert")}
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20">
                      <Image src="/plae-ayy.jpg" alt="Dessert" width={32} height={32} className="w-full h-full object-cover" />
                    </div>
                    <span>Dessert</span>
                  </div>
                  <Link href="/Reservation">
                    <div className="text-orange-800 px-4 py-3 hover:bg-orange-50 hover:shadow-md rounded-xl cursor-pointer transition-all duration-200 font-medium">
                      Reservation
                    </div>
                  </Link>
                </div>
              </aside>

              {/* Menu Items Grid */}
              <div className="md:col-span-3">
                {/* Search Bar */}
                <div className="mb-8">
                  <div className="relative max-w-md">
                    <Input
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search for your favorite food..."
                      className="pl-4 pr-12 py-3 rounded-full border-2 border-orange-200 focus:border-orange-400 bg-white/90 backdrop-blur-sm"
                    />
                    <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Menu Grid */}
                {loading ? (
                  <div className="text-center py-8">Loading menu...</div>
                ) : filteredMenu.length === 0 ? (
                  <div className="flex items-center justify-center h-64 w-full bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl">
                    <span className="text-2xl text-orange-600 font-bold">
                      {search ? "No items found matching your search" : "More menu will be available soon"}
                    </span>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-6">
                    {filteredMenu.map((item) => {
                      const isInCart = safeCart.some(cartItem => cartItem.id === item.id) || justAdded === item.id;
                      return (
                        <Card key={item.id + item.name} className="group bg-white/90 backdrop-blur-sm overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 rounded-xl cursor-pointer">
                          <div className="relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100" onClick={() => setSelectedItem(item)}>
                            <Image
                              src={getImageSrc(item.image_url)}
                              alt={item.name}
                              width={250}
                              height={200}
                              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-md">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-semibold text-gray-700">{item.rating}</span>
                              </div>
                            </div>
                          </div>
                          <CardContent className="p-4 space-y-3">
                            <h4 className="font-bold text-center text-gray-800 group-hover:text-orange-600 transition-colors duration-200" onClick={() => setSelectedItem(item)}>{item.name}</h4>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold text-orange-600">${item.price}</span>
                              <Badge
                                className={`cursor-pointer font-semibold transition-all duration-200 transform hover:scale-105 ${
                                  isInCart 
                                    ? "bg-green-500 text-white hover:bg-green-600" 
                                    : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCartWithFeedback(item);
                                }}
                              >
                                {isInCart ? "Added ✓" : "Add to cart"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Description Modal */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleModalClick}
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="relative">
              <Image
                src={getImageSrc(selectedItem.image_url)}
                alt={selectedItem.name}
                width={600}
                height={300}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-lg"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-700">{selectedItem.rating}</span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedItem.name}</h2>
                <span className="text-4xl font-bold text-orange-600">${selectedItem.price}</span>
              </div>

              {/* Category Badge */}
              {selectedItem.category && (
                <div className="flex justify-center">
                  <Badge className="bg-orange-100 text-orange-800 px-3 py-1 text-sm">
                    {selectedItem.category.charAt(0).toUpperCase() + selectedItem.category.slice(1)}
                  </Badge>
                </div>
              )}

              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedItem.description || "This delicious item is carefully prepared with the finest ingredients to give you an amazing taste experience."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setSelectedItem(null)}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleAddToCartWithFeedback(selectedItem);
                    setSelectedItem(null);
                  }}
                  className={`flex-1 font-semibold ${
                    safeCart.some(cartItem => cartItem.id === selectedItem.id) || justAdded === selectedItem.id
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700'
                  }`}
                >
                  {safeCart.some(cartItem => cartItem.id === selectedItem.id) || justAdded === selectedItem.id ? "Added to Cart ✓" : "Add to Cart"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
