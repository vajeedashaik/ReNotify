'use client';

import React, { useState } from 'react';
import { Search, FileText, Store, Calendar, Package, DollarSign } from 'lucide-react';
import { mockInvoices } from '@/lib/data/mockData';
import { Invoice } from '@/lib/types';

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const query = searchQuery.toLowerCase();
    return (
      invoice.invoice_id.toLowerCase().includes(query) ||
      invoice.customer_mobile.toLowerCase().includes(query) ||
      invoice.product_name.toLowerCase().includes(query) ||
      invoice.brand.toLowerCase().includes(query) ||
      invoice.retailer_name.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoices & Purchases</h1>
        <p className="text-gray-600">View and manage all purchase records</p>
      </div>

      {/* Search Bar */}
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by invoice ID, customer, product, brand, or retailer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Invoice Cards */}
      {filteredInvoices.length === 0 ? (
        <div className="card text-center py-12">
          <FileText size={48} className="mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg">No invoices found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map((invoice) => (
            <div
              key={invoice.id}
              className="card card-hover cursor-pointer"
              onClick={() => setSelectedInvoice(invoice)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <FileText className="text-primary-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{invoice.invoice_id}</h3>
                    <p className="text-sm text-gray-600">{invoice.product_name}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Store size={16} className="mr-2" />
                  <span>{invoice.retailer_name}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  <span>{new Date(invoice.purchase_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Package size={16} className="mr-2" />
                  <span>{invoice.brand} - {invoice.model_number}</span>
                </div>
                <div className="flex items-center font-semibold text-gray-900 pt-2 border-t border-gray-100">
                  <DollarSign size={16} className="mr-2" />
                  <span>₹{invoice.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedInvoice(null)}
        >
          <div
            className="bg-white rounded-card shadow-soft-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Invoice Details</h2>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Invoice ID</p>
                    <p className="font-medium text-gray-900">{selectedInvoice.invoice_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Purchase Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedInvoice.purchase_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Customer Mobile</p>
                    <p className="font-medium text-gray-900">{selectedInvoice.customer_mobile}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Retailer</p>
                    <p className="font-medium text-gray-900">{selectedInvoice.retailer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Product Category</p>
                    <p className="font-medium text-gray-900">{selectedInvoice.product_category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Amount</p>
                    <p className="font-medium text-gray-900">₹{selectedInvoice.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-3">Product Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Product Name</p>
                      <p className="font-medium text-gray-900">{selectedInvoice.product_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Brand</p>
                      <p className="font-medium text-gray-900">{selectedInvoice.brand}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Model Number</p>
                      <p className="font-medium text-gray-900">{selectedInvoice.model_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Serial Number</p>
                      <p className="font-medium text-gray-900">{selectedInvoice.serial_number}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
