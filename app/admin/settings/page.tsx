'use client';

import React, { useState } from 'react';
import { Bell, Shield, MapPin, Download, Upload, Save } from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';

export default function SettingsPage() {
  const [notificationDays, setNotificationDays] = useState(30);
  const [autoNotify, setAutoNotify] = useState(true);
  const [consentRequired, setConsentRequired] = useState(true);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure notification rules, consent handling, and data management</p>
      </div>

      {/* Notification Rules */}
      <div className="card mb-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-primary-50 rounded-lg">
            <Bell className="text-primary-600" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Notification Rules</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Days Before Service to Notify
            </label>
            <input
              type="number"
              value={notificationDays}
              onChange={(e) => setNotificationDays(parseInt(e.target.value))}
              min="1"
              max="90"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Send reminders this many days before service is due
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auto-Notify Customers
              </label>
              <p className="text-xs text-gray-500">
                Automatically send notifications when reminders are due
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoNotify}
                onChange={(e) => setAutoNotify(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Consent Handling */}
      <div className="card mb-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-accent-50 rounded-lg">
            <Shield className="text-accent-600" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Consent Handling</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Require Consent for Notifications
              </label>
              <p className="text-xs text-gray-500">
                Only send notifications to customers who have given consent
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={consentRequired}
                onChange={(e) => setConsentRequired(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* City / Retailer Filters */}
      <div className="card mb-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-status-active/10 rounded-lg">
            <MapPin className="text-status-active" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">City / Retailer Filters</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Cities (comma-separated)
            </label>
            <input
              type="text"
              placeholder="Mumbai, Delhi, Bangalore"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Retailers (comma-separated)
            </label>
            <input
              type="text"
              placeholder="Reliance Digital, Croma, Vijay Sales"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Data Import / Export */}
      <div className="card mb-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Download className="text-gray-600" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Data Import / Export</h2>
        </div>

        <div className="space-y-4">
          <div>
            <ActionButton
              variant="secondary"
              icon={Download}
              fullWidth
              onClick={() => {
                // TODO: Implement export
                console.log('Export data');
                alert('Data export functionality coming soon!');
              }}
            >
              Export Data (CSV)
            </ActionButton>
          </div>
          <div>
            <ActionButton
              variant="secondary"
              icon={Upload}
              fullWidth
              onClick={() => {
                // TODO: Implement import
                console.log('Import data');
                alert('Data import functionality coming soon!');
              }}
            >
              Import Data (CSV)
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <ActionButton
          variant="primary"
          icon={Save}
          onClick={() => {
            // TODO: Implement save settings
            console.log('Save settings');
            alert('Settings saved successfully!');
          }}
        >
          Save Settings
        </ActionButton>
      </div>
    </div>
  );
}
