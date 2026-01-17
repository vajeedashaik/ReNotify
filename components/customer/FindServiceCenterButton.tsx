'use client';

import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import ActionButton from '@/components/ui/ActionButton';
import ServiceCenterDiscovery from './ServiceCenterDiscovery';

interface FindServiceCenterButtonProps {
  productId: string;
  pincode?: string;
  city?: string;
  brand?: string;
  productCategory?: string;
  warrantyActive?: boolean;
  amcActive?: boolean;
  latitude?: number;
  longitude?: number;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export default function FindServiceCenterButton({
  productId,
  pincode,
  city,
  brand,
  productCategory,
  warrantyActive = false,
  amcActive = false,
  latitude,
  longitude,
  variant = 'primary',
  fullWidth = false,
}: FindServiceCenterButtonProps) {
  const [showDiscovery, setShowDiscovery] = useState(false);

  return (
    <>
      <ActionButton
        variant={variant}
        icon={MapPin}
        fullWidth={fullWidth}
        onClick={() => setShowDiscovery(true)}
      >
        Find Nearby Service Centers
      </ActionButton>

      {showDiscovery && (
        <ServiceCenterDiscovery
          productId={productId}
          pincode={pincode}
          city={city}
          brand={brand}
          productCategory={productCategory}
          warrantyActive={warrantyActive}
          amcActive={amcActive}
          latitude={latitude}
          longitude={longitude}
          onClose={() => setShowDiscovery(false)}
        />
      )}
    </>
  );
}
