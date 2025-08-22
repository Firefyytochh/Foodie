"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("Loading...");
  const [isLoading, setIsLoading] = useState(false);
  const [canReset, setCanReset] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      // Wait a bit for the middleware to process the auth
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (session) {
        setCanReset(true);
        setMessage("Ready to reset your password");
      } else {
        setCanReset(false);
        setMessage("Please click the password reset link in your email again");
      }
    };

    checkAuth();
  }, [supabase.auth]);

  const handleResetPassword = async () => {
    if (!canReset) {
      setMessage("Please click the reset link in your email first");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage("Password updated successfully! Redirecting...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 to-white">
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center mb-8">
          <div className="w-28 h-28 mx-auto mb-4 relative">
            <div className="w-full h-full bg-white rounded-full flex items-center justify-center shadow-lg">
              <Image
                src="/logo.png"
                alt="Foodie Logo"
                width={120}
                height={120}
                className="rounded-full"
              />
            </div>
          </div>
          <h1
            className="text-4xl font-bold text-red-600 mb-1"
            style={{ fontFamily: "serif" }}
          >
            Foodie
          </h1>
          <h2
            className="text-4xl font-bold text-gray-800 mb-2"
            style={{ fontFamily: "serif", fontStyle: "italic" }}
          >
            Reset Password
          </h2>
        </div>

        <div className="w-full max-w-md space-y-4">
          <Input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={!canReset}
            className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full shadow-lg placeholder:text-gray-500 focus:ring-2 focus:ring-orange-400"
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={!canReset}
            className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full shadow-lg placeholder:text-gray-500 focus:ring-2 focus:ring-orange-400"
          />
          <Button
            onClick={handleResetPassword}
            disabled={isLoading || !canReset}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold rounded-full shadow-lg disabled:opacity-50"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>

          <p
            className={`text-center ${
              message.includes("successfully") || message.includes("Ready")
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {message}
          </p>

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
