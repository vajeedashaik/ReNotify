import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface TrustBadgeProps {
  type: 'AUTHORIZED' | 'PARTNER' | 'VERIFIED' | 'WARRANTY' | 'AMC';
}

export default function TrustBadge({ type }: TrustBadgeProps) {
  const badgeConfig = {
    AUTHORIZED: {
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
      label: 'Authorized',
    },
    PARTNER: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
      label: 'Retail Partner',
    },
    VERIFIED: {
      icon: Clock,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      label: 'Recently Verified',
    },
    WARRANTY: {
      icon: CheckCircle,
      bgColor: 'bg-primary-100',
      textColor: 'text-primary-700',
      label: 'Warranty Supported',
    },
    AMC: {
      icon: CheckCircle,
      bgColor: 'bg-accent-100',
      textColor: 'text-accent-700',
      label: 'AMC Supported',
    },
  };

  const config = badgeConfig[type];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      <Icon size={12} />
      <span>{config.label}</span>
    </span>
  );
}
