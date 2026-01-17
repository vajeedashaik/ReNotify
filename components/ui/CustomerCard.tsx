'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Package } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <Link href={`/admin/customers/${id}`}>
      <motion.div
        className="card card-hover cursor-pointer"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <Phone className="text-primary-600 dark:text-primary-400" size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{mobile}</h3>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                <MapPin size={14} className="mr-1" />
                <span>{city} - {pincode}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={consent ? 'yes' : 'no'} />
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-slate-700">
          <Package size={16} className="mr-2" />
          <span>{productCount} {productCount === 1 ? 'Product' : 'Products'}</span>
        </div>
      </motion.div>
    </Link>
  );
}
