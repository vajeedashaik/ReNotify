'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useCustomerAuth } from '@/lib/contexts/CustomerAuthProvider';
import ProductCard from '@/components/ui/ProductCard';
import ActionButton from '@/components/ui/ActionButton';

export default function CustomerProductsPage() {
  const { user } = useCustomerAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/customer/products');
      if (response.ok) {
        const data = await response.json();
        
        // Transform products to match ProductCard format
        const today = new Date().toISOString().split('T')[0];
        const transformedProducts = (data.products || []).map((p: any) => {
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
            product_category: p.product_category,
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
        
        setProducts(transformedProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">Please log in to view your products.</p>
      </div>
    );
  }

  const customerId = user.mobile.replace(/\s+/g, '-');

  return (
    <div>
      <Link href="/app">
        <ActionButton variant="ghost" size="sm" icon={ArrowLeft}>
          Back to Dashboard
        </ActionButton>
      </Link>

      <div className="mt-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Products</h1>
        <p className="text-gray-600 mb-6">All products associated with your account</p>

        {products.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No products found for your account.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} customerId={customerId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
