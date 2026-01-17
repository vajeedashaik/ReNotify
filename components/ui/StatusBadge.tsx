import React from 'react';

interface StatusBadgeProps {
  status: 'active' | 'expired' | 'expiring_soon' | 'inactive' | 'yes' | 'no';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, label, size = 'md' }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
      case 'yes':
        return {
          bg: 'bg-status-active/10',
          text: 'text-status-active',
          border: 'border-status-active/20',
          defaultLabel: status === 'yes' ? 'YES' : 'Active',
        };
      case 'expired':
      case 'inactive':
      case 'no':
        return {
          bg: 'bg-status-expired/10',
          text: 'text-status-expired',
          border: 'border-status-expired/20',
          defaultLabel: status === 'no' ? 'NO' : status === 'inactive' ? 'Inactive' : 'Expired',
        };
      case 'expiring_soon':
        return {
          bg: 'bg-status-expiring/10',
          text: 'text-status-expiring',
          border: 'border-status-expiring/20',
          defaultLabel: 'Expiring Soon',
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          border: 'border-gray-200',
          defaultLabel: 'Unknown',
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]}`}
    >
      {label || config.defaultLabel}
    </span>
  );
}
