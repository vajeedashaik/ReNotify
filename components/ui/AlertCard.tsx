'use client';

import React from 'react';
import { Phone, Calendar, Bell, BellOff } from 'lucide-react';
import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';
import ActionButton from './ActionButton';

interface AlertCardProps {
  type: 'service_due' | 'warranty_expiring' | 'amc_ending';
  customerMobile: string;
  productName: string;
  dueDate: string;
  consentFlag: boolean;
  daysUntil: number;
  onNotify?: () => void;
  onSnooze?: () => void;
}

export default function AlertCard({
  type,
  customerMobile,
  productName,
  dueDate,
  consentFlag,
  daysUntil,
  onNotify,
  onSnooze,
}: AlertCardProps) {
  const getTypeConfig = () => {
    switch (type) {
      case 'service_due':
        return {
          title: 'Service Due',
          color: 'text-primary-600',
          bgColor: 'bg-primary-50',
        };
      case 'warranty_expiring':
        return {
          title: 'Warranty Expiring',
          color: 'text-status-expiring',
          bgColor: 'bg-status-expiring/10',
        };
      case 'amc_ending':
        return {
          title: 'AMC Ending',
          color: 'text-status-expired',
          bgColor: 'bg-status-expired/10',
        };
    }
  };

  const config = getTypeConfig();
  const isUrgent = daysUntil <= 7;

  return (
    <motion.div
      className={`glass card-hover ${isUrgent ? 'border-2 border-status-expiring animate-pulse-slow' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -5 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${config.bgColor}`}>
            <Bell className={config.color} size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{productName}</h3>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Phone size={14} className="mr-1" />
              <span>{customerMobile}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={consentFlag ? 'yes' : 'no'} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar size={16} className="mr-2" />
          <span>Due: {new Date(dueDate).toLocaleDateString()}</span>
        </div>
        <span className={`text-sm font-medium ${isUrgent ? 'text-status-expiring' : 'text-gray-600'}`}>
          {daysUntil === 0 ? 'Due Today' : daysUntil === 1 ? 'Due Tomorrow' : `${daysUntil} days left`}
        </span>
      </div>

      <div className="flex space-x-2">
        <ActionButton
          variant="primary"
          size="sm"
          disabled={!consentFlag}
          onClick={onNotify}
          fullWidth
        >
          <Bell size={16} className="mr-1" />
          Notify
        </ActionButton>
        <ActionButton
          variant="secondary"
          size="sm"
          onClick={onSnooze}
          fullWidth
        >
          <BellOff size={16} className="mr-1" />
          Snooze
        </ActionButton>
      </div>
    </motion.div>
  );
}
