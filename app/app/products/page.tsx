'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useCustomerAuth } from '@/lib/contexts/CustomerAuthProvider';
import { useDataset } from '@/lib/contexts/DatasetProvider';
import ProductCard from '@/components/ui/ProductCard';
import ActionButton from '@/components/ui/ActionButton';

export default function CustomerProductsPage() {
  const { user } = useCustomerAuth();
  const { customers } = useDataset();

  const customer = user ? customers.find(c => c.customer_mobile === user.mobile) : null;

  if (!customer) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">No products found for your account.</p>
      </div>
    );
  }

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

        <div className="space-y-4">
          {customer.products.map((product) => (
            <ProductCard key={product.id} product={product} customerId={customer.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
