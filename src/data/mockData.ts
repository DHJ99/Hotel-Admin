import { Customer, Booking, AnalyticsData, Notification, AdminProfile } from '../types';

const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Presidential Suite', 'Family Room'];
const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Maria', 'William', 'Jennifer', 'Richard', 'Linda', 'Thomas', 'Patricia', 'Charles', 'Elizabeth', 'Daniel', 'Barbara', 'Matthew', 'Susan', 'Anthony', 'Jessica', 'Mark', 'Karen', 'Donald', 'Nancy', 'Steven', 'Betty', 'Paul', 'Helen', 'Andrew', 'Sandra', 'Kenneth', 'Donna', 'Joshua', 'Carol', 'Kevin', 'Ruth', 'Brian', 'Sharon', 'George', 'Michelle', 'Timothy', 'Laura', 'Ronald', 'Sarah', 'Jason', 'Kimberly'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];

function generateRandomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

function generateRandomPhone(): string {
  return `+1 ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

export const mockCustomers: Customer[] = Array.from({ length: 60 }, (_, i) => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const checkIn = generateRandomDate(new Date('2024-01-01'), new Date('2024-12-31'));
  const checkOut = generateRandomDate(new Date(checkIn), new Date(new Date(checkIn).getTime() + 7 * 24 * 60 * 60 * 1000));
  
  return {
    id: `customer-${(i + 1).toString().padStart(3, '0')}`,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
    phone: generateRandomPhone(),
    checkIn,
    checkOut,
    roomType: roomTypes[Math.floor(Math.random() * roomTypes.length)],
    totalSpent: Math.floor(Math.random() * 5000) + 500,
    status: Math.random() > 0.3 ? 'checked-out' : 'active'
  };
});

export const mockBookings: Booking[] = Array.from({ length: 120 }, (_, i) => {
  const customer = mockCustomers[Math.floor(Math.random() * mockCustomers.length)];
  const checkIn = generateRandomDate(new Date('2024-01-01'), new Date('2024-12-31'));
  const checkOut = generateRandomDate(new Date(checkIn), new Date(new Date(checkIn).getTime() + 7 * 24 * 60 * 60 * 1000));
  
  return {
    id: `booking-${(i + 1).toString().padStart(3, '0')}`,
    customerId: customer.id,
    customerName: customer.name,
    roomNumber: `${Math.floor(Math.random() * 5) + 1}${Math.floor(Math.random() * 50) + 1}`.padStart(3, '0'),
    checkIn,
    checkOut,
    amount: Math.floor(Math.random() * 2000) + 200,
    status: Math.random() > 0.8 ? 'cancelled' : Math.random() > 0.5 ? 'completed' : 'confirmed'
  };
});

export const mockAnalytics: AnalyticsData = {
  monthlyRevenue: [
    { month: 'Jan', revenue: 45000 },
    { month: 'Feb', revenue: 52000 },
    { month: 'Mar', revenue: 48000 },
    { month: 'Apr', revenue: 61000 },
    { month: 'May', revenue: 55000 },
    { month: 'Jun', revenue: 67000 },
    { month: 'Jul', revenue: 73000 },
    { month: 'Aug', revenue: 69000 },
    { month: 'Sep', revenue: 58000 },
    { month: 'Oct', revenue: 62000 },
    { month: 'Nov', revenue: 71000 },
    { month: 'Dec', revenue: 78000 }
  ],
  occupancyRate: [
    { month: 'Jan', rate: 65 },
    { month: 'Feb', rate: 72 },
    { month: 'Mar', rate: 68 },
    { month: 'Apr', rate: 78 },
    { month: 'May', rate: 75 },
    { month: 'Jun', rate: 82 },
    { month: 'Jul', rate: 88 },
    { month: 'Aug', rate: 85 },
    { month: 'Sep', rate: 73 },
    { month: 'Oct', rate: 79 },
    { month: 'Nov', rate: 81 },
    { month: 'Dec', rate: 86 }
  ],
  customerSatisfaction: [
    { category: 'Service', score: 4.5 },
    { category: 'Cleanliness', score: 4.7 },
    { category: 'Amenities', score: 4.2 },
    { category: 'Location', score: 4.8 },
    { category: 'Value', score: 4.3 }
  ]
};

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'booking',
    title: 'New Booking Received',
    message: 'John Smith booked Presidential Suite for Dec 25-28',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'high'
  },
  {
    id: 'notif-2',
    type: 'checkin',
    title: 'Guest Check-in Today',
    message: 'Sarah Johnson checking in to Room 205 at 3:00 PM',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'medium'
  },
  {
    id: 'notif-3',
    type: 'cancellation',
    title: 'Booking Cancelled',
    message: 'Michael Brown cancelled reservation for Room 301',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'medium'
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'Maintenance Alert',
    message: 'Room 405 air conditioning requires maintenance',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'high'
  },
  {
    id: 'notif-5',
    type: 'revenue',
    title: 'Revenue Milestone',
    message: 'Monthly revenue target of $75K achieved!',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'low'
  },
  {
    id: 'notif-6',
    type: 'booking',
    title: 'New Booking Received',
    message: 'Emily Davis booked Deluxe Room for Jan 15-18',
    timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    priority: 'medium'
  },
  {
    id: 'notif-7',
    type: 'system',
    title: 'Low Inventory Alert',
    message: 'Towel inventory running low - restock needed',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    priority: 'medium'
  }
];

export const mockAdminProfile: AdminProfile = {
  id: '1',
  name: 'Hotel Administrator',
  email: 'admin@hotelmanager.com',
  phone: '+1 555-123-4567',
  bio: 'Experienced hotel administrator with over 10 years in hospitality management. Passionate about delivering exceptional guest experiences and optimizing hotel operations.',
  role: 'Administrator',
  joinedDate: '2020-01-15',
  profilePicture: undefined
};