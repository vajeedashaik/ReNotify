import { CalendarReminder, ReminderStatus } from '../types';

/** Mask customer mobile e.g. "91******34" or "******1234" */
export function maskMobile(mobile: string): string {
  const s = String(mobile).trim();
  if (s.length <= 4) return '****';
  return s.slice(0, 2) + '******' + s.slice(-2);
}

/** Format relative due date: "in 5 days", "expired 2 days ago", "today", "tomorrow" */
export function formatRelativeDue(daysUntil: number): string {
  if (daysUntil === 0) return 'Due today';
  if (daysUntil === 1) return 'Tomorrow';
  if (daysUntil > 0 && daysUntil <= 30) return `In ${daysUntil} days`;
  if (daysUntil > 30) return `In ${daysUntil} days`;
  if (daysUntil === -1) return 'Expired yesterday';
  return `Expired ${Math.abs(daysUntil)} days ago`;
}

/** Status from days until: active | expiring_soon | expired */
export function statusFromDays(days: number): ReminderStatus {
  if (days < 0) return 'expired';
  if (days <= 30) return 'expiring_soon';
  return 'active';
}

/** Days between two YYYY-MM-DD strings (today → due). Negative = past. */
export function daysUntil(today: string, due: string): number {
  return Math.ceil((new Date(due).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
}

/** YYYY-MM-DD for today */
export function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

/** Get reminders for a given month (inclusive range) */
export function filterRemindersByMonth(
  reminders: CalendarReminder[],
  year: number,
  month: number
): CalendarReminder[] {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0); // last day of month
  const startStr = start.toISOString().split('T')[0];
  const endStr = end.toISOString().split('T')[0];
  return reminders.filter((r) => r.due_date >= startStr && r.due_date <= endStr);
}

/** Warranties expiring this month */
export function warrantiesThisMonth(reminders: CalendarReminder[], year: number, month: number): CalendarReminder[] {
  return filterRemindersByMonth(
    reminders.filter((r) => r.type === 'warranty'),
    year,
    month
  );
}

/** AMCs ending soon (within 30 days from today) */
export function amcsEndingSoon(reminders: CalendarReminder[]): CalendarReminder[] {
  const today = todayStr();
  return reminders.filter((r) => {
    if (r.type !== 'amc') return false;
    return r.days_until >= 0 && r.days_until <= 30;
  });
}

/** Services due this week */
export function servicesThisWeek(reminders: CalendarReminder[]): CalendarReminder[] {
  const today = new Date();
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const todayStr = today.toISOString().split('T')[0];
  const weekEndStr = weekEnd.toISOString().split('T')[0];
  return reminders.filter((r) => {
    if (r.type !== 'service') return false;
    return r.due_date >= todayStr && r.due_date <= weekEndStr;
  });
}

/** Group reminders by date (YYYY-MM-DD) for grid view */
export function groupRemindersByDate(reminders: CalendarReminder[]): Record<string, CalendarReminder[]> {
  const map: Record<string, CalendarReminder[]> = {};
  for (const r of reminders) {
    if (!map[r.due_date]) map[r.due_date] = [];
    map[r.due_date].push(r);
  }
  return map;
}

/** Short product name for chips (e.g. "AC Living") */
export function shortProductName(name: string, maxLen = 12): string {
  const s = name.trim();
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen - 2) + '…';
}

export interface CalendarCell {
  date: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

/** 6×7 calendar grid (Sun–Sat) for given month */
export function getCalendarGrid(year: number, month: number): CalendarCell[][] {
  const first = new Date(year, month - 1, 1);
  const last = new Date(year, month, 0);
  const startPad = first.getDay();
  const daysInMonth = last.getDate();
  const today = todayStr();
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevLast = new Date(prevYear, prevMonth, 0).getDate();

  const flat: CalendarCell[] = [];
  for (let i = 0; i < startPad; i++) {
    const d = prevLast - startPad + 1 + i;
    const dt = new Date(prevYear, prevMonth - 1, d);
    flat.push({
      date: dt.toISOString().split('T')[0],
      day: d,
      isCurrentMonth: false,
      isToday: false,
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    flat.push({
      date: dateStr,
      day: d,
      isCurrentMonth: true,
      isToday: dateStr === today,
    });
  }
  const remaining = 42 - flat.length;
  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  for (let i = 0; i < remaining; i++) {
    const dt = new Date(nextYear, nextMonth - 1, i + 1);
    flat.push({
      date: dt.toISOString().split('T')[0],
      day: i + 1,
      isCurrentMonth: false,
      isToday: false,
    });
  }

  const weeks: CalendarCell[][] = [];
  for (let w = 0; w < 6; w++) {
    weeks.push(flat.slice(w * 7, (w + 1) * 7));
  }
  return weeks;
}
