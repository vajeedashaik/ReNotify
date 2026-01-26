'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileCheck, Wrench } from 'lucide-react';
import ReminderChip from './ReminderChip';
import {
  warrantiesThisMonth,
  amcsEndingSoon,
  servicesThisWeek,
} from '@/lib/utils/calendarUtils';
import type { CalendarReminder } from '@/lib/types';

interface SmartSummaryStripProps {
  reminders: CalendarReminder[];
  year: number;
  month: number;
  onReminderClick?: (r: CalendarReminder) => void;
}

export default function SmartSummaryStrip({
  reminders,
  year,
  month,
  onReminderClick,
}: SmartSummaryStripProps) {
  const warranties = warrantiesThisMonth(reminders, year, month);
  const amcs = amcsEndingSoon(reminders);
  const services = servicesThisWeek(reminders);

  const sections = [
    { title: 'Warranties expiring this month', items: warranties, icon: Shield, color: 'primary' },
    { title: 'AMCs ending soon', items: amcs, icon: FileCheck, color: 'accent' },
    { title: 'Services due this week', items: services, icon: Wrench, color: 'amber' },
  ] as const;

  return (
    <div className="mb-6">
      <div
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {sections.map(({ title, items, icon: Icon, color }) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0 w-[280px] sm:w-[320px] rounded-xl bg-white shadow-soft border border-gray-100 overflow-hidden"
          >
            <div
              className={`
                flex items-center gap-2 px-4 py-3 border-b border-gray-100
                ${color === 'primary' ? 'bg-primary-50' : ''}
                ${color === 'accent' ? 'bg-accent-50' : ''}
                ${color === 'amber' ? 'bg-amber-50' : ''}
              `}
            >
              <Icon
                size={18}
                className={
                  color === 'primary'
                    ? 'text-primary-600'
                    : color === 'accent'
                    ? 'text-accent-600'
                    : 'text-amber-600'
                }
              />
              <span className="font-semibold text-sm text-gray-800">{title}</span>
              <span
                className={`
                  ml-auto text-xs font-medium px-2 py-0.5 rounded-full
                  ${color === 'primary' ? 'bg-primary-100 text-primary-700' : ''}
                  ${color === 'accent' ? 'bg-accent-100 text-accent-700' : ''}
                  ${color === 'amber' ? 'bg-amber-100 text-amber-700' : ''}
                `}
              >
                {items.length}
              </span>
            </div>
            <div className="max-h-40 overflow-y-auto p-3 space-y-2">
              {items.length === 0 ? (
                <p className="text-sm text-gray-500 py-2">None</p>
              ) : (
                items.slice(0, 5).map((r) => (
                  <ReminderChip key={r.id} reminder={r} onClick={onReminderClick} />
                ))
              )}
              {items.length > 5 && (
                <p className="text-xs text-gray-500 pt-1">
                  +{items.length - 5} more
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
