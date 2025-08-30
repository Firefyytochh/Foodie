import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";

export function Footer() {
  return (
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
              <a href="mailto:foodieburgerr@gmail.com" className="underline">foodieburgerr@gmail.com</a>
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
  );
}
