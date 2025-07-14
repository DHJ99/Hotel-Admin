import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, DollarSign, Users, Star, RefreshCw } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useResponsive } from '../hooks/useResponsive';
import PullToRefresh from '../components/PullToRefresh';
import LoadingSpinner from '../components/LoadingSpinner';

const Analytics: React.FC = () => {
  const { getAnalytics, analyticsMetrics, isCalculatingMetrics, refreshData } = useData();
  const { isMobile } = useResponsive();
  const analytics = getAnalytics();
  const satisfactionColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const handleRefresh = async () => {
    await refreshData();
  };

  const AnalyticsContent = () => (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Insights into hotel performance and guest satisfaction</p>
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

      {/* Key Metrics */}
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-4 gap-6'}`}>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className={`text-2xl md:text-3xl font-bold text-gray-900 dark:text-white ${
                isCalculatingMetrics ? 'animate-pulse' : ''
              }`}>
                ${(analyticsMetrics.totalRevenue || analytics.totalRevenue).toLocaleString()}
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12.5%
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 md:p-4 rounded-2xl shadow-lg">
              <DollarSign className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Occupancy</p>
              <p className={`text-2xl md:text-3xl font-bold text-gray-900 dark:text-white ${
                isCalculatingMetrics ? 'animate-pulse' : ''
              }`}>
                {analyticsMetrics.occupancyRate || analytics.occupancyRate}%
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +5.2%
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 md:p-4 rounded-2xl shadow-lg">
              <Users className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</p>
              <p className={`text-2xl md:text-3xl font-bold text-gray-900 dark:text-white ${
                isCalculatingMetrics ? 'animate-pulse' : ''
              }`}>
                {analyticsMetrics.satisfaction || 4.5}/5
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +0.3
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-3 md:p-4 rounded-2xl shadow-lg">
              <Star className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Repeat Guests</p>
              <p className={`text-2xl md:text-3xl font-bold text-gray-900 dark:text-white ${
                isCalculatingMetrics ? 'animate-pulse' : ''
              }`}>
                {analyticsMetrics.repeatGuests || 32}%
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />
                +2.1%
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 md:p-4 rounded-2xl shadow-lg">
              <Users className="h-6 w-6 md:h-8 md:w-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-6' : 'lg:grid-cols-2 gap-8'}`}>
        {/* Monthly Revenue */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
            <BarChart data={analyticsMetrics.monthlyRevenue || []}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
              <XAxis 
                dataKey="month" 
                className="text-gray-600 dark:text-gray-400"
                tick={{ fill: 'currentColor', fontSize: isMobile ? 10 : 12 }}
              />
              <YAxis 
                className="text-gray-600 dark:text-gray-400"
                tick={{ fill: 'currentColor', fontSize: isMobile ? 10 : 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgb(31 41 55)', 
                  border: '1px solid rgb(75 85 99)',
                  borderRadius: '12px',
                  color: 'white'
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-xl transition-all duration-300">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Occupancy Rate</h3>
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
            <LineChart data={analyticsMetrics.occupancyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-600" />
              <XAxis 
                dataKey="month" 
                className="text-gray-600 dark:text-gray-400"
                tick={{ fill: 'currentColor', fontSize: isMobile ? 10 : 12 }}
              />
              <YAxis 
                className="text-gray-600 dark:text-gray-400"
                tick={{ fill: 'currentColor', fontSize: isMobile ? 10 : 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgb(31 41 55)', 
                  border: '1px solid rgb(75 85 99)',
                  borderRadius: '12px',
                  color: 'white'
                }}
                formatter={(value) => [`${value}%`, 'Occupancy Rate']}
              />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#10B981" 
                strokeWidth={4}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, stroke: '#10B981', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer Satisfaction */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 md:p-6 hover:shadow-xl transition-all duration-300">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Customer Satisfaction by Category</h3>
        <div className={`grid grid-cols-1 ${isMobile ? 'gap-6' : 'lg:grid-cols-2 gap-8'}`}>
          <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
            <PieChart>
              <Pie
                data={analyticsMetrics.customerSatisfaction || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, score }) => `${category}: ${score}`}
                outerRadius={isMobile ? 60 : 80}
                fill="#8884d8"
                dataKey="score"
              >
                {(analyticsMetrics.customerSatisfaction || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={satisfactionColors[index % satisfactionColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          
          <div className="space-y-4 md:space-y-6">
            {(analyticsMetrics.customerSatisfaction || []).map((item, index) => (
              <div key={item.category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full shadow-lg"
                    style={{ backgroundColor: satisfactionColors[index % satisfactionColors.length] }}
                  />
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.category}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`${isMobile ? 'w-16' : 'w-24'} bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden`}>
                    <div 
                      className="h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ 
                        width: `${(item.score / 5) * 100}%`,
                        background: `linear-gradient(90deg, ${satisfactionColors[index % satisfactionColors.length]}, ${satisfactionColors[index % satisfactionColors.length]}dd)`
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white min-w-[2rem]">{item.score}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <PullToRefresh onRefresh={handleRefresh}>
        <AnalyticsContent />
      </PullToRefresh>
    );
  }

  return <AnalyticsContent />;
};

export default Analytics;