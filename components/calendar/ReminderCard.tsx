'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileCheck, Wrench, Phone, Bell, BellOff } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import ActionButton from '@/components/ui/ActionButton';
import { maskMobile, formatRelativeDue } from '@/lib/utils/calendarUtils';
import type { CalendarReminder, ReminderType } from '@/lib/types';

interface ReminderCardProps {
  reminder: CalendarReminder;
  onNotify?: (id: string) => void;
  onSnooze?: (id: string) => void;
  onClick?: (reminder: CalendarReminder) => void;
}

const typeConfig: Record<ReminderType, { label: string; icon: typeof Shield; color: string; bg: string }> = {
  warranty: {
    label: 'Warranty',
    icon: Shield,
    color: 'text-primary-600',
    bg: 'bg-primary-50',
  },
  amc: {
    label: 'AMC',
    icon: FileCheck,
    color: 'text-accent-600',
    bg: 'bg-accent-50',
  },
  service: {
    label: 'Service',
    icon: Wrench,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
};

const statusMap = {
  active: 'active' as const,
  expiring_soon: 'expiring_soon' as const,
  expired: 'expired' as const,
};

export default function ReminderCard({ reminder, onNotify, onSnooze, onClick }: ReminderCardProps) {
  const cfg = typeConfig[reminder.type];
  const Icon = cfg.icon;
  const relative = formatRelativeDue(reminder.days_until);
  const masked = maskMobile(reminder.customer_mobile);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={() => onClick?.(reminder)}
      className={`
        card cursor-pointer card-hover
        ${reminder.status === 'expired' ? 'border-status-expired/30' : ''}
        ${reminder.status === 'expiring_soon' ? 'border-status-expiring/30' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`p-2.5 rounded-xl ${cfg.bg} shrink-0`}>
            <Icon className={cfg.color} size={20} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {reminder.product_name}
            </p>
            <p className="text-sm text-gray-500">
              {reminder.brand}
              {reminder.model_number ? ` · ${reminder.model_number}` : ''}
            </p>
          </div>
        </div>
        <StatusBadge status={statusMap[reminder.status]} size="sm" />
      </div>

      <p className="text-sm text-gray-600 mb-3">
        <span className={
          reminder.status === 'expired' ? 'text-status-expired font-medium' :
          reminder.status === 'expiring_soon' ? 'text-status-expiring font-medium' :
          'text-gray-600'
        }>
          {relative}
        </span>
        <span className="text-gray-400 ml-1">
          · {new Date(reminder.due_date).toLocaleDateString()}
        </span>
      </p>

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Phone size={14} />
        <span>{masked}</span>
      </div>

      <div className="flex gap-2" onClick={(e) => e.stopPropagation()} role="presentation">
        <ActionButton
          variant="primary"
          size="sm"
          disabled={!reminder.consent_flag}
          onClick={() => onNotify?.(reminder.id)}
          fullWidth
        >
          <Bell size={16} className="mr-1" />
          Notify customer
        </ActionButton>
        <ActionButton
          variant="secondary"
          size="sm"
          onClick={() => onSnooze?.(reminder.id)}
          fullWidth
        >
          <BellOff size={16} className="mr-1" />
          Snooze
        </ActionButton>
      </div>
    </motion.div>
  );
}
