'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Shield,
  FileCheck,
  Wrench,
  Phone,
  MapPin,
  Bell,
  Calendar,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import ActionButton from '@/components/ui/ActionButton';
import ExpiryProgressBar from './ExpiryProgressBar';
import { maskMobile, formatRelativeDue } from '@/lib/utils/calendarUtils';
import type { CalendarReminder, ReminderType } from '@/lib/types';

interface ReminderDetailModalProps {
  reminder: CalendarReminder | null;
  onClose: () => void;
  onNotify?: (id: string) => void;
  onSnooze?: (id: string) => void;
  onReschedule?: (id: string) => void;
  onMarkResolved?: (id: string) => void;
  onExtend?: (id: string) => void;
}

const typeConfig: Record<ReminderType, { label: string; icon: typeof Shield; color: string; bg: string }> = {
  warranty: { label: 'Warranty', icon: Shield, color: 'text-primary-600', bg: 'bg-primary-50' },
  amc: { label: 'AMC', icon: FileCheck, color: 'text-accent-600', bg: 'bg-accent-50' },
  service: { label: 'Service', icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50' },
};

const statusMap = {
  active: 'active' as const,
  expiring_soon: 'expiring_soon' as const,
  expired: 'expired' as const,
};

export default function ReminderDetailModal({
  reminder,
  onClose,
  onNotify,
  onSnooze,
  onReschedule,
  onMarkResolved,
  onExtend,
}: ReminderDetailModalProps) {
  useEffect(() => {
    if (!reminder) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [reminder, onClose]);

  return (
    <AnimatePresence>
      {reminder && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto rounded-t-2xl bg-white shadow-2xl border-t border-gray-200"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Reminder details</h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 space-y-6 pb-8">
              {(() => {
                const cfg = typeConfig[reminder.type];
                const Icon = cfg.icon;
                return (
                  <>
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${cfg.bg}`}>
                        <Icon className={cfg.color} size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{reminder.product_name}</p>
                        <p className="text-sm text-gray-500">
                          {reminder.brand}
                          {reminder.model_number ? ` · ${reminder.model_number}` : ''}
                        </p>
                        <StatusBadge status={statusMap[reminder.status]} size="sm" />
                      </div>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Product</p>
                      <p className="text-sm text-gray-600">
                        {reminder.retailer_name && <span>Retailer: {reminder.retailer_name}</span>}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">Customer</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone size={16} />
                        {maskMobile(reminder.customer_mobile)}
                      </div>
                      {(reminder.city || reminder.pincode) && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin size={16} />
                          {[reminder.city, reminder.pincode].filter(Boolean).join(', ')}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <StatusBadge status={reminder.consent_flag ? 'yes' : 'no'} size="sm" />
                        <span className="text-xs text-gray-500">Consent</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Reminder type & due date</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Calendar size={16} />
                        {formatRelativeDue(reminder.days_until)} · {new Date(reminder.due_date).toLocaleDateString()}
                      </div>
                      <ExpiryProgressBar reminder={reminder} showLabels />
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Notification history</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={16} />
                        No notifications sent yet
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <ActionButton
                        variant="primary"
                        size="md"
                        disabled={!reminder.consent_flag}
                        onClick={() => onNotify?.(reminder.id)}
                      >
                        <Bell size={18} className="mr-1" />
                        Send notification
                      </ActionButton>
                      <ActionButton variant="secondary" size="md" onClick={() => onSnooze?.(reminder.id)}>
                        Snooze
                      </ActionButton>
                      <ActionButton variant="ghost" size="md" onClick={() => onReschedule?.(reminder.id)}>
                        Reschedule
                      </ActionButton>
                      <ActionButton variant="ghost" size="md" onClick={() => onMarkResolved?.(reminder.id)}>
                        <CheckCircle2 size={18} className="mr-1" />
                        Mark resolved
                      </ActionButton>
                      {(reminder.type === 'warranty' || reminder.type === 'amc') && (
                        <div className="sm:col-span-2">
                          <ActionButton
                            variant="ghost"
                            size="md"
                            onClick={() => onExtend?.(reminder.id)}
                          >
                            Extend {reminder.type === 'warranty' ? 'warranty' : 'AMC'}
                          </ActionButton>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
