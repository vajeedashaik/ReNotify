import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InfoCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  gradient?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function InfoCard({ title, value, icon: Icon, gradient = 'from-primary-500 to-primary-600', trend }: InfoCardProps) {
  return (
    <div className="card card-hover min-w-[200px] flex-shrink-0">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-md`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend.isPositive ? 'text-status-active' : 'text-status-expired'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
}
