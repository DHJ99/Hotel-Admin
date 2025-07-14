import { useState, useEffect, useCallback } from 'react';
import { Customer, Booking } from '../types';

interface AnalyticsMetrics {
  activeGuests: number;
  totalRevenue: number;
  occupancyRate: number;
  pendingBookings: number;
  avgOccupancy: number;
  repeatGuests: number;
  satisfaction: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  occupancyTrend: Array<{ month: string; rate: number }>;
  customerSatisfaction: Array<{ category: string; score: number }>;
}

export const useAnalytics = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    activeGuests: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    pendingBookings: 0,
    avgOccupancy: 0,
    repeatGuests: 0,
    satisfaction: 4.5,
    monthlyRevenue: [],
    occupancyTrend: [],
    customerSatisfaction: [
      { category: 'Service', score: 4.5 },
      { category: 'Cleanliness', score: 4.7 },
      { category: 'Amenities', score: 4.2 },
      { category: 'Location', score: 4.8 },
      { category: 'Value', score: 4.3 }
    ]
  });
  const [isCalculating, setIsCalculating] = useState(false);

  const generateMonthlyRevenue = useCallback((bookings: Booking[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    return months.map(month => {
      const monthIndex = months.indexOf(month);
      const monthlyBookings = bookings.filter(booking => {
        const bookingDate = new Date(booking.checkIn);
        return bookingDate.getFullYear() === currentYear && 
               bookingDate.getMonth() === monthIndex &&
               booking.status !== 'cancelled';
      });
      
      const revenue = monthlyBookings.reduce((sum, booking) => sum + booking.amount, 0);
      return { month, revenue };
    });
  }, []);

  const generateOccupancyTrend = useCallback((bookings: Booking[], customers: Customer[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const totalRooms = 100;
    
    return months.map(month => {
      const monthIndex = months.indexOf(month);
      const monthlyActiveCustomers = customers.filter(customer => {
        const checkInDate = new Date(customer.checkIn);
        const checkOutDate = new Date(customer.checkOut);
        const monthStart = new Date(currentYear, monthIndex, 1);
        const monthEnd = new Date(currentYear, monthIndex + 1, 0);
        
        return (checkInDate <= monthEnd && checkOutDate >= monthStart);
      });
      
      const rate = Math.round((monthlyActiveCustomers.length / totalRooms) * 100);
      return { month, rate: Math.min(rate, 100) };
    });
  }, []);

  const updateMetrics = useCallback(async (customers: Customer[], bookings: Booking[]) => {
    // Don't calculate if no data
    if (!customers.length && !bookings.length) {
      setMetrics({
        activeGuests: 0,
        totalRevenue: 0,
        occupancyRate: 0,
        pendingBookings: 0,
        avgOccupancy: 0,
        repeatGuests: 0,
        satisfaction: 4.5,
        monthlyRevenue: [],
        occupancyTrend: [],
        customerSatisfaction: [
          { category: 'Service', score: 4.5 },
          { category: 'Cleanliness', score: 4.7 },
          { category: 'Amenities', score: 4.2 },
          { category: 'Location', score: 4.8 },
          { category: 'Value', score: 4.3 }
        ]
      });
      setIsCalculating(false);
      return;
    }
    
    setIsCalculating(true);
    
    // Reduced calculation time for more responsive updates
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      // Calculate active guests
      const activeGuests = customers.filter(c => c.status === 'active').length;

      // Calculate total revenue from completed and confirmed bookings
      const totalRevenue = bookings
        .filter(b => b.status === 'completed' || b.status === 'confirmed')
        .reduce((sum, booking) => sum + booking.amount, 0);

      // Calculate pending bookings
      const pendingBookings = bookings.filter(b => b.status === 'confirmed').length;

      // Calculate occupancy rate (assuming 100 total rooms)
      const totalRooms = 100;
      const occupiedRooms = customers.filter(c => c.status === 'active').length;
      const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);

      // Calculate average occupancy over time
      const avgOccupancy = Math.round(
        bookings.reduce((sum, booking) => {
          const days = Math.ceil(
            (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24)
          );
          return sum + days;
        }, 0) / Math.max(bookings.length, 1)
      );

      // Calculate repeat guests (customers with multiple bookings)
      const customerBookingCounts = bookings.reduce((acc, booking) => {
        acc[booking.customerId] = (acc[booking.customerId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const repeatGuestsCount = Object.values(customerBookingCounts).filter(count => count > 1).length;
      const repeatGuests = Math.round((repeatGuestsCount / Math.max(customers.length, 1)) * 100);

      // Generate monthly revenue data
      const monthlyRevenue = generateMonthlyRevenue(bookings);
      
      // Generate occupancy trend
      const occupancyTrend = generateOccupancyTrend(bookings, customers);

      // Update satisfaction based on recent bookings performance
      const recentBookings = bookings.filter(b => {
        const bookingDate = new Date(b.checkIn);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return bookingDate >= thirtyDaysAgo;
      });

      const satisfactionScore = recentBookings.length > 0 
        ? Math.min(5, 4.2 + (recentBookings.filter(b => b.status === 'completed').length / recentBookings.length) * 0.8)
        : 4.5;

      // Update customer satisfaction categories based on performance
      const customerSatisfaction = [
        { category: 'Service', score: Math.round((satisfactionScore + 0.1) * 10) / 10 },
        { category: 'Cleanliness', score: Math.round((satisfactionScore + 0.3) * 10) / 10 },
        { category: 'Amenities', score: Math.round((satisfactionScore - 0.2) * 10) / 10 },
        { category: 'Location', score: Math.round((satisfactionScore + 0.4) * 10) / 10 },
        { category: 'Value', score: Math.round((satisfactionScore - 0.1) * 10) / 10 }
      ];

      setMetrics({
        activeGuests,
        totalRevenue,
        occupancyRate,
        pendingBookings,
        avgOccupancy,
        repeatGuests,
        satisfaction: Math.round(satisfactionScore * 10) / 10,
        monthlyRevenue,
        occupancyTrend,
        customerSatisfaction
      });

    } catch (error) {
      console.error('Error calculating metrics:', error);
    } finally {
      setIsCalculating(false);
    }
  }, [generateMonthlyRevenue, generateOccupancyTrend]);

  return { metrics, updateMetrics, isCalculating };
};