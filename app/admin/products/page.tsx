'use client';

import React, { useState, useMemo } from 'react';
import { Package, Search } from 'lucide-react';
import { useDataset } from '@/lib/contexts/DatasetProvider';
import { datasetStore } from '@/lib/data/datasetStore';
import StatusBadge from '@/components/ui/StatusBadge';
import Link from 'next/link';

export default function ProductsPage() {
  const { isInitialized } = useDataset();
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [warrantyFilter, setWarrantyFilter] = useState('all');

  const allProducts = isInitialized && datasetStore.isInitialized()
    ? datasetStore.getAllProducts()
    : [];

  const brands = useMemo(() => {
    const uniqueBrands = Array.from(new Set(allProducts.map(p => p.brand)));
    return uniqueBrands.sort();
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !product.product_name.toLowerCase().includes(query) &&
          !product.brand.toLowerCase().includes(query) &&
          !product.model_number.toLowerCase().includes(query) &&
          !product.serial_number.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Brand filter
      if (brandFilter !== 'all' && product.brand !== brandFilter) {
        return false;
      }

      // Warranty filter
      if (warrantyFilter !== 'all' && product.warranty.status !== warrantyFilter) {
        return false;
      }

      return true;
    });
  }, [allProducts, searchQuery, brandFilter, warrantyFilter]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
        <p className="text-gray-600">View and manage all products across customers</p>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Warranty Status</label>
            <select
              value={warrantyFilter}
              onChange={(e) => setWarrantyFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="expiring_soon">Expiring Soon</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="card text-center py-12">
          <Package size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Link key={product.id} href={`/admin/warranty-amc/${product.customer_id}-${product.id}`}>
              <div className="card card-hover cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{product.product_name}</h3>
                    <p className="text-sm text-gray-600">{product.brand} - {product.model_number}</p>
                  </div>
                  <StatusBadge status={product.warranty.status} />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-600">
                    <span className="font-medium">Serial:</span> {product.serial_number}
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">Customer:</span> {product.customer_mobile}
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <StatusBadge status={product.amc.status} size="sm" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
