import React from 'react';
import { Edit, Eye, Trash2, ChevronRight } from 'lucide-react';
import { Customer, Booking } from '../types';

interface MobileTableCardProps {
  data: Customer | Booking;
  type: 'customer' | 'booking';
  onEdit?: (item: Customer | Booking) => void;
  onView?: (item: Customer | Booking) => void;
  onDelete?: (item: Customer | Booking) => void;
}

const MobileTableCard: React.FC<MobileTableCardProps> = ({ data, type, onEdit, onView, onDelete }) => {
  const isCustomer = type === 'customer';
  const customer = data as Customer;
  const booking = data as Booking;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'checked-out':
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 mb-4 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {isCustomer ? (
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
          ) : (
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {booking.roomNumber}
              </span>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {isCustomer ? customer.name : booking.customerName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isCustomer ? customer.email : `Room ${booking.roomNumber}`}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(data.status)}`}>
          {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        {isCustomer ? (
          <>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Room Type</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{customer.roomType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Spent</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">${customer.totalSpent.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Check-in</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{new Date(customer.checkIn).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Check-out</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{new Date(customer.checkOut).toLocaleDateString()}</p>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">${booking.amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Booking ID</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.id.slice(0, 8)}...</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Check-in</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{new Date(booking.checkIn).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Check-out</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{new Date(booking.checkOut).toLocaleDateString()}</p>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(data)}
              className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {onView && (
            <button
              onClick={() => onView(data)}
              className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(data)}
              className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </div>
  );
};

export default MobileTableCard;