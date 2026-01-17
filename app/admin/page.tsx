'use client';

import React, { useEffect, useState } from 'react';
import KPISection from '@/components/sections/KPISection';
import QuickActions from '@/components/sections/QuickActions';
import ActivityFeed from '@/components/sections/ActivityFeed';
import { useAdminAuth } from '@/lib/contexts/AdminAuthProvider';

export default function AdminDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAdminAuth();
  const [kpis, setKpis] = useState({
    totalCustomers: 0,
    activeWarranties: 0,
    activeAMCs: 0,
    upcomingServices: 0,
  });
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchStats = React.useCallback(async () => {
    console.log('🚀 fetchStats started');
    try {
      // Fetch debug info (helps diagnose issues) - with timeout
      try {
        console.log('🔍 Fetching debug stats...');
        const debugController = new AbortController();
        const debugTimeout = setTimeout(() => debugController.abort(), 5000);
        
        const debugResponse = await fetch('/api/admin/debug-stats', {
          signal: debugController.signal,
        });
        clearTimeout(debugTimeout);
        
        if (debugResponse.ok) {
          const debugData = await debugResponse.json();
          console.log('🔍 Debug stats:', debugData);
          
          if (!debugData.hasData && debugData.datasetCount === 0) {
            console.warn('⚠️ No datasets found. Please upload a dataset first.');
          }
        } else {
          console.warn('Debug endpoint returned error:', debugResponse.status);
        }
      } catch (debugError) {
        if (debugError instanceof Error && debugError.name === 'AbortError') {
          console.warn('⏱️ Debug endpoint timeout');
        } else {
          console.warn('Debug endpoint error:', debugError);
        }
      }

      // Fetch stats - API handles authentication via cookies
      console.log('📊 Fetching stats from API...');
      const statsController = new AbortController();
      const statsTimeout = setTimeout(() => statsController.abort(), 10000);
      
      const response = await fetch('/api/admin/stats', {
        signal: statsController.signal,
        credentials: 'include', // Include cookies for authentication
      });
      clearTimeout(statsTimeout);

      console.log('📥 Stats response received, status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Stats response:', data);
        setKpis({
          totalCustomers: data.totalCustomers || 0,
          activeWarranties: data.activeWarranties || 0,
          activeAMCs: data.activeAMCs || 0,
          upcomingServices: data.upcomingServices || 0,
        });
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        console.error('❌ Failed to fetch stats:', errorData.error || 'Unknown error', errorData);
        // Keep default values (zeros)
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('⏱️ Request timeout:', error.message);
      } else {
        console.error('❌ Failed to fetch stats:', error);
      }
      // Keep default values (zeros)
    } finally {
      console.log('🏁 fetchStats completed');
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    // Wait for auth loading to complete AND user to be authenticated
    if (!authLoading && isAuthenticated && user && !hasFetched) {
      console.log('📊 Fetching dashboard stats...');
      setLoading(true);
      fetchStats();
      setHasFetched(true);
    } else if (authLoading) {
      // Reset hasFetched when auth is loading (in case user logs in again)
      setHasFetched(false);
    }
  }, [authLoading, isAuthenticated, user, hasFetched, fetchStats]);

  // Listen for dataset updates
  useEffect(() => {
    const handleDatasetUpdate = () => {
      if (isAuthenticated && user) {
        fetchStats();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('datasetUpdated', handleDatasetUpdate);
      return () => {
        window.removeEventListener('datasetUpdated', handleDatasetUpdate);
      };
    }
  }, [isAuthenticated, user, fetchStats]);

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

          {kpis.totalCustomers === 0 && (
            <div className="card bg-blue-50 border-blue-200 text-center py-8 mt-6">
              <p className="text-blue-800 font-medium mb-2">No data available yet</p>
              <p className="text-blue-600 text-sm">
                Upload a dataset to get started. Click on <strong>"Upload Dataset"</strong> in the Quick Actions above.
              </p>
            </div>
          )}

          <QuickActions />

          <ActivityFeed activities={[]} />
        </>
      )}
    </div>
  );
}
