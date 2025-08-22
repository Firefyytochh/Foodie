"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { forgotPassword } from "@/action/auth";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSendResetEmail = async () => {
    const result = await forgotPassword(email);
    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage("Password reset email sent! Check your inbox.");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 to-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/10" />
      </div>

      <div className="absolute top-6 right-6 z-10">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-2xl font-medium shadow-lg">
          Admin
        </Button>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center mb-8">
          <div className="w-28 h-28 mx-auto mb-4 relative">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-lg">
              <Image src="/logo.png" alt="Foodie Logo" width={120} height={120} className="rounded-full" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-red-600 mb-1" style={{ fontFamily: "serif" }}>
            Foodie
          </h1>
          <p className="text-xs text-gray-700 font-medium tracking-wider">MADE BY FOOD LOVER</p>
          <h2 className="text-4xl font-bold text-gray-800 mt-4 mb-2" style={{ fontFamily: "serif", fontStyle: "italic" }}>
            Forgot Password
          </h2>
          <p className="text-lg text-gray-700 font-medium">Enter your email to reset your password</p>
        </div>

        <div className="w-full max-w-md space-y-4">
          <Input
            type="email"
            placeholder="Email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full shadow-lg placeholder:text-gray-500 focus:ring-2 focus:ring-orange-400 transition-transform duration-200 hover:scale-105"
          />
          <Button
            onClick={handleSendResetEmail}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold rounded-full shadow-lg transition-transform duration-200 hover:scale-105"
          >
            Send Reset Email
          </Button>

          {message && <p className="text-red-500 text-center">{message}</p>}

          <Link href="/login">
            <Button className="w-full bg-gray-200 text-gray-800 py-3 font-semibold rounded-full shadow-lg hover:bg-gray-300">
              Back to Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
