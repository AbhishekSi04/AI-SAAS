'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  CreditCard, 
  Image, 
  Video, 
  History, 
  DollarSign,
  User,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface DashboardData {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    credits: number;
    createdAt: string;
  };
  stats: {
    totalVideos: number;
    totalImages: number;
    totalTransactions: number;
    totalSpent: number;
    completedTransactions: number;
    pendingTransactions: number;
  };
  recentActivity: {
    videos: any[];
    images: any[];
    creditLogs: any[];
  };
}

export default function DashboardPage() {
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/user/dashboard');
        if (response.ok) {
          const data = await response.json();
          setDashboardData(data);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <p className="text-gray-600">Unable to load dashboard data.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {dashboardData.user.firstName || 'User'}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h2 className="card-title text-sm">Credits</h2>
              <CreditCard className="h-4 w-4 text-base-content/60" />
            </div>
            <div className="text-2xl font-bold">{dashboardData.user.credits}</div>
            <p className="text-xs text-base-content/60">Available credits</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h2 className="card-title text-sm">Videos</h2>
              <Video className="h-4 w-4 text-base-content/60" />
            </div>
            <div className="text-2xl font-bold">{dashboardData.stats.totalVideos}</div>
            <p className="text-xs text-base-content/60">Total videos</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h2 className="card-title text-sm">Images</h2>
              <Image className="h-4 w-4 text-base-content/60" />
            </div>
            <div className="text-2xl font-bold">{dashboardData.stats.totalImages}</div>
            <p className="text-xs text-base-content/60">Total images</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h2 className="card-title text-sm">Total Spent</h2>
              <DollarSign className="h-4 w-4 text-base-content/60" />
            </div>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.stats.totalSpent)}</div>
            <p className="text-xs text-base-content/60">Lifetime spending</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-base-content/60">
                {dashboardData.user.firstName} {dashboardData.user.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-base-content/60">{dashboardData.user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Member Since</p>
              <p className="text-sm text-base-content/60">
                {formatDate(dashboardData.user.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Account Status</p>
              <span className="badge badge-primary">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-6">
        {/* Recent Videos */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Recent Videos</h2>
            <p className="text-sm text-base-content/60">Your recently processed videos</p>
            {dashboardData.recentActivity.videos.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentActivity.videos.map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{video.title}</h4>
                      <p className="text-sm text-base-content/60">{video.description}</p>
                      <p className="text-xs text-base-content/60">
                        {formatDate(video.createdAt)}
                      </p>
                    </div>
                    <span className="badge badge-secondary">{video.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-base-content/60 py-8">
                No videos yet. Start by uploading your first video!
              </p>
            )}
          </div>
        </div>

        {/* Recent Images */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Recent Images</h2>
            <p className="text-sm text-base-content/60">Your recently processed images</p>
            {dashboardData.recentActivity.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dashboardData.recentActivity.images.map((image) => (
                  <div key={image.id} className="border rounded-lg p-4">
                    <img 
                      src={image.secureUrl} 
                      alt={image.title || 'Image'} 
                      className="w-full h-32 object-cover rounded mb-2"
                    />
                    <h4 className="font-medium text-sm">{image.title || 'Untitled'}</h4>
                    <p className="text-xs text-base-content/60">
                      {formatDate(image.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-base-content/60 py-8">
                No images yet. Start by uploading your first image!
              </p>
            )}
          </div>
        </div>

        {/* Credit History */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Credit History</h2>
            <p className="text-sm text-base-content/60">Your credit usage and purchase history</p>
            {dashboardData.recentActivity.creditLogs.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentActivity.creditLogs.map((log) => (
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
    </div>
  );
} 