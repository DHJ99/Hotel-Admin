export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  bio?: string;
  profile_picture?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  room_type: string;
  total_spent: number;
  status: 'active' | 'checked-out';
  created_at: Date;
  updated_at: Date;
}

export interface Booking {
  id: string;
  customer_id: string;
  customer_name: string;
  room_number: string;
  check_in: string;
  check_out: string;
  amount: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  created_at: Date;
  updated_at: Date;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  confidence?: number;
  intent?: string;
  entities?: any[];
}

export interface ChatConversation {
  id: string;
  user_id: string;
  session_id: string;
  messages: ChatMessage[];
  created_at: Date;
  updated_at: Date;
}

export interface AnalyticsMetrics {
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

export interface AIConfig {
  provider: 'openai' | 'azure';
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}

export interface AuthRequest extends Request {
  user?: User;
}