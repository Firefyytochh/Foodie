"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../component/navbar";
import { Mail, Phone } from "lucide-react";
import { getAboutContent } from "@/action/admin";
import { Footer } from "../component/footer";
// Define the type for aboutContent
type AboutContent = {
  title: string;
  subtitle?: string;
  content: string;
};

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState<AboutContent | undefined>(undefined);

  useEffect(() => {
    const fetchContent = async () => {
      const result = await getAboutContent();
      if (result.success && result.data) {
        setAboutContent(result.data);
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-orange-200 to-yellow-100">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-6xl font-bold text-center text-gray-800 mb-8" style={{ fontFamily: "serif" }}>
          {aboutContent?.title || "About Us"}
        </h1>

        <p className="text-xl italic text-center text-gray-700 mb-12">
          {aboutContent?.subtitle || "Bite Into Happiness – Fresh, Juicy, Unforgettable."}
        </p>

        <div className="space-y-6 text-gray-800 leading-relaxed">
          {(aboutContent?.content
            ? aboutContent.content.split(/\n\s*\n/)
            : [
                "Welcome to Foodie, where every burger is more than just a meal—it’s a moment of pure happiness.",
              ]
          ).map((para, idx) => (
            <p key={idx} className="text-lg whitespace-pre-line">
              {para.trim()}
            </p>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
