"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  LogOutIcon,
  MenuIcon,
  Share2Icon,
  UploadIcon,
  ArrowLeftRight,
  ImageMinus,
  Fullscreen,
  Replace,
  CreditCard,
  User,
  X,
  Zap,
} from "lucide-react";
import { DatabaseUser } from "@/types";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { href: "/dashboard", icon: User, label: "Dashboard", color: "#4F46E5" },
  { href: "/credits", icon: CreditCard, label: "Credits", color: "#0EA5E9" },
  { href: "/social-share", icon: Share2Icon, label: "Image Resize", color: "#F59E0B" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload", color: "#A855F7" },
  { href: "/generate-image", icon: Replace, label: "Generate Image", color: "#EF4444" },
  { href: "/image-transform", icon: ArrowLeftRight, label: "Background Transform", color: "#14B8A6" },
  { href: "/remove-background", icon: ImageMinus, label: "Remove Background", color: "#6366F1" },
  { href: "/image-extender", icon: Fullscreen, label: "Expand Images", color: "#EC4899" },
  { href: "/generative-replace", icon: Replace, label: "Generative Replace", color: "#8B5CF6" },
];

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newUser, setFullUser] = useState<DatabaseUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();

  // Create user in database when they sign in
  useEffect(() => {
    console.log('useEffect triggered, user:', user, 'isLoaded:', isLoaded);
    console.log('Current newUser state:', newUser);
    
    const createUserInDB = async () => {
      // Only proceed if user is loaded, exists, and we haven't already created/fetched the user
      if (isLoaded && user && !newUser) {
        console.log('Creating user in DB:', user.id);
        try {
          const response = await fetch('/api/user/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log('User created/retrieved:', data.user);
            setFullUser(data.user);
          } else {
            const errorText = await response.text();
            console.error('Failed to create user:', response.status, errorText);
          }
        } catch (error) {
          console.error('Error creating user:', error);
        }
      } else {
        console.log('Skipping user creation - isLoaded:', isLoaded, 'user exists:', !!user, 'newUser exists:', !!newUser);
      }
    };

    createUserInDB();
  }, [user, isLoaded, newUser]);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-dark text-white flex">
      {/* Fixed Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:z-50">
      <div className="flex flex-col flex-grow bg-[#18181b] border-r border-white/10 overflow-y-auto max-h-screen">

          {/* Sidebar Header */}
          <div className="flex items-center justify-center py-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#36c6f0] to-[#8f6ed5]">AI Media Toolkit</span>
            </div>
          </div>
          
          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-1 rounded-xl transition-all duration-200 group ${
                  pathname === item.href
                    ? "bg-gradient-to-r from-[#36c6f0]/20 to-[#8f6ed5]/20 border border-[#36c6f0]/30 text-white shadow-lg"
                    : "hover:bg-white/5 text-gray-300 hover:text-white"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  pathname === item.href ? "bg-gradient-primary" : "bg-white/10 group-hover:bg-white/20"
                }`}>
                  <item.icon 
                    className="w-5 h-5" 
                    color={pathname === item.href ? "white" : item.color}
                  />
                </div>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* User Section */}
          {user && (
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-xl">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#36c6f0]/50">
                  <img
                    src={user.imageUrl}
                    alt={user.username || user.emailAddresses[0].emailAddress}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.username || user.firstName || "User"}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {user.emailAddresses[0].emailAddress}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleSignOut}
                className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 hover:border-red-600/50 transition-all duration-200"
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-72 bg-[#18181b] border-r border-white/10 max-h-screen overflow-y-auto">

            {/* Mobile Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#36c6f0] to-[#8f6ed5]">MediaMorph</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            {/* Mobile Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    pathname === item.href
                      ? "bg-gradient-to-r from-[#36c6f0]/20 to-[#8f6ed5]/20 border border-[#36c6f0]/30 text-white shadow-lg"
                      : "hover:bg-white/5 text-gray-300 hover:text-white"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    pathname === item.href ? "bg-gradient-primary" : "bg-white/10 group-hover:bg-white/20"
                  }`}>
                    <item.icon 
                      className="w-5 h-5" 
                      color={pathname === item.href ? "white" : item.color}
                    />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
            
            {/* Mobile User Section */}
            {user && (
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-xl">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#36c6f0]/50">
                    <img
                      src={user.imageUrl}
                      alt={user.username || user.emailAddresses[0].emailAddress}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {user.username || user.firstName || "User"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {user.emailAddresses[0].emailAddress}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleSignOut}
                  className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 hover:border-red-600/50 transition-all duration-200"
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-72">
        <div className="flex flex-col min-h-screen">
          {/* Header */}
          <header className="w-full bg-black/80 border-b border-white/10 shadow-lg">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
              <div className="flex items-center gap-4">
                <button 
                  className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
                  onClick={() => setSidebarOpen(true)}
                >
                  <MenuIcon className="w-6 h-6 text-white" />
                </button>
                <div 
                  className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#36c6f0] to-[#8f6ed5] drop-shadow-glow cursor-pointer select-none"
                  onClick={()=> router.push('/dashboard')}
                >
                  MediaMorph
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {user && (
                  <>
                    <div className="hidden md:flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#36c6f0]/50">
                        <img
                          src={user.imageUrl}
                          alt={user.username || user.emailAddresses[0].emailAddress}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium text-white truncate max-w-xs">
                        {user.username || user.firstName || "User"}
                      </span>
                    </div>
                    <Button
                      onClick={handleSignOut}
                      className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 hover:border-red-600/50 transition-all duration-200"
                      size="sm"
                    >
                      <LogOutIcon className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </header>
          
          {/* Page Content */}
          <main className="flex-1 bg-gradient-dark">
            <div className="max-w-7xl mx-auto w-full px-6 py-8">
              {children}
            </div>
          </main>
          
          {/* Footer */}
          {/* <footer className="bg-[#18181b] border-t border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#36c6f0] to-[#8f6ed5]">MediaMorph</span>
                  <span> 2024 All rights reserved.</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>Made with</span>
                  <Heart className="w-4 h-4 text-red-600" />
                  <span>for creators</span>
                </div>
              </div>
            </div>
          </footer> */}
        </div>
      </div>
    </div>
  );
}