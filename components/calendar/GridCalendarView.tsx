'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReminderChip from './ReminderChip';
import { getCalendarGrid, filterRemindersByMonth, groupRemindersByDate, todayStr } from '@/lib/utils/calendarUtils';
import type { CalendarReminder } from '@/lib/types';

interface GridCalendarViewProps {
  reminders: CalendarReminder[];
  year: number;
  month: number;
  onReminderClick?: (r: CalendarReminder) => void;
}

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function GridCalendarView({
  reminders,
  year,
  month,
  onReminderClick,
}: GridCalendarViewProps) {
  const grid = getCalendarGrid(year, month);
  const filtered = filterRemindersByMonth(reminders, year, month);
  const byDate = groupRemindersByDate(filtered);
  const today = todayStr();

  return (
    <div className="rounded-xl bg-white shadow-soft border border-gray-100 overflow-hidden">
      <div className="grid grid-cols-7 border-b border-gray-100">
        {weekdays.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-xs font-semibold text-gray-500 bg-gray-50"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {grid.flat().map((cell, idx) => {
          const remindersOnDay = byDate[cell.date] ?? [];
          const hasDots = remindersOnDay.length > 0;
          const dotCount = Math.min(remindersOnDay.length, 3);

          return (
            <motion.div
              key={cell.date + idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.01 }}
              className={`
                min-h-[100px] sm:min-h-[120px] p-2 border-b border-r border-gray-100
                ${!cell.isCurrentMonth ? 'bg-gray-50/50' : 'bg-white'}
                ${cell.isToday ? 'ring-2 ring-inset ring-primary-400' : ''}
              `}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`
                    text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full
                    ${cell.isToday ? 'bg-primary-500 text-white' : ''}
                    ${cell.isCurrentMonth && !cell.isToday ? 'text-gray-800' : 'text-gray-400'}
                  `}
                >
                  {cell.day}
                </span>
                {hasDots && (
                  <div className="flex gap-0.5">
                    {Array.from({ length: dotCount }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-primary-500"
                        title={`${remindersOnDay.length} reminder(s)`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-1 overflow-y-auto max-h-[80px] sm:max-h-[96px] scrollbar-hide">
                <AnimatePresence mode="popLayout">
                  {remindersOnDay.slice(0, 3).map((r) => (
                    <ReminderChip key={r.id} reminder={r} onClick={onReminderClick} />
                  ))}
                </AnimatePresence>
                {remindersOnDay.length > 3 && (
                  <button
                    type="button"
                    onClick={() => {
                      const first = remindersOnDay[0];
                      if (first) onReminderClick?.(first);
                    }}
                    className="text-xs text-primary-600 font-medium hover:underline"
                  >
                    +{remindersOnDay.length - 3} more
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
