import React, { useState } from 'react';
import { Sun, Moon, Bell, User, Menu, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { useResponsive } from '../hooks/useResponsive';
import NotificationDropdown from './NotificationDropdown';
import BrandLogo from './BrandLogo';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { adminProfile } = useData();
  const { isMobile } = useResponsive();
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(7);

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 px-4 md:px-6 py-4 relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-gray-900/50"></div>
      
      <div className="relative z-10 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {isMobile && (
            <div className="flex items-center space-x-3">
              <BrandLogo size="sm" showText={false} />
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  LuxeStay Pro
                </h1>
              </div>
            </div>
          )}
          
          {!isMobile && (
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Hotel Administration
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Welcome back, {adminProfile?.name || 'Administrator'}
              </p>
            </div>
          )}
        </div>
        
        {/* Right Section */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Search - Mobile */}
          {isMobile && (
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-3 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-110 backdrop-blur-sm"
            >
              <Search className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-110 backdrop-blur-sm"
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-3 rounded-xl hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all duration-200 relative hover:scale-110 backdrop-blur-sm"
            >
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-xs text-white flex items-center justify-center font-medium shadow-lg animate-pulse">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
            
            <NotificationDropdown 
              isOpen={isNotificationOpen}
              onClose={() => setIsNotificationOpen(false)}
            />
          </div>
          
          {/* Profile */}
          <button 
            onClick={handleProfileClick}
            className={`flex items-center space-x-3 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-xl p-3 transition-all duration-200 group hover:scale-105 backdrop-blur-sm ${
              isMobile ? 'space-x-0' : 'space-x-3'
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                {adminProfile?.profilePicture ? (
                  <img 
                    src={adminProfile?.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-sm">
                    {(adminProfile?.name || 'Admin').split(' ').map(n => n[0]).join('')}
                  </span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            {!isMobile && (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {adminProfile?.name || 'Admin'}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isMobile && isSearchOpen && (
        <div className="relative z-10 mt-4 animate-in slide-in-from-top duration-200">
          <input
            type="text"
            placeholder="Search customers, bookings..."
            className="w-full px-4 py-3 bg-white/90 dark:bg-gray-700/90 backdrop-blur-lg border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            autoFocus
          />
        </div>
      )}
    </header>
  );
};

export default Header;