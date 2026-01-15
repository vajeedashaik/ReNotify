'use client';

import React from 'react';
import { useCustomerAuth } from '@/lib/contexts/CustomerAuthProvider';
import { useDataset } from '@/lib/contexts/DatasetProvider';
import KPISection from '@/components/sections/KPISection';
import { Package, Shield, FileCheck, Calendar } from 'lucide-react';
import InfoCard from '@/components/ui/InfoCard';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';

export default function CustomerDashboard() {
  const { user } = useCustomerAuth();
  const { customers } = useDataset();

  const customer = user ? customers.find(c => c.customer_mobile === user.mobile) : null;

  if (!customer) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">No data found for your account.</p>
      </div>
    );
  }

  const totalProducts = customer.products.length;
  const activeWarranties = customer.products.filter(p => p.warranty.status === 'active').length;
  const activeAMCs = customer.products.filter(p => p.amc.status === 'active').length;
  const upcomingExpiries = customer.products.filter(p => 
    p.warranty.status === 'expiring_soon' || 
    p.amc.status === 'expiring_soon' ||
    p.service_reminder.days_until_due <= 30
  ).length;

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
            value={totalProducts}
            icon={Package}
            gradient="from-primary-500 to-primary-600"
          />
          <InfoCard
            title="Active Warranties"
            value={activeWarranties}
            icon={Shield}
            gradient="from-accent-500 to-accent-600"
          />
          <InfoCard
            title="Active AMCs"
            value={activeAMCs}
            icon={FileCheck}
            gradient="from-status-active to-green-600"
          />
          <InfoCard
            title="Upcoming Expiries"
            value={upcomingExpiries}
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
          {customer.products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} customerId={customer.id} />
          ))}
          {customer.products.length > 3 && (
            <div className="text-center pt-4">
              <Link href="/app/products">
                <span className="text-primary-600 hover:text-primary-700 font-medium cursor-pointer">
                  View {customer.products.length - 3} more products →
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
