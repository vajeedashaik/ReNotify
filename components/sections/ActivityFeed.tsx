import React from 'react';
import { Clock, Shield, FileCheck, Calendar, UserPlus, Upload } from 'lucide-react';
import { Activity } from '@/lib/types';

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'warranty_expiring':
        return Shield;
      case 'amc_ending':
        return FileCheck;
      case 'service_due':
        return Calendar;
      case 'customer_added':
        return UserPlus;
      case 'invoice_uploaded':
        return Upload;
      default:
        return Clock;
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'warranty_expiring':
        return 'text-status-expiring bg-status-expiring/10';
      case 'amc_ending':
        return 'text-status-expired bg-status-expired/10';
      case 'service_due':
        return 'text-primary-600 bg-primary-50';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Clock size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
