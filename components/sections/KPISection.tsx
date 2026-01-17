import React from 'react';
import { Users, Shield, FileCheck, Calendar } from 'lucide-react';
import InfoCard from '../ui/InfoCard';

interface KPISectionProps {
  totalCustomers: number;
  activeWarranties: number;
  activeAMCs: number;
  upcomingServices: number;
}

export default function KPISection({
  totalCustomers,
  activeWarranties,
  activeAMCs,
  upcomingServices,
}: KPISectionProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        <InfoCard
          title="Total Customers"
          value={totalCustomers}
          icon={Users}
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
          title="Upcoming Services"
          value={upcomingServices}
          icon={Calendar}
          gradient="from-status-expiring to-orange-600"
        />
      </div>
    </div>
  );
}
