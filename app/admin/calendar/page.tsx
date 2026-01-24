'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  LayoutList,
  LayoutGrid,
  Filter,
  ChevronLeft,
  ChevronRight,
  Bell,
  Loader2,
} from 'lucide-react';
import SmartSummaryStrip from '@/components/calendar/SmartSummaryStrip';
import TimelineCalendarView from '@/components/calendar/TimelineCalendarView';
import GridCalendarView from '@/components/calendar/GridCalendarView';
import ReminderDetailModal from '@/components/calendar/ReminderDetailModal';
import NotificationToggle from '@/components/calendar/NotificationToggle';
import type { CalendarReminder, ReminderType } from '@/lib/types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function CalendarPage() {
  const [reminders, setReminders] = useState<CalendarReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'timeline' | 'grid'>('timeline');
  const [filterOpen, setFilterOpen] = useState(false);
  const [detailReminder, setDetailReminder] = useState<CalendarReminder | null>(null);
  const [snoozed, setSnoozed] = useState<Set<string>>(new Set());

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const [notifyBefore, setNotifyBefore] = useState(true);
  const [notifyOnDay, setNotifyOnDay] = useState(true);
  const [notifyAfter, setNotifyAfter] = useState(false);
  const [filterTypes, setFilterTypes] = useState<Set<ReminderType>>(new Set(['warranty', 'amc', 'service']));

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/calendar/reminders');
      if (res.ok) {
        const data = await res.json();
        setReminders(data.reminders ?? []);
      } else {
        setReminders([]);
      }
    } catch (e) {
      console.error('Failed to fetch calendar reminders:', e);
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let list = reminders.filter((r) => !snoozed.has(r.id));
    if (filterTypes.size > 0 && filterTypes.size < 3) {
      list = list.filter((r) => filterTypes.has(r.type));
    }
    return list;
  }, [reminders, snoozed, filterTypes]);

  const toggleFilterType = (t: ReminderType) => {
    setFilterTypes((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t);
      else next.add(t);
      return next;
    });
  };

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const handleNotify = (id: string) => {
    // TODO: integrate with notification API
    alert('Notification sent to customer!');
  };

  const handleSnooze = (id: string) => {
    setSnoozed((prev) => new Set(prev).add(id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reminder Calendar</h1>
          <p className="text-gray-600 mt-1">
            Warranty, AMC & service lifecycles — no Google Calendar needed
          </p>
        </div>
      </div>

      {/* Top bar: month, view toggle, filter */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-xl bg-white shadow-soft border border-gray-100 overflow-hidden">
          <button
            type="button"
            onClick={prevMonth}
            className="p-2.5 text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="px-4 py-2 min-w-[140px] text-center font-semibold text-gray-900">
            {MONTHS[month - 1]} {year}
          </div>
          <button
            type="button"
            onClick={nextMonth}
            className="p-2.5 text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex rounded-xl overflow-hidden bg-white shadow-soft border border-gray-100">
          <button
            type="button"
            onClick={() => setView('timeline')}
            className={`
              flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors
              ${view === 'timeline' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'}
            `}
          >
            <LayoutList size={18} />
            Timeline
          </button>
          <button
            type="button"
            onClick={() => setView('grid')}
            className={`
              flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors
              ${view === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'}
            `}
          >
            <LayoutGrid size={18} />
            Grid
          </button>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setFilterOpen((o) => !o)}
            className={`
              flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
              bg-white shadow-soft border border-gray-100
              hover:bg-gray-50 transition-colors
              ${filterOpen ? 'ring-2 ring-primary-400' : ''}
            `}
            aria-label="Filter"
          >
            <Filter size={18} />
            Filter
          </button>
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                key="filter-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40"
                aria-hidden="true"
                onClick={() => setFilterOpen(false)}
              />
            )}
            {filterOpen && (
              <motion.div
                key="filter-dropdown"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl bg-white shadow-lg border border-gray-200 p-3 space-y-2"
              >
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Reminder type
                </p>
                {(['warranty', 'amc', 'service'] as const).map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filterTypes.has(t)}
                      onChange={() => toggleFilterType(t)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm capitalize">{t}</span>
                  </label>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <SmartSummaryStrip
        reminders={filtered}
        year={year}
        month={month}
        onReminderClick={setDetailReminder}
      />

      {loading ? (
        <div className="card flex flex-col items-center justify-center py-20">
          <Loader2 size={40} className="animate-spin text-primary-500 mb-4" />
          <p className="text-gray-600">Loading reminders…</p>
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-16"
        >
          <CalendarIcon size={56} className="mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium text-gray-600">No upcoming expiries</p>
          <p className="text-sm text-gray-500 mt-1">No reminders this month 🎉</p>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          {view === 'timeline' ? (
            <motion.div
              key="timeline"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TimelineCalendarView
                reminders={filtered}
                year={year}
                month={month}
                onNotify={handleNotify}
                onSnooze={handleSnooze}
                onReminderClick={setDetailReminder}
              />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <GridCalendarView
                reminders={filtered}
                year={year}
                month={month}
                onReminderClick={setDetailReminder}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Notification rules (collapsible) */}
      <details className="card group">
        <summary className="flex items-center gap-2 cursor-pointer list-none font-semibold text-gray-900">
          <Bell size={20} />
          Reminder rules
        </summary>
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          <NotificationToggle
            label="Notify X days before expiry"
            checked={notifyBefore}
            onChange={setNotifyBefore}
          />
          <NotificationToggle
            label="Notify on expiry day"
            checked={notifyOnDay}
            onChange={setNotifyOnDay}
          />
          <NotificationToggle
            label="Notify X days after expiry"
            checked={notifyAfter}
            onChange={setNotifyAfter}
          />
          <p className="text-xs text-gray-500">
            Auto-disable if consent_flag = NO
          </p>
        </div>
      </details>

      <ReminderDetailModal
        reminder={detailReminder}
        onClose={() => setDetailReminder(null)}
        onNotify={handleNotify}
        onSnooze={(id) => {
          handleSnooze(id);
          setDetailReminder(null);
        }}
        onReschedule={() => alert('Reschedule — coming soon')}
        onMarkResolved={() => alert('Mark resolved — coming soon')}
        onExtend={() => alert('Extend warranty/AMC — coming soon')}
      />
    </div>
  );
}
