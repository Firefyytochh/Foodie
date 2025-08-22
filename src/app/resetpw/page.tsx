"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        // The session is now set, and the user can update their password.
        // No need to manually handle tokens.
      }
    });

    // Check if there's an error in the URL, which Supabase might add
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error) {
      setMessage(
        errorDescription || "An error occurred during password recovery."
      );
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    if (!password) {
      setMessage("Password cannot be empty.");
      return;
    }

    // Update password
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(`Error updating password: ${error.message}`);
      return;
    }

    setMessage("Password reset successfully! Redirecting to login...");
    setTimeout(() => {
      router.push("/login");
    }, 3000); // redirect after 3 seconds
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 to-white">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/10" />
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
          <p className="text-xs text-gray-700 font-medium tracking-wider mb-4">MADE BY FOOD LOVER</p>
          <h2 className="text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: "serif", fontStyle: "italic" }}>
            Reset Password
          </h2>
          <p className="text-lg text-gray-700 font-medium">Enter your new password below</p>
        </div>

        <div className="w-full max-w-md space-y-4">
          <Input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full shadow-lg placeholder:text-gray-500 focus:ring-2 focus:ring-orange-400 transition-transform duration-200 hover:scale-105"
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full shadow-lg placeholder:text-gray-500 focus:ring-2 focus:ring-orange-400 transition-transform duration-200 hover:scale-105"
          />
          <Button
            onClick={handleResetPassword}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold rounded-full shadow-lg transition-transform duration-200 hover:scale-105"
          >
            Reset Password
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
