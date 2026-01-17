import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  icon?: LucideIcon;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ActionButton({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  icon: Icon,
  fullWidth = false,
  size = 'md',
}: ActionButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-button transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-md hover:shadow-lg focus:ring-primary-500',
    secondary: 'bg-white text-primary-600 border-2 border-primary-500 hover:bg-primary-50 focus:ring-primary-500',
    danger: 'bg-status-expired text-white hover:bg-red-600 shadow-md hover:shadow-lg focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
  };
  
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass}`}
    >
      {Icon && <Icon size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} className="mr-2" />}
      {children}
    </button>
  );
}
