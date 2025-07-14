import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { User } from '../types';
import { validateEmail, validatePassword } from '../utils/validation';

// Configure axios defaults
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Don't set baseURL since we're using proxy
// axios.defaults.baseURL = API_BASE_URL;

// Add token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('hotel-admin-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('hotel-admin-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updatePassword: (newPassword: string) => void;
  getCurrentCredentials: () => { email: string; password: string };
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCredentials, setCurrentCredentials] = useState({ 
    email: 'admin@luxestay.com', 
    password: 'password123' 
  });

  useEffect(() => {
    // Check for stored JWT token and validate with backend
    const token = localStorage.getItem('hotel-admin-token');
    if (token) {
      // Check if it's a demo token
      if (token.startsWith('demo-token-')) {
        const demoUser = {
          id: '1',
          email: currentCredentials.email,
          name: 'Hotel Administrator',
          role: 'admin',
          phone: '+1-555-123-4567',
          bio: 'Experienced hotel administrator with over 10 years in hospitality management.',
          joinedDate: '2020-01-15'
        };
        setUser(demoUser);
        setIsLoading(false);
      } else {
        // Validate real token with backend
        axios.get('/api/auth/profile')
          .then(response => {
            setUser(response.data.user);
          })
          .catch(() => {
            localStorage.removeItem('hotel-admin-token');
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Validate input
    const emailValidation = validateEmail(username);
    const passwordValidation = validatePassword(password);
    
    if (!emailValidation.isValid || !passwordValidation.isValid) {
      setIsLoading(false);
      return false;
    }
    
    // Demo mode authentication - check credentials locally first
    if (username === currentCredentials.email && password === currentCredentials.password) {
      const demoUser = {
        id: '1',
        email: currentCredentials.email,
        name: 'Hotel Administrator',
        role: 'admin',
        phone: '+1-555-123-4567',
        bio: 'Experienced hotel administrator with over 10 years in hospitality management.',
        joinedDate: '2020-01-15'
      };
      
      // Store demo token
      localStorage.setItem('hotel-admin-token', 'demo-token-' + Date.now());
      setUser(demoUser);
      setIsLoading(false);
      return true;
    }
    
    try {
      const response = await axios.post('/api/auth/login', {
        email: username,
        password: password
      });

      const { token, user } = response.data;
      localStorage.setItem('hotel-admin-token', token);
      setUser(user);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      
      // If API fails, check demo credentials as fallback
      if (username === currentCredentials.email && password === currentCredentials.password) {
        const demoUser = {
          id: '1',
          email: currentCredentials.email,
          name: 'Hotel Administrator',
          role: 'admin',
          phone: '+1-555-123-4567',
          bio: 'Experienced hotel administrator with over 10 years in hospitality management.',
          joinedDate: '2020-01-15'
        };
        
        localStorage.setItem('hotel-admin-token', 'demo-token-' + Date.now());
        setUser(demoUser);
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('hotel-admin-token');
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // If email is updated, update credentials and force logout
      if (updates.email && updates.email !== user.email) {
        setCurrentCredentials(prev => ({ ...prev, email: updates.email! }));
        // Force logout to login page with new credentials
        setTimeout(() => {
          logout();
          window.location.href = '/login';
        }, 2000);
      }
    }
  };

  const updatePassword = (newPassword: string) => {
    setCurrentCredentials(prev => ({ ...prev, password: newPassword }));
    // Force logout to login page with new credentials
    setTimeout(() => {
      logout();
      window.location.href = '/login';
    }, 2000);
  };

  const getCurrentCredentials = () => currentCredentials;
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateUser, 
      updatePassword,
      getCurrentCredentials, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};