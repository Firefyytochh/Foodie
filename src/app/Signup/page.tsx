"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Add missing import
import { Button } from "@/components/ui/button"; // Add missing import
import { Input } from "@/components/ui/input"; // Add missing import

// Import server-side functions
import { sendVerificationCode, verifyCode, verifyCodeAndSignup } from "../../action/email";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [message, setMessage] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSendCode = async () => {
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setMessage("Sending verification code...");
    
    try {
      console.log('Sending code to:', email);
      const result = await sendVerificationCode(email);
      console.log('Send code result:', result);
      
      if (result.error) {
        setMessage(result.error);
      } else {
        setIsCodeSent(true);
        setMessage(`Verification code sent to ${email}. Please check your inbox and spam folder.`);
      }
    } catch (error) {
      console.error('Send code error:', error);
      setMessage("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setMessage("Please enter the verification code");
      return;
    }

    setIsLoading(true);
    setMessage("");
    
    try {
      const { error } = await verifyCode(email, verificationCode);
      if (error) {
        setMessage(error);
      } else {
        setIsVerified(true);
        setMessage("Email verified successfully!");
      }
    } catch (error) {
      setMessage("Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    // Validation
    if (!email || !password || !rePassword || !verificationCode) {
      setMessage("Please fill in all fields");
      return;
    }

    if (password !== rePassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }

    if (!isVerified) {
      setMessage("Please verify your email first");
      return;
    }

    try {
      setIsLoading(true);
      setMessage("");

      // Use the combined function that verifies code and creates user
      const result = await verifyCodeAndSignup(email, verificationCode, password);
      
      if (result.error) {
        setMessage(result.error);
        return;
      }

      // Success - redirect to login page
      console.log('Signup successful! User ID:', result.userId);
      
      setMessage("Signup successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (error) {
      console.error('Signup error:', error);
      setMessage('An unexpected error occurred');
    } finally {
      setIsLoading(false);
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
            Sign Up
          </h2>
          <p className="text-lg text-gray-700 font-medium">Create your Foodie account</p>
        </div>

        <div className="w-full max-w-md space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              type="email"
              placeholder="Email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full shadow-lg placeholder:text-gray-500 focus:ring-2 focus:ring-orange-400"
              disabled={isCodeSent || isLoading}
            />
            <Button 
              onClick={handleSendCode} 
              disabled={isCodeSent || isLoading || !email} 
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow-lg whitespace-nowrap px-4"
            >
              {isLoading ? "Sending..." : "Send Code"}
            </Button>
          </div>

          {isCodeSent && !isVerified && (
            <div className="text-center">
              <button 
                onClick={() => {
                  setIsCodeSent(false);
                  setMessage("");
                  setVerificationCode("");
                }}
                className="text-orange-500 underline text-sm"
              >
                Didn't receive the code? Send again
              </button>
            </div>
          )}

          {isCodeSent && !isVerified && (
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Verification Code..."
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full shadow-lg placeholder:text-gray-500 focus:ring-2 focus:ring-orange-400"
                disabled={isLoading}
                maxLength={6}
              />
              <Button 
                onClick={handleVerifyCode} 
                disabled={isLoading || !verificationCode} 
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow-lg whitespace-nowrap px-4"
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          )}

          <Input
            type="password"
            placeholder="Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full shadow-lg placeholder:text-gray-500 focus:ring-2 focus:ring-orange-400"
            disabled={!isVerified || isLoading}
          />

          <Input
            type="password"
            placeholder="Re-enter Password..."
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full shadow-lg placeholder:text-gray-500 focus:ring-2 focus:ring-orange-400"
            disabled={!isVerified || isLoading}
          />

          <div className="flex justify-between items-center px-2 py-2">
            <div className="text-gray-700">
              {"Already have an account? "}
              <Link href="/login">
                <Button variant="link" className="text-orange-500 hover:text-orange-600 font-medium underline p-0 h-auto">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>

          {message && (
            <p className={`text-center ${message.includes('successful') ? 'text-green-500' : message.includes('verified') ? 'text-blue-500' : 'text-red-500'}`}>
              {message}
            </p>
          )}

          <Button
            onClick={handleSignup}
            disabled={!isVerified || isLoading || !password || !rePassword}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </Button>
        </div>
      </div>
    </div>
  );
}