'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon } from 'lucide-react';
import ReminderCard from './ReminderCard';
import { filterRemindersByMonth, groupRemindersByDate, todayStr } from '@/lib/utils/calendarUtils';
import type { CalendarReminder } from '@/lib/types';

interface TimelineCalendarViewProps {
  reminders: CalendarReminder[];
  year: number;
  month: number;
  onNotify?: (id: string) => void;
  onSnooze?: (id: string) => void;
  onReminderClick?: (r: CalendarReminder) => void;
}

const weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function TimelineCalendarView({
  reminders,
  year,
  month,
  onNotify,
  onSnooze,
  onReminderClick,
}: TimelineCalendarViewProps) {
  const filtered = filterRemindersByMonth(reminders, year, month);
  const byDate = groupRemindersByDate(filtered);
  const dates = Object.keys(byDate).sort();
  const today = todayStr();

  if (dates.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card text-center py-16"
      >
        <CalendarIcon size={56} className="mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium text-gray-600">No upcoming expiries</p>
        <p className="text-sm text-gray-500 mt-1">No reminders this month 🎉</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mobile: vertical timeline */}
      <div className="lg:hidden space-y-6">
        {dates.map((d) => {
          const items = byDate[d];
          const isToday = d === today;
          const dt = new Date(d);
          const dayName = weekday[dt.getDay()];

          return (
            <motion.section
              key={d}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div
                className={`
                  sticky top-20 z-10 flex items-center gap-2 mb-3 px-1 py-1.5 rounded-lg
                  ${isToday ? 'bg-primary-100 ring-2 ring-primary-400' : 'bg-gray-100'}
                `}
              >
                <span className="text-sm font-bold text-gray-800">
                  {dayName}, {dt.getDate()} {dt.toLocaleDateString('en', { month: 'short' })}
                </span>
                {isToday && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-500 text-white">
                    Today
                  </span>
                )}
              </div>
              <div className="space-y-3 pl-2 border-l-2 border-gray-200 border-dashed">
                {items.map((r) => (
                  <ReminderCard
                    key={r.id}
                    reminder={r}
                    onNotify={onNotify}
                    onSnooze={onSnooze}
                    onClick={onReminderClick}
                  />
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>

      {/* Desktop: horizontal timeline */}
      <div className="hidden lg:block overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-6 min-w-max">
          {dates.map((d) => {
            const items = byDate[d];
            const isToday = d === today;
            const dt = new Date(d);
            const dayName = weekday[dt.getDay()];

            return (
              <motion.section
                key={d}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-shrink-0 w-[320px]"
              >
                <div
                  className={`
                    flex items-center gap-2 mb-3 px-3 py-2 rounded-lg
                    ${isToday ? 'bg-primary-100 ring-2 ring-primary-400' : 'bg-gray-100'}
                  `}
                >
                  <span className="text-sm font-bold text-gray-800">
                    {dayName}, {dt.getDate()} {dt.toLocaleDateString('en', { month: 'short' })}
                  </span>
                  {isToday && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-500 text-white">
                      Today
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {items.map((r) => (
                      <ReminderCard
                        key={r.id}
                        reminder={r}
                        onNotify={onNotify}
                        onSnooze={onSnooze}
                        onClick={onReminderClick}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
