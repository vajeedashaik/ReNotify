'use client';

import React from 'react';
import { Filter } from 'lucide-react';

interface FiltersProps {
  consentFilter: string;
  cityFilter: string;
  warrantyFilter: string;
  amcFilter: string;
  onConsentChange: (value: string) => void;
  onCityChange: (value: string) => void;
  onWarrantyChange: (value: string) => void;
  onAMCChange: (value: string) => void;
  cities: string[];
}

export default function Filters({
  consentFilter,
  cityFilter,
  warrantyFilter,
  amcFilter,
  onConsentChange,
  onCityChange,
  onWarrantyChange,
  onAMCChange,
  cities,
}: FiltersProps) {
  return (
    <div className="card mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Filter size={20} className="text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filters</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Consent Status</label>
          <select
            value={consentFilter}
            onChange={(e) => onConsentChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <select
            value={cityFilter}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Warranty Status</label>
          <select
            value={warrantyFilter}
            onChange={(e) => onWarrantyChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="expiring_soon">Expiring Soon</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">AMC Status</label>
          <select
            value={amcFilter}
            onChange={(e) => onAMCChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expiring_soon">Expiring Soon</option>
          </select>
        </div>
      </div>
    </div>
  );
}
