import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Customer, Booking, AdminProfile } from '../types';
import { useAnalytics } from '../hooks/useAnalytics';
import { useAuth } from './AuthContext';

interface DataContextType {
  customers: Customer[];
  bookings: Booking[];
  adminProfile: AdminProfile;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  updateAdminProfile: (updates: Partial<AdminProfile>) => void;
  getAnalytics: () => {
    totalRevenue: number;
    activeCustomers: number;
    occupancyRate: number;
    pendingBookings: number;
  };
  analyticsMetrics: any;
  isCalculatingMetrics: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    id: '1',
    name: 'Hotel Administrator',
    email: 'admin@hotelmanager.com',
    phone: '+1 555-123-4567',
    bio: 'Experienced hotel administrator with over 10 years in hospitality management.',
    role: 'Administrator',
    joinedDate: '2020-01-15',
    profilePicture: undefined
  });
  const { metrics: analyticsMetrics, updateMetrics, isCalculating: isCalculatingMetrics } = useAnalytics();
  const { user, isLoading: authLoading } = useAuth();

  // Load initial data
  useEffect(() => {
    // Only load data if user is authenticated and auth loading is complete
    if (!authLoading && user) {
      loadData();
    }
  }, [user, authLoading]);

  const loadData = async () => {
    // Always use mock data for demo purposes to avoid API errors
    const { mockCustomers, mockBookings } = await import('../data/mockData');
    setCustomers(mockCustomers);
    setBookings(mockBookings);
    return;

    // Note: API integration is available but disabled for demo stability
    // To enable API calls, uncomment the try-catch block above
  };

  // Update analytics whenever data changes
  useEffect(() => {
    updateMetrics(customers, bookings);
  }, [customers, bookings, updateMetrics]);

  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    // Update customer locally first for immediate UI feedback
    setCustomers(prev => prev.map(customer => 
      customer.id === id ? { ...customer, ...updates } : customer
    ));
    
    // Update related bookings if customer name changed
    if (updates.name) {
      setBookings(prev => prev.map(booking => 
        booking.customerId === id ? { ...booking, customerName: updates.name! } : booking
      ));
    }

    // Note: API updates disabled for demo stability
    // Local updates are sufficient for demonstration purposes
  }, [user]);

  const updateBooking = useCallback((id: string, updates: Partial<Booking>) => {
    // Get current booking for amount comparison
    const currentBooking = bookings.find(b => b.id === id);
    if (!currentBooking) return;
    
    const oldAmount = currentBooking?.amount || 0;
    const newAmount = updates.amount !== undefined ? updates.amount : oldAmount;
    const amountDifference = newAmount - oldAmount;

    // Update booking locally first for immediate UI feedback
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, ...updates } : booking
    ));
    
    // Update customer's total spent if amount changed
    if (amountDifference !== 0) {
      setCustomers(prev => prev.map(customer => 
        customer.id === currentBooking.customerId 
          ? { ...customer, totalSpent: customer.totalSpent + amountDifference }
          : customer
      ));
    }

    // Note: API updates disabled for demo stability
    // Local updates are sufficient for demonstration purposes
  }, [bookings, user]);
  
  const updateAdminProfile = useCallback((updates: Partial<AdminProfile>) => {
    setAdminProfile(prev => ({ ...prev, ...updates }));
  }, [user]);

  const getAnalytics = useCallback(() => {
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    const totalRevenue = bookings
      .filter(b => b.status !== 'cancelled')
      .reduce((sum, booking) => sum + booking.amount, 0);
    const occupancyRate = Math.round((activeCustomers / 100) * 100);
    const pendingBookings = bookings.filter(b => b.status === 'confirmed').length;

    return {
      totalRevenue,
      activeCustomers,
      occupancyRate,
      pendingBookings
    };
  }, [customers, bookings]);

  const refreshData = useCallback(async () => {
    try {
      await loadData();
      // Trigger analytics recalculation
      updateMetrics(customers, bookings);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  }, [customers, bookings, updateMetrics]);

  return (
    <DataContext.Provider value={{
      customers,
      bookings,
      adminProfile,
      updateCustomer,
      updateBooking,
      updateAdminProfile,
      getAnalytics,
      analyticsMetrics,
      isCalculatingMetrics,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};