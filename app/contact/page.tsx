"use client";

import React, { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <div className="min-h-screen relative overflow-hidden text-white flex flex-col bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1683009427507-91db4f5a7e87?auto=format&fit=crop&w=1470&q=80')",
        }}
      />
      {/* Gradient Glow Blobs */}
      <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-purple-500 opacity-30 rounded-full filter blur-[160px] z-0" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-pink-500 opacity-30 rounded-full filter blur-[120px] z-0" />
      <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[600px] h-[300px] bg-blue-600 opacity-20 rounded-full filter blur-[200px] z-0" />
      {/* Container with max-width 1080px */}
      <div className="relative z-10 w-full max-w-[1080px] mx-auto flex flex-col min-h-screen px-6">
        <main className="flex-1 flex items-center justify-center flex-col text-center">
          <div className="bg-white/10 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/40 max-w-lg w-full mb-6">
            <h1 className="text-3xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">Contact Us</h1>
            <p className="text-center text-gray-300 mb-8">We'd love to hear from you! Fill out the form below and we'll get back to you soon.</p>
            <form className="flex flex-col gap-5">
              <input
                type="text"
                placeholder="Your Name"
                className="px-4 py-3 rounded-lg bg-[#23244d] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Your Email"
                className="px-4 py-3 rounded-lg bg-[#23244d] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
              <textarea
                placeholder="Your Message"
                rows={5}
                className="px-4 py-3 rounded-lg bg-[#23244d] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
              />
              <button
                type="button"
                className="w-full py-3 mt-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full font-semibold text-lg shadow-lg transition-all duration-200"
              >
                Send Message
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
} 