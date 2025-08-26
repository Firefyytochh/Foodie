'use client'

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Star, ShoppingCart, User, Menu, Phone, Mail, MapPin, CreditCard, QrCode } from 'lucide-react'
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUseCartStore } from "@/store/cart"
import { createPayment } from "@/action/payment"
import { placeOrder } from "@/action/order";
import { createClient } from '@supabase/supabase-js';
import { useRouter } from "next/navigation"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export default function CheckoutPage() {
    const useCartStore = getUseCartStore();
    const { items, clearCart } = useCartStore();
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = 4;
    const subtotal = totalPrice;
    const finalTotal = totalPrice + shippingCost;
    
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'qr' | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const formRef = useRef<HTMLFormElement>(null);
    const router = useRouter();

    // Get user on component mount
    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                
                if (error || !user) {
                    alert('Please log in to make a payment');
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

        getUser();
    }, [supabase.auth, router]);

    const generateOrderId = () => {
        return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!user) {
            alert('Please log in to make a payment');
            router.push('/login');
            return;
        }
        
        if (!selectedPaymentMethod) {
            alert('Please select a payment method');
            return;
        }

        if (items.length === 0) {
            alert('Your cart is empty');
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const customerPhone = formData.get('phoneNumber') as string;
        const customerLocation = formData.get('location') as string;

        const paymentData = {
            orderId: generateOrderId(),
            paymentMethod: selectedPaymentMethod,
            items: items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            subtotal: subtotal,
            shippingCost: shippingCost,
            totalAmount: finalTotal,
            customerPhone: customerPhone,
            customerLocation: customerLocation,
            ...(selectedPaymentMethod === 'card' && {
                cardData: {
                    cardholderName: formData.get('cardholderName') as string,
                    cardLastFour: (formData.get('cardNumber') as string)?.slice(-4) || '',
                    cardType: 'Card'
                }
            })
        };

        // Pass userId as second parameter
        const result = await createPayment(paymentData, user.id);

        if (result.error) {
            alert(`Payment failed: ${result.error.message}`);
        } else {
            // --- ADD THIS: Save order to database ---
            const orderData = {
                user_id: user.id,
                items: items,
                total: finalTotal,
                status: "pending",
                customer_phone: customerPhone,
                customer_location: customerLocation,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            const orderResult = await placeOrder(orderData);
            if (!orderResult.success) {
                alert("Order upload failed: " + orderResult.error);
            }
            // --- END ADD ---

            alert('Payment successful!');
            clearCart();
            router.push('/Paymentdone');
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

            <main className="relative z-10 px-6 py-8">
                <h1 className="text-5xl font-bold text-center text-gray-800 mb-12 italic">Check out</h1>
                
                {user && (
                    <div className="text-center mb-8">
                        <p className="text-lg text-gray-700">Welcome back, {user.email}!</p>
                    </div>
                )}

                <form ref={formRef} onSubmit={handlePayment} className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Location Link</h2>
                        <Input
                            name="location"
                            type="url"
                            placeholder="Paste your location link here (e.g., Google Maps link)"
                            className="w-full max-w-md bg-white/50 transition-transform duration-200 hover:scale-105"
                            required
                        />
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Phone Number</h2>
                        <Card className="bg-white/90 backdrop-blur-sm transition-transform duration-200 hover:scale-105">
                            <CardContent className="p-6">
                                <Label htmlFor="phoneNumber" className="block text-sm font-medium mb-2">Phone Number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    className="bg-white/50"
                                    required
                                />
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Payment Method</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <Card 
                                className={`cursor-pointer transition-all duration-300 ${
                                    selectedPaymentMethod === 'card' 
                                        ? 'bg-orange-100 border-orange-500 border-2 shadow-lg scale-105' 
                                        : 'bg-white/90 border-gray-200 hover:bg-orange-50 hover:scale-102'
                                }`}
                                onClick={() => setSelectedPaymentMethod('card')}
                            >
                                <CardContent className="p-6 text-center">
                                    <div className="flex justify-center mb-4">
                                        <CreditCard className={`w-12 h-12 ${
                                            selectedPaymentMethod === 'card' ? 'text-orange-600' : 'text-gray-600'
                                        }`} />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Credit/Debit Card</h3>
                                    <p className="text-sm text-gray-600 mb-4">Pay with Visa, Mastercard, or other cards</p>
                                    <div className="flex justify-center gap-2">
                                        <div className="w-10 h-6 bg-white rounded border flex items-center justify-center overflow-hidden">
                                            <Image
                                                src="/VISA-logo.png"
                                                alt="Visa"
                                                width={40}
                                                height={24}
                                                className="object-contain"
                                            />
                                        </div>
                                        <div className="w-10 h-6 bg-white rounded border flex items-center justify-center overflow-hidden">
                                            <Image
                                                src="/mastercard-featured-image-1080x628.webp"
                                                alt="Mastercard"
                                                width={40}
                                                height={24}
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>
                                    {selectedPaymentMethod === 'card' && (
                                        <div className="mt-4">
                                            <div className="w-6 h-6 bg-orange-500 rounded-full mx-auto flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card 
                                className={`cursor-pointer transition-all duration-300 ${
                                    selectedPaymentMethod === 'qr' 
                                        ? 'bg-orange-100 border-orange-500 border-2 shadow-lg scale-105' 
                                        : 'bg-white/90 border-gray-200 hover:bg-orange-50 hover:scale-102'
                                }`}
                                onClick={() => setSelectedPaymentMethod('qr')}
                            >
                                <CardContent className="p-6 text-center">
                                    <div className="flex justify-center mb-4">
                                        <QrCode className={`w-12 h-12 ${
                                            selectedPaymentMethod === 'qr' ? 'text-orange-600' : 'text-gray-600'
                                        }`} />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">QR Code</h3>
                                    <p className="text-sm text-gray-600 mb-4">Scan QR code to pay with mobile banking</p>
                                    <div className="text-sm text-gray-500">
                                        Quick & Secure Payment
                                    </div>
                                    {selectedPaymentMethod === 'qr' && (
                                        <div className="mt-4">
                                            <div className="w-6 h-6 bg-orange-500 rounded-full mx-auto flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {selectedPaymentMethod && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Payment Details</h2>

                            {selectedPaymentMethod === 'card' && (
                                <Card className="bg-white/90 backdrop-blur-sm transition-transform duration-200 hover:scale-105">
                                    <CardContent className="p-6">
                                        <h3 className="text-lg font-semibold mb-4">Card Details</h3>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">Card type</label>
                                                <div className="flex gap-2">
                                                    <div className="w-12 h-8 bg-white rounded border flex items-center justify-center overflow-hidden">
                                                        <Image
                                                            src="/mastercard-featured-image-1080x628.webp"
                                                            alt="Mastercard"
                                                            width={48}
                                                            height={32}
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                    <div className="w-12 h-8 bg-white rounded border flex items-center justify-center overflow-hidden">
                                                        <Image
                                                            src="/VISA-logo.png"
                                                            alt="Visa"
                                                            width={48}
                                                            height={32}
                                                            className="object-contain"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <Label className="block text-sm font-medium mb-2">Name on card</Label>
                                                <Input 
                                                    name="cardholderName" 
                                                    placeholder="John Doe" 
                                                    className="bg-white/50" 
                                                    required={selectedPaymentMethod === 'card'}
                                                />
                                            </div>

                                            <div>
                                                <Label className="block text-sm font-medium mb-2">Card Number</Label>
                                                <Input 
                                                    name="cardNumber" 
                                                    placeholder="1111 2222 3333 4444" 
                                                    className="bg-white/50" 
                                                    required={selectedPaymentMethod === 'card'}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="block text-sm font-medium mb-2">Expiration date</Label>
                                                    <Input 
                                                        name="expiryDate" 
                                                        placeholder="MM/YY" 
                                                        className="bg-white/50" 
                                                        required={selectedPaymentMethod === 'card'}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="block text-sm font-medium mb-2">CVV</Label>
                                                    <Input 
                                                        name="cvv" 
                                                        placeholder="123" 
                                                        className="bg-white/50" 
                                                        required={selectedPaymentMethod === 'card'}
                                                    />
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
                                            <div className="flex justify-between font-semibold text-lg">
                                                <span>Total (Tax incl.)</span>
                                                <span>${finalTotal.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <Button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg transition-transform duration-200 hover:scale-105 disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Processing...' : `Pay $${finalTotal.toFixed(2)} with Card`}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}

                            {selectedPaymentMethod === 'qr' && (
                                <Card className="bg-white/90 backdrop-blur-sm transition-transform duration-200 hover:scale-105">
                                    <CardContent className="p-6">
                                        <div className="text-center mb-6">
                                            <h3 className="text-lg font-semibold mb-4">Scan QR Code to Pay</h3>
                                            <div className="w-64 h-64 mx-auto bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mb-4">
                                                <Image
                                                    src="/qrcode.jpg"
                                                    alt="QR Code for Payment"
                                                    width={240}
                                                    height={240}
                                                    className="rounded-lg"
                                                />
                                            </div>
                                            <p className="text-sm text-gray-600 mb-4">
                                                Open your banking app and scan this QR code to complete the payment
                                            </p>
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
                                            <div className="flex justify-between font-semibold text-lg">
                                                <span>Total (Tax incl.)</span>
                                                <span>${finalTotal.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        
                                        <Button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 text-lg transition-transform duration-200 hover:scale-105 disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Processing...' : `Confirm Payment $${finalTotal.toFixed(2)}`}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}

                    {!selectedPaymentMethod && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">💳</div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Choose Your Payment Method</h3>
                            <p className="text-gray-600">Select a payment method above to continue with your order</p>
                        </div>
                    )}
                </form>
            </main>

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
                            <Link href="/landingpage?category=burger">Burger</Link>
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
    )
}