// Comprehensive validation utilities

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  return { isValid: true };
};

export const validatePassword = (password: string): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, error: 'Password must be at least 6 characters long' };
  }
  
  // Simplified password validation for demo purposes
  if (!/(?=.*[a-zA-Z])/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one letter' };
  }
  
  return { isValid: true };
};

export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  if (!phone.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length < 10) {
    return { isValid: false, error: 'Phone number must be at least 10 digits' };
  }
  
  if (digitsOnly.length > 15) {
    return { isValid: false, error: 'Phone number cannot exceed 15 digits' };
  }
  
  return { isValid: true };
};

export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name.trim()) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  
  if (name.trim().length > 100) {
    return { isValid: false, error: 'Name cannot exceed 100 characters' };
  }
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s\-']+$/.test(name.trim())) {
    return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }
  
  return { isValid: true };
};

export const validateRequired = (value: string, fieldName: string): { isValid: boolean; error?: string } => {
  if (!value || !value.trim()) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
};

export const validateDate = (date: string, fieldName: string): { isValid: boolean; error?: string } => {
  if (!date) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: `Please enter a valid ${fieldName.toLowerCase()}` };
  }
  
  return { isValid: true };
};

export const validateDateRange = (startDate: string, endDate: string): { isValid: boolean; error?: string } => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start >= end) {
    return { isValid: false, error: 'Check-out date must be after check-in date' };
  }
  
  return { isValid: true };
};

export const validateAmount = (amount: number, fieldName: string = 'Amount'): { isValid: boolean; error?: string } => {
  if (amount === undefined || amount === null) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (amount < 0) {
    return { isValid: false, error: `${fieldName} cannot be negative` };
  }
  
  if (amount > 999999.99) {
    return { isValid: false, error: `${fieldName} cannot exceed $999,999.99` };
  }
  
  return { isValid: true };
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }
  
  // Format with country code +X (XXX) XXX-XXXX
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  }
  
  // Return original if doesn't match expected patterns
  return phone;
};

export const validateCustomerForm = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};
  
  const nameValidation = validateName(data.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!;
  }
  
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!;
  }
  
  const phoneValidation = validatePhone(data.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error!;
  }
  
  const checkInValidation = validateDate(data.checkIn, 'Check-in date');
  if (!checkInValidation.isValid) {
    errors.checkIn = checkInValidation.error!;
  }
  
  const checkOutValidation = validateDate(data.checkOut, 'Check-out date');
  if (!checkOutValidation.isValid) {
    errors.checkOut = checkOutValidation.error!;
  }
  
  if (checkInValidation.isValid && checkOutValidation.isValid) {
    const dateRangeValidation = validateDateRange(data.checkIn, data.checkOut);
    if (!dateRangeValidation.isValid) {
      errors.checkOut = dateRangeValidation.error!;
    }
  }
  
  const amountValidation = validateAmount(data.totalSpent, 'Total spent');
  if (!amountValidation.isValid) {
    errors.totalSpent = amountValidation.error!;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateBookingForm = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};
  
  const nameValidation = validateName(data.customerName);
  if (!nameValidation.isValid) {
    errors.customerName = nameValidation.error!;
  }
  
  const roomValidation = validateRequired(data.roomNumber, 'Room number');
  if (!roomValidation.isValid) {
    errors.roomNumber = roomValidation.error!;
  }
  
  const checkInValidation = validateDate(data.checkIn, 'Check-in date');
  if (!checkInValidation.isValid) {
    errors.checkIn = checkInValidation.error!;
  }
  
  const checkOutValidation = validateDate(data.checkOut, 'Check-out date');
  if (!checkOutValidation.isValid) {
    errors.checkOut = checkOutValidation.error!;
  }
  
  if (checkInValidation.isValid && checkOutValidation.isValid) {
    const dateRangeValidation = validateDateRange(data.checkIn, data.checkOut);
    if (!dateRangeValidation.isValid) {
      errors.checkOut = dateRangeValidation.error!;
    }
  }
  
  const amountValidation = validateAmount(data.amount, 'Amount');
  if (!amountValidation.isValid) {
    errors.amount = amountValidation.error!;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateProfileForm = (data: any): ValidationResult => {
  const errors: Record<string, string> = {};
  
  const nameValidation = validateName(data.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.error!;
  }
  
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error!;
  }
  
  const phoneValidation = validatePhone(data.phone);
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.error!;
  }
  
  if (data.bio && data.bio.length > 500) {
    errors.bio = 'Bio cannot exceed 500 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};