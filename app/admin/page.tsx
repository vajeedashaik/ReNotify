'use client';

import React, { useEffect, useState } from 'react';
import KPISection from '@/components/sections/KPISection';
import QuickActions from '@/components/sections/QuickActions';
import ActivityFeed from '@/components/sections/ActivityFeed';
import { useAdminAuth } from '@/lib/contexts/AdminAuthProvider';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAdminAuth();
  const [kpis, setKpis] = useState({
    totalCustomers: 0,
    activeWarranties: 0,
    activeAMCs: 0,
    upcomingServices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchStats();
    }
  }, [isAuthenticated, user]);

  const fetchStats = async () => {
    try {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) return;

      const response = await fetch('/api/admin/stats', {
        headers: {
          'x-user-id': session.user.id,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setKpis(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your customers.</p>
      </div>

      {loading ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Loading statistics...</p>
        </div>
      ) : (
        <>
          <KPISection
            totalCustomers={kpis.totalCustomers}
            activeWarranties={kpis.activeWarranties}
            activeAMCs={kpis.activeAMCs}
            upcomingServices={kpis.upcomingServices}
          />

          <QuickActions />

          <ActivityFeed activities={[]} />
        </>
      )}
    </div>
  );
}
