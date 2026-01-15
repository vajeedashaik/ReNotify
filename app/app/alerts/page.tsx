'use client';

import React, { useState, useMemo } from 'react';
import { Bell } from 'lucide-react';
import AlertCard from '@/components/ui/AlertCard';
import { useCustomerAuth } from '@/lib/contexts/CustomerAuthProvider';
import { useDataset } from '@/lib/contexts/DatasetProvider';
import { datasetStore } from '@/lib/data/datasetStore';

export default function CustomerAlertsPage() {
  const { user } = useCustomerAuth();
  const { isInitialized } = useDataset();
  const [snoozedAlerts, setSnoozedAlerts] = useState<Set<string>>(new Set());

  const allAlerts = isInitialized && datasetStore.isInitialized()
    ? datasetStore.getAllAlerts()
    : [];

  // Filter alerts for current customer
  const customerAlerts = useMemo(() => {
    if (!user) return [];
    return allAlerts.filter(alert => alert.customer_mobile === user.mobile);
  }, [allAlerts, user]);

  const activeAlerts = useMemo(() => {
    return customerAlerts.filter(alert => !snoozedAlerts.has(alert.id));
  }, [customerAlerts, snoozedAlerts]);

  const groupedAlerts = useMemo(() => {
    const groups: Record<string, typeof activeAlerts> = {
      service_due: [],
      warranty_expiring: [],
      amc_ending: [],
    };

    activeAlerts.forEach(alert => {
      if (groups[alert.type]) {
        groups[alert.type].push(alert);
      }
    });

    return groups;
  }, [activeAlerts]);

  const handleNotify = (alertId: string) => {
    console.log('Notify customer for alert:', alertId);
    alert('Notification sent!');
  };

  const handleSnooze = (alertId: string) => {
    setSnoozedAlerts(new Set([...snoozedAlerts, alertId]));
  };

  const getSectionTitle = (type: string) => {
    switch (type) {
      case 'service_due':
        return 'Services Due Soon';
      case 'warranty_expiring':
        return 'Warranty Expiring';
      case 'amc_ending':
        return 'AMC Ending';
      default:
        return '';
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Alerts & Reminders</h1>
        <p className="text-gray-600">Service reminders, warranty expirations, and AMC renewals</p>
      </div>

      {activeAlerts.length === 0 ? (
        <div className="card text-center py-12">
          <Bell size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">No active alerts</p>
          <p className="text-gray-400 text-sm mt-2">All caught up! 🎉</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedAlerts).map(([type, alerts]) => {
            if (alerts.length === 0) return null;

            return (
              <div key={type}>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{getSectionTitle(type)}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {alerts.map((alert) => (
                    <AlertCard
                      key={alert.id}
                      type={alert.type}
                      customerMobile={alert.customer_mobile}
                      productName={alert.product_name}
                      dueDate={alert.due_date}
                      consentFlag={alert.consent_flag}
                      daysUntil={alert.days_until}
                      onNotify={() => handleNotify(alert.id)}
                      onSnooze={() => handleSnooze(alert.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
