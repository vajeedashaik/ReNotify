'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Bell, AlertCircle } from 'lucide-react';
import AlertCard from '@/components/ui/AlertCard';
import { Alert } from '@/lib/types';

export default function AlertsPage() {
  const [snoozedAlerts, setSnoozedAlerts] = useState<Set<string>>(new Set());
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/admin/alerts');
      if (response.ok) {
        const data = await response.json();
        setAlerts(data.alerts || []);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotify = (alertId: string) => {
    // TODO: Implement notification logic
    console.log('Notify customer for alert:', alertId);
    alert('Notification sent to customer!');
  };

  const handleSnooze = (alertId: string) => {
    setSnoozedAlerts(new Set([...snoozedAlerts, alertId]));
  };

  const activeAlerts = useMemo(() => {
    return alerts.filter(alert => !snoozedAlerts.has(alert.id));
  }, [alerts, snoozedAlerts]);

  const groupedAlerts = useMemo(() => {
    const groups: Record<string, Alert[]> = {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Alerts & Reminders</h1>
        <p className="text-gray-600">Manage service reminders, warranty expirations, and AMC renewals</p>
      </div>

      {loading ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Loading alerts...</p>
        </div>
      ) : activeAlerts.length === 0 ? (
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
                <div className="flex items-center space-x-2 mb-4">
                  <AlertCircle className="text-status-expiring" size={24} />
                  <h2 className="text-xl font-semibold text-gray-900">{getSectionTitle(type)}</h2>
                  <span className="px-2 py-1 bg-status-expiring/10 text-status-expiring rounded-full text-sm font-medium">
                    {alerts.length}
                  </span>
                </div>
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
