'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { CreditCard, ShoppingCart, Gift, Zap } from 'lucide-react';

interface CreditData {
  credits: number;
  creditHistory: any[];
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
      name: 'Basic Pack',
      credits: 50,
      price: 9.99,
      popular: false,
      icon: <Zap className="h-6 w-6" />
    },
    {
      id: 'pro',
      name: 'Pro Pack',
      credits: 150,
      price: 24.99,
      popular: true,
      icon: <ShoppingCart className="h-6 w-6" />
    },
    {
      id: 'premium',
      name: 'Premium Pack',
      credits: 500,
      price: 79.99,
      popular: false,
      icon: <Gift className="h-6 w-6" />
    }
  ];

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Credits</h1>
        <p className="text-base-content/60">Manage your credits and purchase more</p>
      </div>

      {/* Current Credits */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <div className="flex items-center gap-4">
            <CreditCard className="h-8 w-8 text-primary" />
            <div>
              <h2 className="card-title">Current Balance</h2>
              <p className="text-2xl font-bold text-primary">
                {creditData?.credits || 0} credits
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Credit Packages */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Purchase Credits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creditPackages.map((pkg) => (
            <div key={pkg.id} className={`card bg-base-100 shadow-xl ${pkg.popular ? 'ring-2 ring-primary' : ''}`}>
              <div className="card-body">
                {pkg.popular && (
                  <div className="badge badge-primary absolute top-2 right-2">Most Popular</div>
                )}
                <div className="flex items-center gap-2 mb-4">
                  {pkg.icon}
                  <h3 className="card-title">{pkg.name}</h3>
                </div>
                <div className="text-3xl font-bold mb-2">
                  ${pkg.price}
                </div>
                <div className="text-lg mb-4">
                  {pkg.credits} credits
                </div>
                <div className="card-actions">
                  <button 
                    onClick={() => handleBuy(pkg.id, pkg.name, pkg.price, pkg.credits)} 
                    className="btn btn-primary w-full"
                    disabled={purchaseLoading === pkg.id}
                  >
                    {purchaseLoading === pkg.id ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      'Purchase'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Credit History */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Credit History</h2>
          <p className="text-sm text-base-content/60 mb-4">Your recent credit transactions</p>
          
          {creditData?.creditHistory && creditData.creditHistory.length > 0 ? (
            <div className="space-y-4">
              {creditData.creditHistory.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{log.description}</h4>
                    <p className="text-sm text-base-content/60">
                      {formatDate(log.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${log.amount > 0 ? 'text-success' : 'text-error'}`}>
                      {log.amount > 0 ? '+' : ''}{log.amount} credits
                    </p>
                    <span className="badge badge-outline">{log.type}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-base-content/60 py-8">
              No credit history yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 