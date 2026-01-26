'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronUp, Package, Calendar, Store, FileText, Tag } from 'lucide-react';
import { Product } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import ActionButton from './ActionButton';
import StatusBadge from './StatusBadge';

interface ProductCardProps {
  product: Product;
  customerId: string;
  index?: number;
}

export default function ProductCard({ product, customerId, index = 0 }: ProductCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();
  const basePath = pathname?.startsWith('/app') ? '/app/products' : '/admin/warranty-amc';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass card-hover group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-gray-900">{product.product_name}</h3>
            {/* Warranty Status Badge */}
            {product.warranty?.status && (
              <StatusBadge status={product.warranty.status} size="sm" />
            )}
            {/* AMC Status Badge */}
            {product.amc?.status && product.amc.status !== 'inactive' && (
              <StatusBadge 
                status={product.amc.status === 'active' ? 'active' : product.amc.status} 
                size="sm"
              />
            )}
          </div>
          <p className="text-sm text-gray-600">{product.brand} {product.model_number && `- ${product.model_number}`}</p>
          {/* Product Category */}
          {(product as any).product_category && (
            <p className="text-xs text-gray-500 mt-1">
              <Tag size={12} className="inline mr-1" />
              {(product as any).product_category}
            </p>
          )}
        </div>
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
 feature/scroll-down-animated-landing-page
          className="p-2 hover:bg-white/30 dark:hover:bg-slate-700/50 rounded-lg transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
 main
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={20} />
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-white/20 dark:border-slate-700/50 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {product.serial_number && (
              <div className="flex items-start space-x-2">
                <Package size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Serial Number</p>
                  <p className="text-sm font-medium text-gray-900">{product.serial_number}</p>
                </div>
              </div>
            )}
            {product.retailer_name && (
              <div className="flex items-start space-x-2">
                <Store size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Retailer</p>
                  <p className="text-sm font-medium text-gray-900">{product.retailer_name}</p>
                </div>
              </div>
            )}
            {product.invoice_id && (
              <div className="flex items-start space-x-2">
                <FileText size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Invoice ID</p>
                  <p className="text-sm font-medium text-gray-900">{product.invoice_id}</p>
                </div>
              </div>
            )}
            {product.purchase_date && (
              <div className="flex items-start space-x-2">
                <Calendar size={18} className="text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-500">Purchase Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(product.purchase_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Quick Status Overview */}
          {(product.warranty?.days_remaining !== undefined || product.amc?.days_remaining !== undefined || product.service_reminder?.days_until_due !== undefined) && (
            <div className="pt-2 border-t border-gray-100">
              <div className="flex flex-wrap gap-4 text-sm">
                {product.warranty?.days_remaining !== undefined && product.warranty.days_remaining >= 0 && (
                  <div>
                    <span className="text-gray-600">Warranty: </span>
                    <span className="font-medium text-gray-900">{product.warranty.days_remaining} days left</span>
                  </div>
                )}
                {product.amc?.days_remaining !== undefined && product.amc.days_remaining >= 0 && (
                  <div>
                    <span className="text-gray-600">AMC: </span>
                    <span className="font-medium text-gray-900">{product.amc.days_remaining} days left</span>
                  </div>
                )}
                {product.service_reminder?.days_until_due !== undefined && product.service_reminder.days_until_due >= 0 && (
                  <div>
                    <span className="text-gray-600">Next Service: </span>
                    <span className="font-medium text-gray-900">{product.service_reminder.days_until_due} days</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <div className="pt-2">
            <Link href={`${basePath}/${customerId}-${product.id}`}>
              <ActionButton fullWidth>View Warranty & AMC</ActionButton>
            </Link>
          </div>
        </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
