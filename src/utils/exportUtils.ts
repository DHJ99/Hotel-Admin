import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Customer, Booking } from '../types';

export const exportCustomersToCSV = (customers: Customer[]) => {
  const headers = [
    'ID',
    'Name',
    'Email',
    'Phone',
    'Check-in Date',
    'Check-out Date',
    'Room Type',
    'Total Spent',
    'Status'
  ];

  const csvContent = [
    headers.join(','),
    ...customers.map(customer => [
      customer.id,
      `"${customer.name}"`,
      customer.email,
      customer.phone,
      customer.checkIn,
      customer.checkOut,
      `"${customer.roomType}"`,
      customer.totalSpent,
      customer.status
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `customers-export-${new Date().toISOString().split('T')[0]}.csv`);
};

export const exportBookingsToPDF = (bookings: Booking[]) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Hotel Booking Report', 20, 20);
  
  // Add date
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
  
  // Add summary statistics
  const totalBookings = bookings.length;
  const totalRevenue = bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.amount, 0);
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  
  doc.text(`Total Bookings: ${totalBookings}`, 20, 50);
  doc.text(`Total Revenue: $${totalRevenue.toLocaleString()}`, 20, 60);
  doc.text(`Confirmed: ${confirmedBookings} | Completed: ${completedBookings} | Cancelled: ${cancelledBookings}`, 20, 70);
  
  // Add table
  const tableData = bookings.map(booking => [
    booking.id,
    booking.customerName,
    booking.roomNumber,
    new Date(booking.checkIn).toLocaleDateString(),
    new Date(booking.checkOut).toLocaleDateString(),
    `$${booking.amount.toLocaleString()}`,
    booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
  ]);
  
  autoTable(doc, {
    head: [['Booking ID', 'Customer', 'Room', 'Check-in', 'Check-out', 'Amount', 'Status']],
    body: tableData,
    startY: 85,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] },
    alternateRowStyles: { fillColor: [245, 247, 250] }
  });
  
  doc.save(`booking-report-${new Date().toISOString().split('T')[0]}.pdf`);
};

export const exportBookingsToCSV = (bookings: Booking[]) => {
  const headers = [
    'Booking ID',
    'Customer ID',
    'Customer Name',
    'Room Number',
    'Check-in Date',
    'Check-out Date',
    'Amount',
    'Status'
  ];

  const csvContent = [
    headers.join(','),
    ...bookings.map(booking => [
      booking.id,
      booking.customerId,
      `"${booking.customerName}"`,
      booking.roomNumber,
      booking.checkIn,
      booking.checkOut,
      booking.amount,
      booking.status
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `bookings-export-${new Date().toISOString().split('T')[0]}.csv`);
};