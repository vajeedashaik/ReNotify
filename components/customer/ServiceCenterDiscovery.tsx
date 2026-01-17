'use client';

import React, { useState, useEffect } from 'react';
import { X, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { ServiceCenter } from '@/lib/types';
import ServiceCenterCard from '@/components/ui/ServiceCenterCard';

interface ServiceCenterDiscoveryProps {
  productId: string;
  pincode?: string;
  city?: string;
  brand?: string;
  productCategory?: string;
  warrantyActive?: boolean;
  amcActive?: boolean;
  latitude?: number;
  longitude?: number;
  onClose: () => void;
}

export default function ServiceCenterDiscovery({
  productId,
  pincode,
  city,
  brand,
  productCategory,
  warrantyActive = false,
  amcActive = false,
  latitude,
  longitude,
  onClose,
}: ServiceCenterDiscoveryProps) {
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
  const [recommendations, setRecommendations] = useState<ServiceCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchServiceCenters();
  }, [productId, pincode, city, brand, productCategory, warrantyActive, amcActive, latitude, longitude]);

  const fetchServiceCenters = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const params = new URLSearchParams({
        productId,
        ...(pincode && { pincode }),
        ...(city && { city }),
        ...(brand && { brand }),
        ...(productCategory && { productCategory }),
        warrantyActive: String(warrantyActive),
        amcActive: String(amcActive),
        ...(latitude !== undefined && { latitude: String(latitude) }),
        ...(longitude !== undefined && { longitude: String(longitude) }),
      });

      const response = await fetch(`/api/customer/service-centers?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setServiceCenters(data.serviceCenters || []);
        setRecommendations(data.recommendations || []);
        if (data.message) {
          setMessage(data.message);
        }
      } else {
        setError(data.error || 'Failed to fetch service centers');
      }
    } catch (err) {
      setError('An error occurred while fetching service centers');
      console.error('Error fetching service centers:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationReason = (center: ServiceCenter): string | undefined => {
    const reasons: string[] = [];
    
    if (brand && center.supported_brands?.some(b => b.toLowerCase().includes(brand.toLowerCase()))) {
      reasons.push(`supports ${brand}`);
    }
    
    if (productCategory && center.supported_categories?.some(c => c.toLowerCase().includes(productCategory.toLowerCase()))) {
      reasons.push(`supports ${productCategory}`);
    }
    
    if (warrantyActive && center.warranty_supported) {
      reasons.push('warranty claims');
    }
    
    if (amcActive && center.amc_supported) {
      reasons.push('AMC services');
    }

    if (reasons.length > 0) {
      return `Recommended because it ${reasons.join(' and ')}`;
    }

    return undefined;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <MapPin className="text-primary-600" size={24} />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Find Nearby Service Centers</h2>
              <p className="text-sm text-gray-600 mt-1">
                {pincode ? `Service centers near ${pincode}` : city ? `Service centers in ${city}` : 'Service centers'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="animate-spin text-primary-600 mb-4" size={32} />
              <p className="text-gray-600">Finding nearby service centers...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center space-x-3 p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
              <p className="text-red-900">{error}</p>
            </div>
          )}

          {message && !loading && !error && (
            <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
              <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
              <p className="text-yellow-900">{message}</p>
            </div>
          )}

          {!loading && !error && serviceCenters.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 text-lg mb-2">No service centers found</p>
              <p className="text-sm text-gray-500">
                Try adjusting your location or check back later
              </p>
            </div>
          )}

          {!loading && !error && serviceCenters.length > 0 && (
            <div className="space-y-6">
              {/* Recommendations */}
              {recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    ⭐ Best for Your Product
                  </h3>
                  <div className="space-y-4">
                    {recommendations.map((center) => (
                      <ServiceCenterCard
                        key={center.service_center_id}
                        serviceCenter={center}
                        isRecommended={true}
                        recommendationReason={getRecommendationReason(center)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Service Centers */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {recommendations.length > 0 ? 'All Service Centers' : 'Service Centers'}
                </h3>
                <div className="space-y-4">
                  {serviceCenters.map((center) => {
                    // Skip if already shown in recommendations
                    const isRecommended = recommendations.some(
                      rec => rec.service_center_id === center.service_center_id
                    );
                    
                    return (
                      <ServiceCenterCard
                        key={center.service_center_id}
                        serviceCenter={center}
                        isRecommended={isRecommended}
                        recommendationReason={isRecommended ? getRecommendationReason(center) : undefined}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
