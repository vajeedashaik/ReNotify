'use client';

import React from 'react';
import { Phone, MapPin, Star, Clock } from 'lucide-react';
import { ServiceCenter } from '@/lib/types';
import DistanceBadge from './DistanceBadge';
import TrustBadge from './TrustBadge';
import ActionButton from './ActionButton';

interface ServiceCenterCardProps {
  serviceCenter: ServiceCenter;
  isRecommended?: boolean;
  recommendationReason?: string;
}

export default function ServiceCenterCard({ 
  serviceCenter, 
  isRecommended = false,
  recommendationReason 
}: ServiceCenterCardProps) {
  const handleCall = () => {
    if (serviceCenter.contact_number) {
      window.location.href = `tel:${serviceCenter.contact_number}`;
    }
  };

  // Determine trust badges to show
  const trustBadges: Array<'AUTHORIZED' | 'PARTNER' | 'VERIFIED' | 'WARRANTY' | 'AMC'> = [];
  
  if (serviceCenter.service_center_type === 'AUTHORIZED') {
    trustBadges.push('AUTHORIZED');
  } else if (serviceCenter.parent_partner) {
    trustBadges.push('PARTNER');
  }
  
  if (serviceCenter.last_verified_at) {
    const verifiedDate = new Date(serviceCenter.last_verified_at);
    const now = new Date();
    const daysSinceVerification = (now.getTime() - verifiedDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceVerification <= 90) {
      trustBadges.push('VERIFIED');
    }
  }
  
  if (serviceCenter.warranty_supported) {
    trustBadges.push('WARRANTY');
  }
  
  if (serviceCenter.amc_supported) {
    trustBadges.push('AMC');
  }

  return (
    <div className={`card ${isRecommended ? 'border-2 border-primary-500 bg-primary-50/30' : ''}`}>
      {isRecommended && (
        <div className="mb-3 p-2 bg-primary-100 rounded-lg">
          <p className="text-sm font-medium text-primary-900">
            ⭐ Recommended
          </p>
          {recommendationReason && (
            <p className="text-xs text-primary-700 mt-1">{recommendationReason}</p>
          )}
        </div>
      )}
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {serviceCenter.service_center_name}
          </h3>
          {serviceCenter.service_center_type && (
            <p className="text-sm text-gray-600">{serviceCenter.service_center_type}</p>
          )}
        </div>
        {serviceCenter.rating && (
          <div className="flex items-center space-x-1">
            <Star className="text-yellow-400 fill-yellow-400" size={16} />
            <span className="text-sm font-medium text-gray-900">{serviceCenter.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex flex-wrap gap-2">
          {serviceCenter.distance_km !== undefined && serviceCenter.distance_km !== null && (
            <DistanceBadge distance={serviceCenter.distance_km} />
          )}
          {trustBadges.map((badgeType, idx) => (
            <TrustBadge key={idx} type={badgeType} />
          ))}
        </div>

        {serviceCenter.address && (
          <div className="flex items-start space-x-2 text-sm text-gray-600">
            <MapPin className="flex-shrink-0 mt-0.5" size={16} />
            <div>
              <p>{serviceCenter.address}</p>
              {(serviceCenter.city || serviceCenter.pincode) && (
                <p className="text-xs text-gray-500 mt-1">
                  {serviceCenter.city}{serviceCenter.city && serviceCenter.pincode ? ', ' : ''}
                  {serviceCenter.pincode}
                </p>
              )}
            </div>
          </div>
        )}

        {serviceCenter.opening_hours && (
          <div className="flex items-start space-x-2 text-sm text-gray-600">
            <Clock className="flex-shrink-0 mt-0.5" size={16} />
            <span>{serviceCenter.opening_hours}</span>
          </div>
        )}

        {serviceCenter.supported_brands && serviceCenter.supported_brands.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-1">Supported Brands:</p>
            <div className="flex flex-wrap gap-1">
              {serviceCenter.supported_brands.slice(0, 5).map((brand, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded"
                >
                  {brand}
                </span>
              ))}
              {serviceCenter.supported_brands.length > 5 && (
                <span className="px-2 py-1 text-xs font-medium text-gray-500">
                  +{serviceCenter.supported_brands.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-2 pt-4 border-t border-gray-100">
        {serviceCenter.contact_number && (
          <ActionButton
            variant="secondary"
            icon={Phone}
            onClick={handleCall}
            fullWidth
          >
            Call
          </ActionButton>
        )}
      </div>
    </div>
  );
}
