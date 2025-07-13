"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  LogOutIcon,
  MenuIcon,
  LayoutDashboardIcon,
  Share2Icon,
  UploadIcon,
  ImageIcon,
  ArrowLeftRight,
  ImageMinus,
  Fullscreen,
  Replace,
  CreditCard,
  User
} from "lucide-react";
import { DatabaseUser } from "@/types";

const sidebarItems = [
  { href: "/dashboard", icon: User, label: "Dashboard" },
  { href: "/credits", icon: CreditCard, label: "Credits" },
  { href: "/home", icon: LayoutDashboardIcon, label: "Home Page" },
  { href: "/social-share", icon: Share2Icon, label: "Image Resize" },
  { href: "/video-upload", icon: UploadIcon, label: "Video Upload" },
  { href: "/generate-image", icon: Replace, label: "Generate Image" },
  { href: "/image-transform", icon: ArrowLeftRight, label: "Background Transform" },
  { href: "/remove-background", icon: ImageMinus, label: "Remove Background" },
  { href: "/image-extender", icon: Fullscreen, label: "Expand Images" },
  { href: "/generative-replace", icon: Replace, label: "Generative Replace" },
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
    console.log(newUser);
    
    const createUserInDB = async () => {
      if (isLoaded && user) {
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
            console.error('Failed to create user:', response.status);
          }
        } catch (error) {
          console.error('Error creating user:', error);
        }
      } else {
        console.log('No user available yet or not loaded');
      }
    };

    createUserInDB();
  }, [user, isLoaded]);

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex h-screen">
      {/* Fixed Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:z-50">
        <div className="flex flex-col flex-grow bg-base-200 border-r border-base-300">
          <div className="flex items-center justify-center py-4">
            <ImageIcon className="w-10 h-10 text-primary" />
          </div>
          <ul className="menu p-4 w-full text-base-content flex-grow">
            {sidebarItems.map((item) => (
              <li key={item.href} className="mb-2">
                <Link
                  href={item.href}
                  className={`flex items-center space-x-4 px-4 py-2 rounded-lg ${
                    pathname === item.href
                      ? "bg-primary text-white"
                      : "hover:bg-base-300"
                  }`}
                >
                  <item.icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          {user && (
            <div className="p-4">
              <button
                onClick={handleSignOut}
                className="btn btn-outline btn-error w-full"
              >
                <LogOutIcon className="mr-2 h-5 w-5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className="lg:hidden">
        <input
          id="sidebar-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={sidebarOpen}
          onChange={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="drawer-side">
          <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
          <aside className="bg-base-200 w-64 h-full flex flex-col">
            <div className="flex items-center justify-center py-4">
              <ImageIcon className="w-10 h-10 text-primary" />
            </div>
            <ul className="menu p-4 w-full text-base-content flex-grow">
              {sidebarItems.map((item) => (
                <li key={item.href} className="mb-2">
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-4 px-4 py-2 rounded-lg ${
                      pathname === item.href
                        ? "bg-primary text-white"
                        : "hover:bg-base-300"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-6 h-6" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            {user && (
              <div className="p-4">
                <button
                  onClick={handleSignOut}
                  className="btn btn-outline btn-error w-full"
                >
                  <LogOutIcon className="mr-2 h-5 w-5" />
                  Sign Out
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <div className="flex flex-col h-full">
          {/* Navbar */}
          <header className="w-full bg-base-200 border-b border-base-300">
            <div className="navbar max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex-none lg:hidden">
                <label
                  htmlFor="sidebar-drawer"
                  className="btn btn-square btn-ghost drawer-button"
                >
                  <MenuIcon />
                </label>
              </div>
              <div className="flex-1">
                <Link href="/" onClick={handleLogoClick}>
                  <div className="btn btn-ghost normal-case text-3xl font-bold tracking-tight cursor-pointer bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent font-[Pacifico]">
                    MediaMorph
                  </div>
                </Link>
              </div>
              <div className="flex-none flex items-center space-x-4">
                {user && (
                  <>
                    <div className="avatar">
                      <div className="w-8 h-8 rounded-full">
                        <img
                          src={user.imageUrl}
                          alt={
                            user.username || user.emailAddresses[0].emailAddress
                          }
                        />
                      </div>
                    </div>
                    <span className="text-sm truncate max-w-xs lg:max-w-md">
                      {user.username || user.emailAddresses[0].emailAddress}
                    </span>
                    <button
                      onClick={handleSignOut}
                      className="btn btn-ghost btn-circle"
                    >
                      <LogOutIcon className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </header>
          
          {/* Page content */}
          <main className="flex-grow overflow-auto">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}