"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { loginUser } from "@/action/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    const result = await loginUser(email, password);

    setLoading(false);

    if (result.error) {
      setMessage(result.error);
    } else {
      setMessage("Login successful!");
      router.push("/landingpage");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/20" />
      </div>

      

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center mb-8">
          <div className="mb-6">
            <div className="inline-block relative">
              <div className="w-24 h-24 mx-auto mb-2 relative">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center relative">
                  <Image
                    src="/logo.png"
                    alt="Foodie Logo"
                    width={500}
                    height={500}
                    className="rounded-full"
                  />
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-4xl font-bold text-red-600 mb-1" style={{ fontFamily: "serif" }}>
                  Foodie
                </h1>
                <p className="text-xs text-gray-700 font-medium tracking-wider">
                  MADE BY FOOD LOVER
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-5xl font-bold text-gray-800 mb-2" style={{ fontFamily: "serif", fontStyle: "italic" }}>
            Welcome to Foodie
          </h2>
          <p className="text-lg text-gray-700 font-medium">Made By Food Lover For Food Lover</p>
        </div>

        <div className="w-full max-w-md space-y-4">
          <Input
            type="email"
            placeholder="Email or username..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full shadow-lg placeholder:text-gray-500 focus:ring-2 focus:ring-orange-400"
          />

          <Input
            type="password"
            placeholder="Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full shadow-lg placeholder:text-gray-500 focus:ring-2 focus:ring-orange-400"
          />

          <div className="flex justify-between items-center px-2 py-2">
            <div className="text-gray-700">
              {"Don't have an account? "}
              <Link href="/Signup">
                <button className="text-orange-500 hover:text-orange-600 font-medium underline">Sign Up</button>
              </Link>
            </div>

            <Link href="/forgetpw">
              <button className="text-orange-500 hover:text-orange-600 font-medium underline">Forgot password</button>
            </Link>
          </div>

          {message && <p className="text-red-500 text-center">{message}</p>}

          <div className="pt-4">
            <Button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
