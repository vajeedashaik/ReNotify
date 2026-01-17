'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, FileCheck, Calendar, Bell } from 'lucide-react';
import StatusBadge from '@/components/ui/StatusBadge';
import TimelineBar from '@/components/ui/TimelineBar';
import ActionButton from '@/components/ui/ActionButton';
import { useCustomerAuth } from '@/lib/contexts/CustomerAuthProvider';
import { useRouter } from 'next/navigation';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { user } = useCustomerAuth();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProduct();
    }
  }, [user, params.id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch('/api/customer/products');
      if (response.ok) {
        const data = await response.json();
        const products = data.products || [];
        
        // Extract product ID from params (format: customerId-productId)
        const productId = params.id.split('-').slice(1).join('-'); // Handle UUIDs with dashes
        
        // Find the product by ID
        const foundProduct = products.find((p: any) => p.id === productId || params.id.includes(p.id));
        
        if (foundProduct) {
          // Transform product to match expected format
          const today = new Date().toISOString().split('T')[0];
          const warrantyEnd = foundProduct.warranty_end || today;
          const warrantyDays = Math.ceil((new Date(warrantyEnd).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
          
          let warrantyStatus: 'active' | 'expired' | 'expiring_soon' = 'active';
          if (warrantyDays < 0) warrantyStatus = 'expired';
          else if (warrantyDays <= 30) warrantyStatus = 'expiring_soon';

          let amcStatus: 'active' | 'inactive' | 'expiring_soon' = 'inactive';
          if (foundProduct.amc_active && foundProduct.amc_end_date) {
            const amcDays = Math.ceil((new Date(foundProduct.amc_end_date).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
            if (amcDays < 0) amcStatus = 'inactive';
            else if (amcDays <= 30) amcStatus = 'expiring_soon';
            else amcStatus = 'active';
          }

          const serviceDays = foundProduct.next_service_due ? 
            Math.ceil((new Date(foundProduct.next_service_due).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24)) : 0;

          setProduct({
            id: foundProduct.id,
            product_name: foundProduct.product_name,
            brand: foundProduct.brand,
            model_number: foundProduct.model_number,
            serial_number: foundProduct.serial_number,
            retailer_name: foundProduct.retailer_name,
            invoice_id: foundProduct.invoice_id,
            purchase_date: foundProduct.purchase_date,
            product_category: foundProduct.product_category,
            warranty: {
              warranty_type: foundProduct.warranty_type || 'Standard',
              warranty_start: foundProduct.warranty_start || foundProduct.purchase_date,
              warranty_end: warrantyEnd,
              status: warrantyStatus,
              days_remaining: warrantyDays >= 0 ? warrantyDays : undefined,
            },
            amc: {
              amc_active: foundProduct.amc_active || false,
              amc_end_date: foundProduct.amc_end_date,
              status: amcStatus,
              days_remaining: amcStatus === 'active' || amcStatus === 'expiring_soon' ? 
                (foundProduct.amc_end_date ? Math.ceil((new Date(foundProduct.amc_end_date).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24)) : undefined) : undefined,
            },
            service_reminder: {
              next_service_due: foundProduct.next_service_due || foundProduct.purchase_date,
              days_until_due: serviceDays,
            },
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">Loading product details...</p>
      </div>
    );
  }

  if (!user) {
    router.push('/app/login');
    return null;
  }

  if (!product) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">Product not found.</p>
        <Link href="/app/products" className="mt-4 text-primary-600 hover:text-primary-700">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/app/products">
        <ActionButton variant="ghost" size="sm" icon={ArrowLeft}>
          Back to Products
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
          </div>
        </div>
      </div>
    </div>
  );
}
