import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Phone, MapPin } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import StatusBadge from '@/components/ui/StatusBadge';
import ActionButton from '@/components/ui/ActionButton';
import { useDataset } from '@/lib/contexts/DatasetProvider';
import { notFound } from 'next/navigation';

interface CustomerDetailPageProps {
  params: {
    id: string;
  };
}

export default function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { customers } = useDataset();
  const customer = customers.find(c => c.id === params.id);

  if (!customer) {
    notFound();
  }

  return (
    <div>
      <Link href="/admin/customers">
        <ActionButton variant="ghost" size="sm" icon={ArrowLeft}>
          Back to Customers
        </ActionButton>
      </Link>

      <div className="mt-6">
        <div className="card mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Customer Details</h1>
              <div className="flex items-center space-x-4 mt-4">
                <div className="flex items-center space-x-2">
                  <Phone size={20} className="text-gray-400" />
                  <span className="text-lg font-semibold text-gray-900">{customer.customer_mobile}</span>
                </div>
                <StatusBadge status={customer.consent_flag ? 'yes' : 'no'} />
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin size={18} />
            <span>{customer.city}, {customer.pincode}</span>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Products Owned ({customer.products.length})</h2>
          <div className="space-y-4">
            {customer.products.map((product) => (
              <ProductCard key={product.id} product={product} customerId={customer.id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
