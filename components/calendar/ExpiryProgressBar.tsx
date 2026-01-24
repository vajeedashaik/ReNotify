'use client';

import React from 'react';
import TimelineBar from '@/components/ui/TimelineBar';
import { todayStr } from '@/lib/utils/calendarUtils';
import type { CalendarReminder } from '@/lib/types';

interface ExpiryProgressBarProps {
  reminder: CalendarReminder;
  showLabels?: boolean;
}

export default function ExpiryProgressBar({ reminder, showLabels = true }: ExpiryProgressBarProps) {
  const start = reminder.start_date ?? reminder.due_date;
  const end = reminder.end_date;
  const today = todayStr();

  return (
    <TimelineBar
      startDate={start}
      endDate={end}
      currentDate={today}
      showLabels={showLabels}
    />
  );
}
