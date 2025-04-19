
"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gray-900 text-white">
        <h1 className="text-5xl sm:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-pulse drop-shadow-xl transition-all duration-500 hover:scale-110">
          MediaMorph
        </h1>

      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        

        {!isSignedIn ? (
          <div className="flex flex-col gap-4 items-center mx-auto mt-5" >
            <button
              onClick={() => router.push("/sign-in")}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center gap-2"
            >
              🔐 Login
            </button>
            <p className="text-sm">Or</p>
            <button
              onClick={() => router.push("/sign-up")}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 flex items-center gap-2"
            >
              ✨ Sign Up
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-green-400">Welcome Back! 🎉</h1>
            <p className="text-lg text-gray-300">You are logged in. Enjoy exploring!</p>
          </div>
        )}
      </main>
    </div>

    
  );
}
