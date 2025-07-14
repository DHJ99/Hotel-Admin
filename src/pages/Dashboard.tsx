import React from 'react';
import { Users, Calendar, TrendingUp, MessageCircle, DollarSign, Bed, ArrowRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useResponsive } from '../hooks/useResponsive';
import PullToRefresh from '../components/PullToRefresh';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { getAnalytics, bookings, analyticsMetrics, isCalculatingMetrics, refreshData } = useData();
  const { isMobile } = useResponsive();
  const analytics = getAnalytics();

  const stats = [
    {
      title: 'Active Guests',
      value: analyticsMetrics.activeGuests || analytics.activeCustomers,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Total Revenue',
      value: `$${(analyticsMetrics.totalRevenue || analytics.totalRevenue).toLocaleString()}`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      change: '+8%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Occupancy Rate',
      value: `${analyticsMetrics.occupancyRate || analytics.occupancyRate}%`,
      icon: Bed,
      color: 'from-purple-500 to-purple-600',
      change: '+5%',
      changeColor: 'text-green-600'
    },
    {
      title: 'Pending Bookings',
      value: analyticsMetrics.pendingBookings || analytics.pendingBookings,
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      change: '+3%',
      changeColor: 'text-green-600'
    }
  ];

  const recentBookings = bookings
    .filter(b => b.status === 'confirmed')
    .sort((a, b) => new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime())
    .slice(0, 5);

  const quickActions = [
    {
      title: 'View All Customers',
      description: 'Manage customer information',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      path: '/customers'
    },
    {
      title: 'Recent Bookings',
      description: 'View and manage bookings',
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      path: '/bookings'
    },
    {
      title: 'Analytics Report',
      description: 'View detailed analytics',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      path: '/analytics'
    },
    {
      title: 'AI Assistant',
      description: 'Get help with hotel operations',
      icon: MessageCircle,
      color: 'from-orange-500 to-orange-600',
      path: '/chat'
    }
  ];

  const handleRefresh = async () => {
    await refreshData();
  };

  const DashboardContent = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome to your hotel management system
          </p>
        </div>
        
        {!isMobile && (
          <button
            onClick={handleRefresh}
            disabled={isCalculatingMetrics}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 shadow-lg hover:shadow-xl hover:scale-105"
          >
            {isCalculatingMetrics ? (
              <LoadingSpinner size="sm" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span>Refresh</span>
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 lg:grid-cols-4 gap-6'}`}>
        {stats.map((stat, index) => (
          <div key={index} className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 ${
              isMobile ? 'p-4' : 'p-6'
            } hover:shadow-xl transition-all duration-300 hover:scale-105`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                  <p className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 dark:text-white mt-2 ${
                    isCalculatingMetrics ? 'animate-pulse' : ''
                  }`}>
                    {stat.value}
                  </p>
                  <p className={`text-sm ${stat.changeColor} flex items-center mt-2`}>
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`bg-gradient-to-br ${stat.color} ${isMobile ? 'p-3' : 'p-4'} rounded-2xl shadow-lg`}>
                  <stat.icon className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-white`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-6' : 'lg:grid-cols-2 gap-8'}`}>
        {/* Recent Bookings */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Bookings</h3>
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className={`flex items-center justify-between ${
                isMobile ? 'p-3' : 'p-4'
              } bg-gray-50/50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-600/50 transition-all duration-200`}>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{booking.customerName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Room {booking.roomNumber}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">${booking.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(booking.checkIn).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 gap-4'}`}>
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className={`group relative ${isMobile ? 'p-4' : 'p-4'} rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                <div className="relative">
                  <div className={`bg-gradient-to-br ${action.color} ${isMobile ? 'p-2' : 'p-3'} rounded-xl mb-3 w-fit`}>
                    <action.icon className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-white`} />
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{action.title}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{action.description}</p>
                  <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                    <span>Go to page</span>
                    <ArrowRight className="h-3 w-3 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <PullToRefresh onRefresh={handleRefresh}>
        <DashboardContent />
      </PullToRefresh>
    );
  }

  return <DashboardContent />;
};

export default Dashboard;