'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-button transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';
  
  const variantClasses = {
    feature/scroll-down-animated-landing-page
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700 text-white hover:from-primary-600 hover:to-primary-700 dark:hover:from-primary-500 dark:hover:to-primary-600 shadow-md hover:shadow-glow focus:ring-primary-500 backdrop-blur-sm',
    secondary: 'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-primary-600 dark:text-primary-400 border-2 border-primary-500/30 dark:border-primary-600/30 hover:bg-white dark:hover:bg-slate-800 hover:border-primary-500 dark:hover:border-primary-600 focus:ring-primary-500',
    danger: 'bg-status-expired dark:bg-status-expired-dark text-white hover:bg-red-600 dark:hover:bg-red-500 shadow-md hover:shadow-lg focus:ring-red-500 backdrop-blur-sm',
    ghost: 'bg-transparent backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-800/50 focus:ring-gray-500 dark:focus:ring-slate-600',
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-md hover:shadow-glow focus:ring-primary-500',
    secondary: 'bg-white text-primary-600 border-2 border-primary-500 hover:bg-primary-50 focus:ring-primary-500',
    danger: 'bg-status-expired text-white hover:bg-red-600 shadow-md hover:shadow-lg focus:ring-red-500',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
 main
  };
  
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';

  if (disabled) {
    return (
      <button
        disabled
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass}`}
      >
        {Icon && <Icon size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} className="mr-2" />}
        {children}
      </button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} btn-hover-creative`}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {Icon && (
        <motion.div
          initial={false}
          whileHover={{ rotate: variant === 'primary' ? 5 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <Icon size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} className="mr-2" />
        </motion.div>
      )}
      {children}
    </motion.button>
  );
}
