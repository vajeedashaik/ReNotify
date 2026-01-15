import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Package } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface CustomerCardProps {
  id: string;
  mobile: string;
  consent: boolean;
  city: string;
  pincode: string;
  productCount: number;
}

export default function CustomerCard({ id, mobile, consent, city, pincode, productCount }: CustomerCardProps) {
  return (
    <Link href={`/customers/${id}`}>
      <div className="card card-hover cursor-pointer">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Phone className="text-primary-600" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{mobile}</h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin size={14} className="mr-1" />
                <span>{city} - {pincode}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={consent ? 'yes' : 'no'} />
        </div>
        
        <div className="flex items-center text-sm text-gray-600 pt-4 border-t border-gray-100">
          <Package size={16} className="mr-2" />
          <span>{productCount} {productCount === 1 ? 'Product' : 'Products'}</span>
        </div>
      </div>
    </Link>
  );
}
