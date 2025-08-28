"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Minus, ShoppingCart, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getUseCartStore } from "../../store/cart"
import { Badge } from "@/components/ui/badge"

export default function CartPage() {
  const useCartStore = getUseCartStore();
  const { items: cartItems, addToCart, removeFromCart, decreaseQuantity, cartItemCount } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    console.log('Cart items with image data:', cartItems.map(item => ({
      id: item.id,
      name: item.name,
      image: item.image,
      image_url: item.image_url
    })));
  }, [cartItems]);

  // Enhanced image source helper function
  const getImageSrc = (item: any) => {
    console.log('Getting image for item:', item.name, {
      image: item.image,
      image_url: item.image_url
    });

    // Check for image_url first (primary)
    if (item.image_url) {
      // If it's already a full URL, use it
      if (item.image_url.startsWith('http://') || item.image_url.startsWith('https://')) {
        return item.image_url;
      }
      // If it's a relative path, make it absolute
      return item.image_url.startsWith('/') ? item.image_url : `/${item.image_url}`;
    }
    
    // Fallback to image property
    if (item.image) {
      if (item.image.startsWith('http://') || item.image.startsWith('https://')) {
        return item.image;
      }
      return item.image.startsWith('/') ? item.image : `/${item.image}`;
    }
    
    // Default fallback image
    return '/placeholder-food.jpg'; // or '/file.svg' if you prefer
  };

  const handleIncreaseQuantity = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      addToCart(item);
    }
  };

  const handleDecreaseQuantity = (id: string) => {
    decreaseQuantity(id);
  };

  const handleDeleteItem = (id: string) => {
    removeFromCart(id);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-orange-200 to-yellow-100">
      {/* Header */}
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
            <Link href="/Cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-white cursor-pointer hover:text-orange-100" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Link>
            <Link href="/Profile">
              <User className="w-6 h-6 text-white cursor-pointer hover:text-orange-100" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-24 h-24 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Add some delicious items to your cart!</p>
            <Link href="/landingpage">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Cart Items */}
            <div className="space-y-4 mb-8">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-6 flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={getImageSrc(item)}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                      onError={(e) => {
                        console.log('Image failed to load:', getImageSrc(item));
                        const target = e.target as HTMLImageElement;
                        target.src = '/file.svg'; // Fallback image
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', getImageSrc(item));
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-orange-600 font-bold">${item.price.toFixed(2)}</p>
                    {/* Show description if available, otherwise show nothing */}
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDecreaseQuantity(item.id)}
                      className="w-8 h-8 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleIncreaseQuantity(item.id)}
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="text-lg font-semibold text-gray-800 min-w-[80px] text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center text-xl font-bold text-gray-800 mb-4">
                <span>Total: ${totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex gap-4">
                <Link href="/landingpage" className="flex-1">
                  <Button variant="outline" className="w-full py-3 rounded-lg">
                    Continue Shopping
                  </Button>
                </Link>
                
                <div className="flex-1">
                  <Button
                    onClick={() => router.push('/payment')}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-transform duration-200 hover:scale-105"
                  >
                    Check Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
