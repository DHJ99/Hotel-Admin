export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  totalSpent: number;
  status: 'active' | 'checked-out';
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  amount: number;
  status: 'confirmed' | 'cancelled' | 'completed';
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  bio?: string;
  joinedDate: string;
  profilePicture?: string;
}

export interface AnalyticsData {
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  occupancyRate: Array<{ month: string; rate: number }>;
  customerSatisfaction: Array<{ category: string; score: number }>;
}

export interface Notification {
  id: string;
  type: 'booking' | 'cancellation' | 'checkin' | 'system' | 'revenue';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  role: string;
  joinedDate: string;
  profilePicture?: string;
}