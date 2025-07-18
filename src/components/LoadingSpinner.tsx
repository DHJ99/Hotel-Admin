import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <Loader2 className={`animate-spin ${sizeClasses[size]} text-blue-600`} />
      {text && <span className={`text-gray-600 dark:text-gray-300 ${textSizeClasses[size]}`}>{text}</span>}
    </div>
  );
};

export default LoadingSpinner;