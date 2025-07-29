"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Menu, X, Sparkles, Zap, Shield, CreditCard, Upload, Video, ImageIcon, Scissors, Wand2, RotateCcw, Expand, PlayCircle, Star, Crown, Check, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Upload,
    title: "Image Upload",
    desc: "Upload and process images with advanced AI algorithms.",
    color: "#4F46E5", // Indigo-600
  },
  {
    icon: Video,
    title: "Video Upload",
    desc: "Seamlessly upload and enhance video content.",
    color: "#0EA5E9", // Sky-500
  },
  {
    icon: ImageIcon,
    title: "AI Image Generation",
    desc: "Create stunning images from text descriptions.",
    color: "#10B981", // Emerald-500
  },
  {
    icon: Scissors,
    title: "Background Removal",
    desc: "Instantly remove backgrounds with precision.",
    color: "#F59E0B", // Amber-500
  },
  {
    icon: Wand2,
    title: "Image Transform",
    desc: "Apply filters, effects, and transformations.",
    color: "#A855F7", // Purple-500
  },
  {
    icon: RotateCcw,
    title: "Generative Replace",
    desc: "Replace objects intelligently with AI.",
    color: "#EF4444", // Red-500
  },
  {
    icon: Expand,
    title: "Image Extender",
    desc: "Expand images beyond their original boundaries.",
    color: "#14B8A6", // Teal-500
  },
  {
    icon: PlayCircle,
    title: "Video Processing",
    desc: "Access and manage your video content.",
    color: "#6366F1", // Violet-500
  },
];


const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    credits: "100",
    desc: "Perfect for small projects and testing",
    icon: Zap,
    variant: "outline-glow",
    color: "#38BDF8", // Sky-400
  },
  {
    name: "Professional",
    price: "$49",
    period: "/month",
    credits: "1,000",
    desc: "Ideal for growing businesses",
    icon: Star,
    variant: "hero",
    popular: true,
    color: "#FACC15", // Yellow-400
  },
  {
    name: "Premium",
    price: "$99",
    period: "/month",
    credits: "10,000",
    desc: "For large-scale applications",
    icon: Crown,
    variant: "cta",
    color: "#A855F7", // Purple-500
  }
];


const faqs = [
  { q: "How does the credit system work?", a: "Each API call consumes credits based on the operation. Credits reset monthly with your subscription." },
  { q: "What happens if I exceed my monthly credits?", a: "You can upgrade your plan or purchase additional credits as needed." },
  { q: "Is there a free trial available?", a: "Yes! We offer a free trial with 100 credits. No credit card required." },
  { q: "What image and video formats do you support?", a: "JPEG, PNG, WebP, TIFF, GIF for images. MP4, MOV, AVI, WebM for videos." },
  { q: "How fast is the API processing?", a: "Average response times: 50ms for simple ops, 2-5s for complex AI." },
];

