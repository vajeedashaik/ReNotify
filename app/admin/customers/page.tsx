'use client';

import React, { useState, useEffect, useMemo } from 'react';
import CustomerCard from '@/components/ui/CustomerCard';
import Filters from '@/components/sections/Filters';
import { useAdminAuth } from '@/lib/contexts/AdminAuthProvider';
import { supabaseService } from '@/lib/data/supabaseService';
import { Customer } from '@/lib/types';

export default function CustomersPage() {
  const { isAuthenticated } = useAdminAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [consentFilter, setConsentFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [warrantyFilter, setWarrantyFilter] = useState('all');
  const [amcFilter, setAMCFilter] = useState('all');

  useEffect(() => {
    if (isAuthenticated) {
      fetchCustomers();
    }
  }, [isAuthenticated]);

  const fetchCustomers = async () => {
    try {
      const data = await supabaseService.getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(customers.map(c => c.city)));
    return uniqueCities.sort();
  }, [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer: Customer) => {
      // Consent filter
      if (consentFilter !== 'all') {
        if (consentFilter === 'yes' && !customer.consent_flag) return false;
        if (consentFilter === 'no' && customer.consent_flag) return false;
      }

      // City filter
      if (cityFilter !== 'all' && customer.city !== cityFilter) return false;

      // Warranty filter
      if (warrantyFilter !== 'all') {
        const hasMatchingWarranty = customer.products.some(p => {
          if (warrantyFilter === 'active') return p.warranty.status === 'active';
          if (warrantyFilter === 'expired') return p.warranty.status === 'expired';
          if (warrantyFilter === 'expiring_soon') return p.warranty.status === 'expiring_soon';
          return true;
        });
        if (!hasMatchingWarranty) return false;
      }

      // AMC filter
      if (amcFilter !== 'all') {
        const hasMatchingAMC = customer.products.some(p => {
          if (amcFilter === 'active') return p.amc.status === 'active';
          if (amcFilter === 'inactive') return p.amc.status === 'inactive';
          if (amcFilter === 'expiring_soon') return p.amc.status === 'expiring_soon';
          return true;
        });
        if (!hasMatchingAMC) return false;
      }

      return true;
    });
  }, [customers, consentFilter, cityFilter, warrantyFilter, amcFilter]);

  if (loading) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">Loading customers...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Customers</h1>
        <p className="text-gray-600">Manage and view all your customers</p>
      </div>

      <Filters
        consentFilter={consentFilter}
        cityFilter={cityFilter}
        warrantyFilter={warrantyFilter}
        amcFilter={amcFilter}
        onConsentChange={setConsentFilter}
        onCityChange={setCityFilter}
        onWarrantyChange={setWarrantyFilter}
        onAMCChange={setAMCFilter}
        cities={cities}
      />

      {filteredCustomers.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No customers found matching your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer.id}
              id={customer.id}
              mobile={customer.customer_mobile}
              consent={customer.consent_flag}
              city={customer.city}
              pincode={customer.pincode}
              productCount={customer.products.length}
            />
          ))}
        </div>
      )}
    </div>
  );
}
