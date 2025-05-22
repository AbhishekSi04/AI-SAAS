import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen relative overflow-hidden text-white flex flex-col bg-black">
      {/* 🌌 Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1683009427507-91db4f5a7e87?auto=format&fit=crop&w=1470&q=80')",
        }}
      />
      {/* 💫 Gradient Glow Blobs */}
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-500 opacity-30 rounded-full filter blur-[160px] z-0" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink-500 opacity-30 rounded-full filter blur-[120px] z-0" />
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[600px] h-[300px] bg-blue-600 opacity-20 rounded-full filter blur-[200px] z-0" />
      {/* Centered Area */}
      <div className="relative z-10 w-full max-w-[1080px] mx-auto flex flex-col min-h-screen px-6">
        <main className="flex-1 flex items-center justify-center flex-col text-center">
          <SignUp />
        </main>
      </div>
    </div>
  );
}