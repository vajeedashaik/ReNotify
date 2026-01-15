'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronUp, Package, Calendar, Store, FileText } from 'lucide-react';
import { Product } from '@/lib/types';
import ActionButton from './ActionButton';

interface ProductCardProps {
  product: Product;
  customerId: string;
}

export default function ProductCard({ product, customerId }: ProductCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const basePath = pathname?.startsWith('/app') ? '/app/products' : '/admin/warranty-amc';

  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900 mb-1">{product.product_name}</h3>
          <p className="text-sm text-gray-600">{product.brand} - {product.model_number}</p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-start space-x-2">
              <Package size={18} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Serial Number</p>
                <p className="text-sm font-medium text-gray-900">{product.serial_number}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Store size={18} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Retailer</p>
                <p className="text-sm font-medium text-gray-900">{product.retailer_name}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <FileText size={18} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Invoice ID</p>
                <p className="text-sm font-medium text-gray-900">{product.invoice_id}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Calendar size={18} className="text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-500">Purchase Date</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(product.purchase_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <Link href={`${basePath}/${customerId}-${product.id}`}>
              <ActionButton fullWidth>View Warranty & AMC</ActionButton>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
