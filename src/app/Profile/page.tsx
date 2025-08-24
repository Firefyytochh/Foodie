"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Edit3, ShoppingCart, User, Mail, Phone } from "lucide-react";
import { getCurrentUser, updateUserProfile } from "../../action/auth";
import { useRouter } from 'next/navigation';

export default function UserProfile() {
  const [userData, setUserData] = useState({
    name: "Your name",
    email: "",
    mobile: "Your phone Number"
  });
  const [editField, setEditField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { user, error } = await getCurrentUser();
        
        if (error || !user) {
          router.push('/login');
          return;
        }

        if (user) {
          setCurrentUser(user);
          
          try {
            const { getProfile } = await import('../../action/profile');
            const { data: profile, error: profileError } = await getProfile(user.id);
            
            if (profile && profile.avatar_url) {
              setAvatar(profile.avatar_url);
            }
            
            setUserData(prev => ({
              ...prev,
              email: user.email || prev.email,
              name: profile?.username || prev.name,
              mobile: profile?.phone_number || prev.mobile
            }));
            
            if (!profile) {
              const { updateProfile } = await import('../../action/profile');
              await updateProfile(user.id, {
                username: user.user_metadata?.full_name || "Your name",
                phone_number: user.user_metadata?.mobile || "Your phone Number"
              });
            }
          } catch (error) {
            console.error('Profile fetch failed:', error);
          }
        }
      } catch (error) {
        console.error('Auth error:', error);
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    if (avatar) {
      console.log('Avatar URL:', avatar);
    }
  }, [avatar]);

  const handleChange = (field: string, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      if (currentUser) {
        const authResult = await updateUserProfile({
          data: {
            full_name: userData.name,
            mobile: userData.mobile
          }
        });

        const { updateProfile } = await import('../../action/profile');
        const profileResult = await updateProfile(currentUser.id, {
          username: userData.name,
          phone_number: userData.mobile
        });

        if (authResult.error || profileResult.error) {
          alert("Failed to save changes.");
        } else {
          alert("Profile updated successfully!");
          setEditField(null);
        }
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save changes.");
    }
    
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const { uploadProfileImage } = await import('../../action/profile');
      const result = await uploadProfileImage(formData, currentUser.id);
      
      if (result.error) {
        alert('Upload failed: ' + result.error);
      } else if (result.url) {
        // Update avatar state immediately
        setAvatar(result.url);
        
        // Also refresh the current user data to get the updated profile
        try {
          const { getCurrentUser } = await import('../../action/auth');
          const { user } = await getCurrentUser();
          if (user) {
            const { getProfile } = await import('../../action/profile');
            const { data: profile } = await getProfile(user.id);
            if (profile?.avatar_url) {
              setAvatar(profile.avatar_url);
            }
          }
        } catch (error) {
          console.error('Error refreshing user data:', error);
        }
        
        alert('Profile image updated successfully!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { logoutUser } = await import('../../action/auth');
      await logoutUser();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-orange-200 to-yellow-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-400 to-orange-300 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <Image src="/logo.png" alt="Foodie Logo" width={500} height={500} className="rounded-full" />
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/landingpage" className="text-white hover:text-orange-100 transition-colors">Home</Link>
            <Link href="/Aboutus" className="text-white hover:text-orange-100 transition-colors">About Us</Link>
            <Link href="/menu" className="text-white hover:text-orange-100 transition-colors">Menu</Link>
            <Link href="#footer" className="text-white hover:text-orange-100 transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/Cart"><ShoppingCart className="w-6 h-6 text-white cursor-pointer hover:text-orange-100" /></Link>
            <Link href="/Profile"><User className="w-6 h-6 text-white cursor-pointer hover:text-orange-100" /></Link>
          </div>
        </div>
      </header>

      {/* Main Profile Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-black mb-12 font-serif italic">
          User Profile
        </h1>

        <div className="space-y-6 mb-12">
          {/* Profile Image Section */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {avatar && !avatar.includes('-175') ? (
                    <Image
                      src={avatar}
                      alt="Profile"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log('Image load error, using default');
                        setAvatar(null); // Reset to default
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-orange-500 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors">
                  <Edit3 className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-black">{userData.name}</h2>
                <p className="text-gray-600">{userData.email}</p>
              </div>
              {uploading && (
                <p className="text-orange-500">Uploading image...</p>
              )}
            </div>
          </div>

          {/* Name Field */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg transition-transform duration-200 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Name</p>
                {editField === "name" ? (
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="text-xl font-semibold text-black border-b border-gray-400 focus:outline-none"
                  />
                ) : (
                  <p className="text-xl font-semibold text-black">{userData.name}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-black"
                  onClick={() => setEditField(editField === "name" ? null : "name")}
                >
                  <Edit3 className="h-5 w-5" />
                </Button>
                {editField === "name" && (
                  <Button
                    size="sm"
                    className="bg-orange-400 text-white"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    Save
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Email Field */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg transition-transform duration-200 hover:scale-105">
            <div>
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="text-xl font-semibold text-black">{userData.email || "Loading..."}</p>
            </div>
          </Card>

          {/* Mobile Field */}
          <Card className="p-6 bg-white/90 backdrop-blur-sm shadow-lg transition-transform duration-200 hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mobile Number</p>
                {editField === "mobile" ? (
                  <input
                    type="text"
                    value={userData.mobile}
                    onChange={(e) => handleChange("mobile", e.target.value)}
                    className="text-xl font-semibold text-black border-b border-gray-400 focus:outline-none"
                  />
                ) : (
                  <p className="text-xl font-semibold text-black">{userData.mobile}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-black"
                  onClick={() => setEditField(editField === "mobile" ? null : "mobile")}
                >
                  <Edit3 className="h-5 w-5" />
                </Button>
                {editField === "mobile" && (
                  <Button
                    size="sm"
                    className="bg-orange-400 text-white"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    Save
                  </Button>
                )}
              </div>
            </div>
          </Card>
          
          <Button
            onClick={handleLogout}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold rounded-full shadow-lg transition-all duration-200 hover:shadow-xl"
          >
            Log out
          </Button>
        </div>
      </main>

      {/* Footer */}
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
            <div className="space-y-2">
              <Link href="/Aboutus" className="block text-orange-200 underline">About us</Link>
              <Link href="/menu" className="block text-orange-200 underline">Menu</Link>
              <Link href="/Cart" className="block text-orange-200 underline">Cart</Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Main Menu</h4>
            <div className="space-y-2">
              <Link href="/landingpage?category=burger" className="block text-orange-200 underline">Burger</Link>
              <Link href="/landingpage?category=drink" className="block text-orange-200 underline">Drink</Link>
              <Link href="/landingpage?category=ice-cream" className="block text-orange-200 underline">Ice Cream</Link>
              <Link href="/landingpage?category=dessert" className="block text-orange-200 underline">Dessert</Link>
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
  );
}
