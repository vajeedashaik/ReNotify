import React from 'react';
import KPISection from '@/components/sections/KPISection';
import QuickActions from '@/components/sections/QuickActions';
import ActivityFeed from '@/components/sections/ActivityFeed';
import { getKPIs, mockActivities } from '@/lib/data/mockData';

export default function HomePage() {
  const kpis = getKPIs();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your customers.</p>
      </div>

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
