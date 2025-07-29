"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Menu, X, Sparkles, Zap, Shield, Mail, User, MessageCircle, Phone, Clock, Star, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  return (
    <div className="min-h-screen bg-gradient-dark text-white flex flex-col">
      {/* Header */}
      <header className="w-full fixed top-0 left-0 z-30 bg-black/80 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#36c6f0] to-[#8f6ed5] drop-shadow-glow cursor-pointer select-none" onClick={() => router.push("/")}>
            MediaMorph
          </div>
          <nav className="hidden md:flex gap-8 text-lg font-semibold">
            <span className="hover:text-blue-400 cursor-pointer transition" onClick={() => router.push("/#features")}>Features</span>
            <span className="hover:text-green-400 cursor-pointer transition" onClick={() => router.push("/#pricing")}>Pricing</span>
            <span className="hover:text-purple-400 cursor-pointer transition" onClick={() => router.push("/#faq")}>FAQ</span>
            <span className="hover:text-pink-400 cursor-pointer transition text-pink-400" onClick={() => router.push("/contact")}>Contact</span>
          </nav>
          <div className="hidden md:flex gap-4">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 shadow-md border-none"
              onClick={() => router.push("/sign-in")}
            >
              Login
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 shadow-md border-none"
              onClick={() => router.push("/sign-up")}
            >
              Sign Up
            </Button>
          </div>
          <button className="md:hidden p-2" onClick={() => setNavOpen(!navOpen)}>{navOpen ? <X size={28}/> : <Menu size={28}/>}</button>
        </div>
        {/* Mobile Nav */}
        {navOpen && (
          <div className="md:hidden bg-black/95 border-t border-white/10 px-6 py-4 flex flex-col gap-4 text-lg font-semibold">
            <span className="hover:text-blue-400 cursor-pointer transition" onClick={() => {router.push("/#features");setNavOpen(false);}}>Features</span>
            <span className="hover:text-green-400 cursor-pointer transition" onClick={() => {router.push("/#pricing");setNavOpen(false);}}>Pricing</span>
            <span className="hover:text-purple-400 cursor-pointer transition" onClick={() => {router.push("/#faq");setNavOpen(false);}}>FAQ</span>
            <span className="hover:text-pink-400 cursor-pointer transition text-pink-400" onClick={() => {router.push("/contact");setNavOpen(false);}}>Contact</span>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 shadow-md border-none"
              onClick={() => {router.push("/sign-in");setNavOpen(false);}}
            >
              Login
            </Button>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 shadow-md border-none"
              onClick={() => {router.push("/sign-up");setNavOpen(false);}}
            >
              Sign Up
            </Button>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-[50vh] pt-32 pb-16 px-4 text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#23272f] border border-primary/30 mb-8">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-blue-300">Get In Touch</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-[#36c6f0] via-[#22c55e] to-[#8f6ed5] bg-clip-text text-transparent">
          Contact Our <span className="block mt-2">Expert Team</span>
        </h1>
        <p className="text-xl md:text-2xl text-white mb-12 max-w-2xl mx-auto leading-relaxed">
          Have questions about our API? Need custom solutions? We are here to help you transform your creative vision.
        </p>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4 bg-transparent">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">Let Start a <span className="gradient-text">Conversation</span></h2>
              <p className="text-xl text-gray-300 mb-8">We are excited to learn about your project and help you achieve your goals with our AI-powered media processing platform.</p>
            </div>
            
            <div className="grid gap-6">
              <div className="flex items-start gap-4 p-6 bg-[#23272f] border border-white/10 rounded-2xl">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Email Us</h3>
                  <p className="text-gray-300 mb-2">Get in touch via email for detailed inquiries</p>
                  <a href="mailto:support@mediamorph.ai" className="text-blue-400 hover:text-blue-300 transition-colors">support@mediamorph.ai</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-[#23272f] border border-white/10 rounded-2xl">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Call Us</h3>
                  <p className="text-gray-300 mb-2">Speak directly with our support team</p>
                  <a href="tel:+1-555-0123" className="text-green-400 hover:text-green-300 transition-colors">+1 (555) 012-3456</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-[#23272f] border border-white/10 rounded-2xl">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Support Hours</h3>
                  <p className="text-gray-300 mb-2">We are available when you need us</p>
                  <p className="text-purple-400">24/7 for Enterprise customers</p>
                  <p className="text-gray-300">Mon-Fri 9AM-6PM PST for others</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#23272f] border border-white/10 rounded-2xl p-8 shadow-xl">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Send us a Message</h3>
              <p className="text-gray-300">Fill out the form below and we will get back to you within 24 hours.</p>
            </div>

            <form className="space-y-6">
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#1f1f29] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#1f1f29] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="relative">
                <MessageCircle className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <textarea
                  rows={5}
                  placeholder="Tell us about your project or question..."
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-[#1f1f29] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none border border-white/10"
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <Button
                type="button"
                className="w-full py-3 text-lg font-bold bg-gradient-to-r from-[#36c6f0] to-[#8f6ed5] hover:from-[#2bb3e6] hover:to-[#7a5fc2] text-white border-none shadow-md transition duration-200"
                onClick={() => {
                  if (form.name && form.email && form.message) {
                    alert("Thanks for reaching out! We'll get back to you soon.");
                    setForm({ name: "", email: "", message: "" });
                  } else {
                    alert("Please fill out all fields.");
                  }
                }}
              >
                Send Message <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#18181b] border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold gradient-text">MediaMorph</span>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">Transform your creative vision with our powerful AI-driven image and video processing API.</p>
              <div className="flex gap-3">
                <Button variant="ghost" size="icon" className="hover:bg-primary/10"><Star className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10"><Shield className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10"><Mail className="w-4 h-4" /></Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">API Documentation</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Image Processing</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Video Enhancement</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">AI Generation</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Background Removal</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Getting Started</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Tutorials</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Support Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-gray-300">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Careers</a></li>
                <li><a href="/contact" className="text-gray-300 hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors flex items-center gap-2"><Shield className="w-4 h-4" />Privacy Policy</a></li>
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-300">
            <div>© 2024 MediaMorph. All rights reserved.</div>
            <div className="flex items-center gap-3">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-600" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
