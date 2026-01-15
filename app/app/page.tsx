'use client';

import React, { useEffect, useState } from 'react';
import { useCustomerAuth } from '@/lib/contexts/CustomerAuthProvider';
import KPISection from '@/components/sections/KPISection';
import { Package, Shield, FileCheck, Calendar } from 'lucide-react';
import InfoCard from '@/components/ui/InfoCard';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';

export default function CustomerDashboard() {
  const { user, isAuthenticated } = useCustomerAuth();
  const [kpis, setKpis] = useState({
    totalProducts: 0,
    activeWarranties: 0,
    activeAMCs: 0,
    upcomingExpiries: 0,
  });
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard stats
      const statsResponse = await fetch('/api/customer/dashboard');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setKpis(statsData);
      }

      // Fetch products
      const productsResponse = await fetch('/api/customer/products');
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        setProducts(productsData.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">No data found for your account.</p>
      </div>
    );
  }

  // Get customer ID from user mobile (for ProductCard)
  const customerId = user.mobile.replace(/\s+/g, '-');

  // Transform products to match ProductCard format
  const transformedProducts = products.slice(0, 3).map((p: any) => {
    const today = new Date().toISOString().split('T')[0];
    const warrantyEnd = p.warranty_end || today;
    const warrantyDays = Math.ceil((new Date(warrantyEnd).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
    
    let warrantyStatus: 'active' | 'expired' | 'expiring_soon' = 'active';
    if (warrantyDays < 0) warrantyStatus = 'expired';
    else if (warrantyDays <= 30) warrantyStatus = 'expiring_soon';

    let amcStatus: 'active' | 'inactive' | 'expiring_soon' = 'inactive';
    if (p.amc_active && p.amc_end_date) {
      const amcDays = Math.ceil((new Date(p.amc_end_date).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
      if (amcDays < 0) amcStatus = 'inactive';
      else if (amcDays <= 30) amcStatus = 'expiring_soon';
      else amcStatus = 'active';
    }

    const serviceDays = p.next_service_due ? 
      Math.ceil((new Date(p.next_service_due).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24)) : 0;

    return {
      id: p.id,
      product_name: p.product_name,
      brand: p.brand,
      model_number: p.model_number,
      serial_number: p.serial_number,
      retailer_name: p.retailer_name,
      invoice_id: p.invoice_id,
      purchase_date: p.purchase_date,
      warranty: {
        warranty_type: p.warranty_type || 'Standard',
        warranty_start: p.warranty_start || p.purchase_date,
        warranty_end: warrantyEnd,
        status: warrantyStatus,
        days_remaining: warrantyDays >= 0 ? warrantyDays : undefined,
      },
      amc: {
        amc_active: p.amc_active || false,
        amc_end_date: p.amc_end_date,
        status: amcStatus,
        days_remaining: amcStatus === 'active' || amcStatus === 'expiring_soon' ? 
          (p.amc_end_date ? Math.ceil((new Date(p.amc_end_date).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24)) : undefined) : undefined,
      },
      service_reminder: {
        next_service_due: p.next_service_due || p.purchase_date,
        days_until_due: serviceDays,
      },
    };
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
        <p className="text-gray-600">Welcome! Here's an overview of your products and warranties.</p>
      </div>

      {/* KPI Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          <InfoCard
            title="Total Products"
            value={kpis.totalProducts}
            icon={Package}
            gradient="from-primary-500 to-primary-600"
          />
          <InfoCard
            title="Active Warranties"
            value={kpis.activeWarranties}
            icon={Shield}
            gradient="from-accent-500 to-accent-600"
          />
          <InfoCard
            title="Active AMCs"
            value={kpis.activeAMCs}
            icon={FileCheck}
            gradient="from-status-active to-green-600"
          />
          <InfoCard
            title="Upcoming Expiries"
            value={kpis.upcomingExpiries}
            icon={Calendar}
            gradient="from-status-expiring to-orange-600"
          />
        </div>
      </div>

      {/* Products List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">My Products</h2>
          <Link href="/app/products">
            <span className="text-sm text-primary-600 hover:text-primary-700 font-medium cursor-pointer">
              View All →
            </span>
          </Link>
        </div>
        <div className="space-y-4">
          {transformedProducts.map((product) => (
            <ProductCard key={product.id} product={product} customerId={customerId} />
          ))}
          {products.length > 3 && (
            <div className="text-center pt-4">
              <Link href="/app/products">
                <span className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer">
                  View {products.length - 3} more products →
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
