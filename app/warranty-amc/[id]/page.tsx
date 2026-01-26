'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, FileCheck, Calendar, RefreshCw, Bell } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import TimelineBar from '@/components/ui/TimelineBar';
import ActionButton from '@/components/ui/ActionButton';
import { getProductById, getCustomerById } from '@/lib/data/mockData';
import { notFound } from 'next/navigation';

interface WarrantyAMCPageProps {
  params: {
    id: string;
  };
}

export default function WarrantyAMCPage({ params }: WarrantyAMCPageProps) {
  const [customerId, productId] = params.id.split('-');
  const product = getProductById(customerId, productId);
  const customer = getCustomerById(customerId);

  if (!product || !customer) {
    notFound();
  }

  return (
    <div>
      <Link href={`/customers/${customerId}`}>
        <ActionButton variant="ghost" size="sm" icon={ArrowLeft}>
          Back to Customer
        </ActionButton>
      </Link>

      <div className="mt-6">
        <div className="card mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.product_name}</h1>
          <p className="text-gray-600">{product.brand} - {product.model_number}</p>
        </div>

        {/* Warranty Card */}
        <div className="card mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Shield className="text-primary-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Warranty Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Warranty Type</p>
              <p className="font-medium text-gray-900">{product.warranty.warranty_type}</p>
            </div>
            
            <TimelineBar
              startDate={product.warranty.warranty_start}
              endDate={product.warranty.warranty_end}
            />
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <StatusBadge status={product.warranty.status} />
              </div>
              {product.warranty.days_remaining !== undefined && product.warranty.days_remaining >= 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Days Remaining</p>
                  <p className="text-lg font-semibold text-gray-900">{product.warranty.days_remaining} days</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AMC Card */}
        <div className="card mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-accent-50 rounded-lg">
              <FileCheck className="text-accent-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">AMC Information</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">AMC Status</p>
                <StatusBadge status={product.amc.amc_active ? 'active' : 'inactive'} />
              </div>
              {product.amc.amc_end_date && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">End Date</p>
                  <p className="font-medium text-gray-900">
                    {new Date(product.amc.amc_end_date).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            
            {product.amc.amc_active && product.amc.amc_end_date && (
              <>
                <TimelineBar
                  startDate={product.purchase_date}
                  endDate={product.amc.amc_end_date}
                />
                {product.amc.days_remaining !== undefined && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Days Remaining</p>
                    <p className="text-lg font-semibold text-gray-900">{product.amc.days_remaining} days</p>
                  </div>
                )}
              </>
            )}
            
            <div className="pt-4 border-t border-gray-100">
              <ActionButton
                variant="secondary"
                icon={RefreshCw}
                fullWidth
                onClick={() => {
                  // TODO: Implement renew AMC
                  console.log('Renew AMC');
                }}
              >
                Renew AMC
              </ActionButton>
            </div>
          </div>
        </div>

        {/* Service Reminder Card */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-status-expiring/10 rounded-lg">
              <Calendar className="text-status-expiring" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Service Reminder</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Next Service Due</p>
              <p className="font-medium text-gray-900">
                {new Date(product.service_reminder.next_service_due).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600 mb-1">Days Until Due</p>
                <p className={`text-2xl font-bold ${
                  product.service_reminder.days_until_due <= 7 
                    ? 'text-status-expiring' 
                    : 'text-gray-900'
                }`}>
                  {product.service_reminder.days_until_due}
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <ActionButton
                variant="primary"
                icon={Bell}
                fullWidth
                disabled={!customer.consent_flag}
                onClick={() => {
                  // TODO: Implement notify customer
                  console.log('Notify Customer');
                }}
              >
                {customer.consent_flag ? 'Notify Customer' : 'Consent Required'}
              </ActionButton>
              {!customer.consent_flag && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Customer consent is required to send notifications
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
