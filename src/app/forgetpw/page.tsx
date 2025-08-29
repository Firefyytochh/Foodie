"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sendPasswordResetOTP, verifyPasswordResetOTP, updatePasswordAfterVerification } from "@/action/auth";

export default function ForgetPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Step 1: Send OTP code to email
  const handleSendCode = async () => {
    if (!email) {
      setMessage("Please enter your email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setMessage("Sending verification code...");

    try {
      const result = await sendPasswordResetOTP(email);
      
      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage("6-digit verification code sent to your email!");
        setStep(2);
      }
    } catch (error) {
      setMessage("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify the OTP code
  const handleVerifyCode = async () => {
    if (!otp || otp.length !== 6) {
      setMessage("Please enter the 6-digit verification code");
      return;
    }

    setIsLoading(true);
    setMessage("Verifying code...");

    try {
      const result = await verifyPasswordResetOTP(email, otp);
      
      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage("Code verified! Please enter your new password.");
        setStep(3);
      }
    } catch (error) {
      setMessage("Failed to verify code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Update password
  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage("Please fill in both password fields");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setMessage("Updating password...");

    try {
      const result = await updatePasswordAfterVerification(newPassword);
      
      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage("Password updated successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error) {
      setMessage("Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    setMessage("Resending verification code...");

    try {
      const result = await sendPasswordResetOTP(email);
      
      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage("New 6-digit code sent to your email!");
      }
    } catch (error) {
      setMessage("Failed to resend verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
          <p className="text-xs text-gray-700 font-medium tracking-wider">MADE BY FOOD LOVER</p>
          <h2 className="text-4xl font-bold text-gray-800 mt-4 mb-2" style={{ fontFamily: "serif", fontStyle: "italic" }}>
            Reset Password
          </h2>
          <p className="text-lg text-gray-700 font-medium">
            {step === 1 && "Enter your email to receive a 6-digit code"}
            {step === 2 && "Enter the 6-digit code from your email"}
            {step === 3 && "Enter your new password"}
          </p>
        </div>

        <div className="w-full max-w-md space-y-4">
          {/* Step 1: Email Input */}
          {step === 1 && (
            <>
              <Input
                type="email"
                placeholder="Enter your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full shadow-lg placeholder:text-gray-500 focus:ring-2 focus:ring-orange-400 transition-transform duration-200 hover:scale-105 disabled:opacity-50"
              />
              <Button
                onClick={handleSendCode}
                disabled={isLoading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-4 text-lg font-semibold rounded-full shadow-lg transition-transform duration-200 hover:scale-105"
              >
                {isLoading ? "Sending..." : "Send 6-Digit Code"}
              </Button>
            </>
          )}

          {/* Step 2: OTP Input */}
          {step === 2 && (
            <>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  We sent a 6-digit code to <strong>{email}</strong>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Check your inbox for the verification code
                </p>
              </div>
              <Input
                type="text"
                placeholder="Enter 6-digit code..."
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                disabled={isLoading}
                maxLength={6}
                className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full shadow-lg placeholder:text-gray-500 focus:ring-2 focus:ring-orange-400 transition-transform duration-200 hover:scale-105 disabled:opacity-50 text-center tracking-widest font-mono"
              />
              <Button
                onClick={handleVerifyCode}
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-4 text-lg font-semibold rounded-full shadow-lg transition-transform duration-200 hover:scale-105"
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
              <Button
                onClick={handleResendCode}
                disabled={isLoading}
                variant="outline"
                className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 py-3 font-semibold rounded-full shadow-lg"
              >
                Resend Code
              </Button>
              <Button
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setMessage("");
                }}
                disabled={isLoading}
                variant="ghost"
                className="w-full text-gray-600 py-3 font-semibold rounded-full"
              >
                Change Email
              </Button>
            </>
          )}

          {/* Step 3: New Password Input */}
          {step === 3 && (
            <>
              <Input
                type="password"
                placeholder="Enter new password..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full shadow-lg placeholder:text-gray-500 focus:ring-2 focus:ring-orange-400 transition-transform duration-200 hover:scale-105 disabled:opacity-50"
              />
              <Input
                type="password"
                placeholder="Re-enter new password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-sm border-0 rounded-full shadow-lg placeholder:text-gray-500 focus:ring-2 focus:ring-orange-400 transition-transform duration-200 hover:scale-105 disabled:opacity-50"
              />
              <Button
                onClick={handleUpdatePassword}
                disabled={isLoading || !newPassword || !confirmPassword}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-4 text-lg font-semibold rounded-full shadow-lg transition-transform duration-200 hover:scale-105"
              >
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
              <Button
                onClick={() => {
                  setStep(2);
                  setNewPassword("");
                  setConfirmPassword("");
                  setMessage("");
                }}
                disabled={isLoading}
                variant="ghost"
                className="w-full text-gray-600 py-3 font-semibold rounded-full"
              >
                Back to Verification
              </Button>
            </>
          )}

          {/* Message Display */}
          {message && (
            <div className="text-center">
              <p className={`text-sm font-medium ${
                message.includes("Error") || message.includes("Failed") || message.includes("expired") || message.includes("Invalid") || message.includes("do not match") || message.includes("at least")
                  ? "text-red-500" 
                  : message.includes("successfully") || message.includes("sent") || message.includes("verified")
                  ? "text-green-500" 
                  : "text-blue-500"
              }`}>
                {message}
              </p>
            </div>
          )}

          {/* Back to Login */}
          <Link href="/login">
            <Button className="w-full bg-gray-200 text-gray-800 py-3 font-semibold rounded-full shadow-lg hover:bg-gray-300 transition-transform duration-200 hover:scale-105">
              Back to Login
            </Button>
          </Link>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                step >= stepNumber ? "bg-orange-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