export default function Home() {
  const router = useRouter();
  const [navOpen, setNavOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-dark text-white flex flex-col">
      {/* Header */}
      <header className="w-full fixed top-0 left-0 z-30 bg-black/80 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[#36c6f0] to-[#8f6ed5] drop-shadow-glow cursor-pointer select-none">
            MediaMorph
          </div>
          <nav className="hidden md:flex gap-8 text-lg font-semibold">
            <span className="hover:text-blue-400 cursor-pointer transition" onClick={() => router.push("#features")}>Features</span>
            <span className="hover:text-green-400 cursor-pointer transition" onClick={() => router.push("#pricing")}>Pricing</span>
            <span className="hover:text-purple-400 cursor-pointer transition" onClick={() => router.push("#faq")}>FAQ</span>
            <span className="hover:text-pink-400 cursor-pointer transition" onClick={() => router.push("/contact")}>Contact</span>
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
            <span className="hover:text-blue-400 cursor-pointer transition" onClick={() => {router.push("#features");setNavOpen(false);}}>Features</span>
            <span className="hover:text-green-400 cursor-pointer transition" onClick={() => {router.push("#pricing");setNavOpen(false);}}>Pricing</span>
            <span className="hover:text-purple-400 cursor-pointer transition" onClick={() => {router.push("#faq");setNavOpen(false);}}>FAQ</span>
            <span className="hover:text-pink-400 cursor-pointer transition" onClick={() => {router.push("#contact");setNavOpen(false);}}>Contact</span>
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
      <section className="flex flex-col items-center justify-center min-h-[90vh] pt-32 pb-16 px-4 text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#23272f] border border-primary/30 mb-8">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-semibold text-blue-300">AI-Powered Image & Video Processing</span>
          <Zap className="w-4 h-4 text-green-400" />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight bg-gradient-to-r from-[#36c6f0] via-[#22c55e] to-[#8f6ed5] bg-clip-text text-transparent">
          Transform Your <span className="block mt-2">Creative Vision</span>
          <span className="text-3xl md:text-5xl block mt-4 bg-gradient-to-r from-[#36c6f0] to-[#8f6ed5] bg-clip-text text-transparent">with AI Magic</span>
        </h1>
        <p className="text-xl md:text-2xl text-white mb-12 max-w-2xl mx-auto leading-relaxed">
          Upload, transform, and enhance your images and videos with cutting-edge AI technology. Pay only for what you use with our flexible credit system.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button
            className="text-lg px-5 py-3 font-semibold bg-gradient-to-r from-[#36c6f0] to-[#8f6ed5] hover:from-[#2bb3e6] hover:to-[#7a5fc2] text-white rounded-md border-none shadow-md transition-colors duration-200"
            size="lg"
            onClick={() => {}}
          >
            Start Creating Free <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            className="text-lg px-5 py-3 font-semibold text-white rounded-md border-2 border-transparent bg-gradient-to-r from-[#36c6f0] to-[#8f6ed5] bg-clip-border hover:from-[#2bb3e6] hover:to-[#7a5fc2] shadow-md transition-colors duration-200"
            style={{ background: 'none', borderImage: 'linear-gradient(to right, #36c6f0, #8f6ed5) 1' }}
            size="lg"
            onClick={() => {}}
          >
            View API Docs
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-extrabold text-white mb-2">10M+</div>
            <div className="text-sm text-blue-300">Images Processed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-extrabold text-green-400 mb-2">99.9%</div>
            <div className="text-sm text-green-300">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-extrabold text-purple-300 mb-2">50ms</div>
            <div className="text-sm text-purple-200">Avg Response</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-extrabold text-pink-300 mb-2">24/7</div>
            <div className="text-sm text-pink-200">Support</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-transparent">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">Powerful <span className="gradient-text">AI Features</span></h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Our comprehensive API suite provides everything you need to build amazing image and video processing applications</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="bg-[#23272f] border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:scale-[1.03] transition-transform duration-200">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                <f.icon color={f.color} className="w-6 h-6 " />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{f.title}</h3>
              <p className="text-gray-300 mb-2 flex-grow">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
              <Zap className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Lightning Fast</h3>
            <p className="text-gray-300">Process images and videos in milliseconds with our optimized infrastructure</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow" style={{ animationDelay: '0.5s' }}>
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Enterprise Security</h3>
            <p className="text-gray-300">Bank-level security with end-to-end encryption and SOC 2 compliance</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow" style={{ animationDelay: '1s' }}>
              <CreditCard className="w-8 h-8 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">Pay Per Use</h3>
            <p className="text-gray-300">Flexible credit system - only pay for what you actually use</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 bg-transparent">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">Simple <span className="gradient-text">Credit-Based</span> Pricing</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">Choose the perfect plan for your needs. Scale up or down anytime with our flexible credit system.</p>
          <div className="inline-flex items-center gap-4 p-4 rounded-lg bg-[#23272f] border border-primary/20">
            <div className="text-center">
              <div className="text-sm text-gray-300">Image Processing</div>
              <div className="font-bold text-blue-400">1 Credit</div>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="text-center">
              <div className="text-sm text-gray-300">Video Processing</div>
              <div className="font-bold text-green-400">3-5 Credits</div>
            </div>
            <div className="w-px h-8 bg-border"></div>
            <div className="text-center">
              <div className="text-sm text-gray-300">AI Generation</div>
              <div className="font-bold text-purple-400">2-4 Credits</div>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div key={i} className={`relative bg-[#23272f] border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center shadow-xl ${plan.popular ? 'scale-105 border-primary shadow-2xl z-10' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-primary text-white px-4 py-1 font-semibold rounded-full text-sm shadow-md">Most Popular</span>
                </div>
              )}
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center ${plan.popular ? 'animate-pulse-glow' : ''}`}>
                <plan.icon className="w-8 h-8" color={plan.color} />
              </div>
              <div className="text-2xl font-bold mb-2 text-white">{plan.name}</div>
              <p className="text-gray-300 mb-4">{plan.desc}</p>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-300">{plan.period}</span>
              </div>
              <div className="text-lg mb-4">
                <span className="text-blue-400 font-bold">{plan.credits}</span>
                <span className="text-gray-300"> credits/month</span>
              </div>
              <ul className="space-y-3 mb-8 text-left w-full max-w-xs mx-auto">
                {/* {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-3"><Check className="w-5 h-5 text-green-400 shrink-0" /> <span className="text-sm text-white">{f}</span></li>
                ))} */}
              </ul>
              <Button onClick={()=>router.push('/sign-up')} variant={plan.variant as any} size="lg" className="w-full font-bold bg-gradient-to-r from-[#36c6f0] to-[#8f6ed5] hover:from-[#2bb3e6] hover:to-[#7a5fc2] text-white border-none shadow-md">
                {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 bg-transparent">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Frequently Asked <span className="gradient-text">Questions</span></h2>
          <p className="text-xl text-gray-300">Everything you need to know about our API and credit system</p>
        </div>
        <div className="max-w-2xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className={`border border-primary/10 rounded-lg px-6 py-4 transition-all duration-300 ${faqOpen === i ? 'bg-primary/5 border-primary/30' : ''}`}>              <button className="w-full text-left flex items-center justify-between py-2 font-semibold text-lg focus:outline-none" onClick={() => setFaqOpen(faqOpen === i ? null : i)}>
                <span>{faq.q}</span>
                <span className={`ml-2 transition-transform duration-200 ${faqOpen === i ? 'rotate-180' : ''}`}>▼</span>
              </button>
              {faqOpen === i && (
                <div className="pt-2 text-gray-300 leading-relaxed">{faq.a}</div>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <p className="text-gray-300 mb-6">Still have questions? We're here to help!</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="px-6 font-bold bg-[#22c55e] hover:bg-[#16a34a] text-white border-none shadow-md" onClick={()=>(router.push('/contact'))}>
              Contact Support
            </Button>
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
                <Button variant="ghost" size="icon" className="hover:bg-primary/10"><CreditCard className="w-4 h-4" /></Button>
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
                <li><a href="#" className="text-gray-300 hover:text-primary transition-colors">Contact</a></li>
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
