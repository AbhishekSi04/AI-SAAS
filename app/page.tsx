"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  // const { isSignedIn } = useUser();
  const router = useRouter();

  return (
    <div className="min-h-screen relative overflow-hidden text-white flex flex-col bg-black">
      {/*  Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1683009427507-91db4f5a7e87?auto=format&fit=crop&w=1470&q=80')",
        }}
      />

      {/*  Gradient Glow Blobs */}
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-500 opacity-30 rounded-full filter blur-[160px] z-0" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink-500 opacity-30 rounded-full filter blur-[120px] z-0" />
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[600px] h-[300px] bg-blue-600 opacity-20 rounded-full filter blur-[200px] z-0" />

      {/* Container with max-width 1080px */}
      <div className="relative z-10 w-full max-w-[1080px] mx-auto flex flex-col min-h-screen px-6">
        {/* Header */}
        <header className="py-5 flex justify-between items-center">
          <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 cursor-pointer">
            MediaMorph
          </div>
          <nav className="flex gap-8 text-lg font-semibold">
            <span
              className="hover:text-blue-400 cursor-pointer transition"
              onClick={() => router.push("#about")}
            >
              About
            </span>
            <span
              className="hover:text-purple-400 cursor-pointer transition"
              onClick={() => router.push("#features")}
            >
              Features
            </span>
            <span
              className="hover:text-green-400 cursor-pointer transition"
              onClick={() => router.push("/contact")}
            >
              Contact Us
            </span>
          </nav>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/sign-in")}
              className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full shadow-md transition-all duration-200 font-semibold"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/sign-up")}
              className="px-5 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-full shadow-md transition-all duration-200 font-semibold"
            >
              Sign Up
            </button>
          </div>
        </header>

        {/* Main Section */}
        <main className="flex-1 flex items-center justify-center flex-col text-center">
          {/* Glassmorphism Card */}
          <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/40 max-w-lg w-full mb-6">
            <h1 className="text-3xl font-bold text-white mb-4">
              AI POWERED <span className="text-blue-400">IMAGE GENERATION</span>
            </h1>
            <p className="text-2xl font-semibold bg-gradient-to-r from-violet-400 via-purple-300 to-blue-300 text-transparent bg-clip-text">
              SaaS App
            </p>
            <p className="mt-6 text-white/90">
              MediaMorph lets you generate, expand, and transform images with cutting-edge AI tools. Start exploring our features now!
            </p>
            <button onClick={() => router.push("/sign-up")} className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold shadow-lg hover:from-blue-600 hover:to-purple-600 transition">
              Get Started
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
