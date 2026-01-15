'use client';

import React from 'react';
import KPISection from '@/components/sections/KPISection';
import QuickActions from '@/components/sections/QuickActions';
import ActivityFeed from '@/components/sections/ActivityFeed';
import { useDataset } from '@/lib/contexts/DatasetProvider';
import { datasetStore } from '@/lib/data/datasetStore';
import { mockActivities } from '@/lib/data/mockData';

export default function AdminDashboard() {
  const { customers, isInitialized } = useDataset();

  // Get KPIs from dataset store
  const kpis = isInitialized && datasetStore.isInitialized()
    ? datasetStore.getKPIs()
    : {
        totalCustomers: customers.length,
        activeWarranties: customers.reduce((acc, c) => 
          acc + c.products.filter(p => p.warranty.status === 'active').length, 0
        ),
        activeAMCs: customers.reduce((acc, c) => 
          acc + c.products.filter(p => p.amc.status === 'active').length, 0
        ),
        upcomingServices: customers.reduce((acc, c) => 
          acc + c.products.filter(p => p.service_reminder.days_until_due <= 30).length, 0
        ),
      };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your customers.</p>
      </div>

      {!isInitialized && (
        <div className="card mb-6 bg-yellow-50 border-yellow-200">
          <p className="text-yellow-800">
            <strong>No dataset loaded.</strong> Please{' '}
            <a href="/admin/upload" className="underline font-medium">
              upload a dataset
            </a>{' '}
            to view data.
          </p>
        </div>
      )}

      <KPISection
        totalCustomers={kpis.totalCustomers}
        activeWarranties={kpis.activeWarranties}
        activeAMCs={kpis.activeAMCs}
        upcomingServices={kpis.upcomingServices}
      />

      <QuickActions />

      <ActivityFeed activities={mockActivities} />
    </div>
  );
}
