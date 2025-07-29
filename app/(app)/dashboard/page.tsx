'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { 
  CreditCard, 
  Image, 
  Video, 
  User,
  Wallet,
  TrendingUp,
  Activity,
  Calendar,
  Star,
  Zap
} from 'lucide-react';
import { Video as VideoType, Image as ImageType, CreditLog } from '@/types';

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
    videos: VideoType[];
    images: ImageType[];
    creditLogs: CreditLog[];
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
          console.log(data);
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

  // const formatCurrency = (amount: number) => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD'
  //   }).format(amount / 100);
  // };

  return (
    <div className="min-h-screen bg-gradient-dark text-white">

      {/* Stats Cards */}
      <section className="py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <div className="bg-[#23272f] border border-white/10 rounded-2xl p-6 shadow-xl hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Credits</h3>
              <p className="text-3xl font-bold bg-gradient-to-r from-[#36c6f0] to-[#8f6ed5] bg-clip-text text-transparent">
                {dashboardData.user.credits.toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm mt-2">Available credits</p>
            </div>

            <div className="bg-[#23272f] border border-white/10 rounded-2xl p-6 shadow-xl hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
                <Activity className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Videos</h3>
              <p className="text-3xl font-bold text-purple-400">
                {dashboardData.stats.totalVideos}
              </p>
              <p className="text-gray-400 text-sm mt-2">Total processed</p>
            </div>

            <div className="bg-[#23272f] border border-white/10 rounded-2xl p-6 shadow-xl hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Image className="w-6 h-6 text-white" />
                </div>
                <Star className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Images</h3>
              <p className="text-3xl font-bold text-green-400">
                {dashboardData.stats.totalImages}
              </p>
              <p className="text-gray-400 text-sm mt-2">Total processed</p>
            </div>

            {/* <div className="bg-[#23272f] border border-white/10 rounded-2xl p-6 shadow-xl hover:scale-[1.02] transition-transform duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Total Spent</h3>
              <p className="text-3xl font-bold text-yellow-400">
                {formatCurrency(dashboardData.stats.totalSpent)}
              </p>
              <p className="text-gray-400 text-sm mt-2">Lifetime spending</p>
            </div> */}
          </div>
        </div>
      </section>

      {/* User Profile */}
      <section className="py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#23272f] border border-white/10 rounded-2xl p-8 mb-16 shadow-xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Profile Information</h2>
                <p className="text-gray-300">Manage your account details and preferences</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Name</h3>
                </div>
                <p className="text-gray-300 font-medium">
                  {dashboardData.user.firstName} {dashboardData.user.lastName}
                </p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Email</h3>
                </div>
                <p className="text-gray-300 font-medium truncate">{dashboardData.user.email}</p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Member Since</h3>
                </div>
                <p className="text-gray-300 font-medium">
                  {formatDate(dashboardData.user.createdAt)}
                </p>
              </div>
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Status</h3>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-4 px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Recent Videos */}
          <div className="bg-[#23272f] border border-white/10 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Recent Videos</h2>
                <p className="text-gray-300">Your recently processed video content</p>
              </div>
            </div>
            
            {dashboardData.recentActivity.videos.length > 0 ? (
              <div className="grid gap-4">
                {dashboardData.recentActivity.videos.map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Video className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-lg">{video.title}</h4>
                        <p className="text-gray-400">{video.description}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(video.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        video.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        video.status === 'PROCESSING' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {video.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg mb-2">No videos yet</p>
                <p className="text-gray-500">Start by uploading your first video to see it here</p>
              </div>
            )}
          </div>

          {/* Recent Images */}
          <div className="bg-[#23272f] border border-white/10 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                <Image className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Recent Images</h2>
                <p className="text-gray-300">Your recently processed image content</p>
              </div>
            </div>
            
            {dashboardData.recentActivity.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboardData.recentActivity.images.map((image) => (
                  <div key={image.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors group">
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img 
                        src={image.secureUrl} 
                        alt={image.title || 'Image'} 
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h4 className="font-semibold text-white mb-2">{image.title || 'Untitled'}</h4>
                    <p className="text-sm text-gray-400">
                      {formatDate(image.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg mb-2">No images yet</p>
                <p className="text-gray-500">Start by uploading your first image to see it here</p>
              </div>
            )}
          </div>

          {/* Credit History */}
          <div className="bg-[#23272f] border border-white/10 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Credit History</h2>
                <p className="text-gray-300">Track your credit usage and purchases</p>
              </div>
            </div>
            
            {dashboardData.recentActivity.creditLogs.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentActivity.creditLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        log.amount > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {log.amount > 0 ? '+' : '-'}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-lg">{log.description}</h4>
                        <p className="text-sm text-gray-400">
                          {formatDate(log.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-xl ${
                        log.amount > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {log.amount > 0 ? '+' : ''}{log.amount} credits
                      </p>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {log.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-lg mb-2">No credit history yet</p>
                <p className="text-gray-500">Your credit transactions will appear here once you start using the platform</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
} 