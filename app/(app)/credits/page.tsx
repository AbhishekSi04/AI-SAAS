'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import {  Zap, Star, Crown,ArrowRight, Wallet } from 'lucide-react';
import { CreditLog } from '@/types';
import { Button } from '@/components/ui/button';

interface CreditData {
  credits: number;
  creditHistory: CreditLog[];
}

export default function CreditsPage() {
  const { user } = useUser();
  const [creditData, setCreditData] = useState<CreditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchaseLoading, setPurchaseLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchCreditData = async () => {
    try {
      const response = await fetch('/api/user/credits');
      if (response.ok) {
        const data = await response.json();
        setCreditData(data);
      }
    } catch (error) {
      console.error('Error fetching credit data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check for success/cancel messages from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const canceled = urlParams.get('canceled');
    
    if (success === 'true') {
      setMessage({ type: 'success', text: 'Payment successful! Your credits have been added.' });
      // Refresh credit data
      fetchCreditData();
    } else if (canceled === 'true') {
      setMessage({ type: 'error', text: 'Payment was canceled.' });
    }
  }, []);

  const handleBuy = async (packageId: string, title: string, price: number, credits: number) => {
    setPurchaseLoading(packageId);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          packageId, 
          title, 
          price, 
          credits,
          user_id: user?.id 
        }),
      });
      
      const data = await res.json();
      if (data.url) {
        console.log(message);
        window.location.href = data.url;
      } else {
        alert('Payment failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error initiating checkout:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setPurchaseLoading(null);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreditData();
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const creditPackages = [
    {
      id: 'basic',
      name: 'Starter',
      credits: 100,
      price: 0,
      popular: false,
      icon: Zap,
      color: '#38BDF8',
      desc: 'Perfect for small projects and testing',
    },
    {
      id: 'pro',
      name: 'Professional',
      credits: 1000,
      price: 49,
      popular: true,
      icon: Star,
      color: '#FACC15',
      desc: 'Ideal for growing businesses',
    },
    {
      id: 'premium',
      name: 'Premium',
      credits: 10000,
      price: 99,
      popular: false,
      icon: Crown,
      color: '#A855F7',
      desc: 'For large-scale applications',
    }
  ];
  

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#36c6f0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your credits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark text-white">

      {/* Current Credits Card */}
      <section className="py-2 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#23272f] border border-white/10 rounded-2xl p-8 mb-16 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Current Balance</h2>
                  <p className="text-4xl font-extrabold bg-gradient-to-r from-[#36c6f0] to-[#8f6ed5] bg-clip-text text-transparent">
                    {creditData?.credits || 0} credits
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-300 mb-2">Ready to use</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Credit Packages */}
      <section className="py-1 px-4">
        <div className="text-center mb-16">
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
          {creditPackages.map((pkg) => (
            <div key={pkg.id} className={`relative bg-[#23272f] border border-white/10 rounded-2xl p-8 flex flex-col items-center text-center shadow-xl ${pkg.popular ? 'scale-105 border-primary shadow-2xl z-10' : ''}`}>
              {pkg.popular && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-primary text-white px-4 py-1 font-semibold rounded-full text-sm shadow-md">Most Popular</span>
                </div>
              )}
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center ${pkg.popular ? 'animate-pulse-glow' : ''}`}>
                <pkg.icon className="w-8 h-8" color={pkg.color} />
              </div>
              <div className="text-2xl font-bold mb-2 text-white">{pkg.name}</div>
              <p className="text-gray-300 mb-4">{pkg.desc}</p>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">${pkg.price}</span>
                <span className="text-gray-300">/month</span>
              </div>
              <div className="text-lg mb-6">
                <span className="text-blue-400 font-bold">{pkg.credits.toLocaleString()}</span>
                <span className="text-gray-300"> credits</span>
              </div>
              {/* <ul className="space-y-3 mb-8 text-left w-full max-w-xs mx-auto">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-400 shrink-0" />
                    <span className="text-sm text-white">{feature}</span>
                  </li>
                ))}
              </ul> */}
              <Button 
                onClick={() => handleBuy(pkg.id, pkg.name, pkg.price, pkg.credits)} 
                className="w-full font-bold bg-gradient-to-r from-[#36c6f0] to-[#8f6ed5] hover:from-[#2bb3e6] hover:to-[#7a5fc2] text-white border-none shadow-md transition-all duration-200"
                size="lg"
                disabled={purchaseLoading === pkg.id}
              >
                {purchaseLoading === pkg.id ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    Purchase Credits <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
      </section>


      {/* Success/Error Messages */}
      {message && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-500/20 border-green-500/30 text-green-400' 
              : 'bg-red-500/20 border-red-500/30 text-red-400'
          }`}>
            <p className="font-medium">{message.text}</p>
          </div>
        </div>
      )}
    </div>
  );
}