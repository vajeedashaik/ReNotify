'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileCheck, Wrench } from 'lucide-react';
import { shortProductName } from '@/lib/utils/calendarUtils';
import type { CalendarReminder, ReminderType } from '@/lib/types';

interface ReminderChipProps {
  reminder: CalendarReminder;
  onClick?: (reminder: CalendarReminder) => void;
}

const typeConfig: Record<ReminderType, { icon: typeof Shield; strip: string }> = {
  warranty: { icon: Shield, strip: 'bg-primary-500' },
  amc: { icon: FileCheck, strip: 'bg-accent-500' },
  service: { icon: Wrench, strip: 'bg-amber-500' },
};

const statusStrip: Record<string, string> = {
  active: 'bg-status-active',
  expiring_soon: 'bg-status-expiring',
  expired: 'bg-status-expired',
};

export default function ReminderChip({ reminder, onClick }: ReminderChipProps) {
  const { icon: Icon, strip } = typeConfig[reminder.type];
  const statusColor = statusStrip[reminder.status] ?? 'bg-gray-400';
  const short = shortProductName(reminder.product_name, 14);

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(reminder)}
      className="w-full text-left rounded-lg overflow-hidden bg-white shadow-soft border border-gray-100 hover:border-primary-300 transition-colors"
    >
      <div className={`h-1 ${statusColor}`} />
      <div className="flex items-center gap-2 px-2 py-1.5">
        <Icon size={14} className="text-gray-500 shrink-0" />
        <span className="text-xs font-medium text-gray-800 truncate flex-1">
          {short}
        </span>
      </div>
    </motion.button>
  );
}
