import React from 'react';
import { MapPin } from 'lucide-react';

interface DistanceBadgeProps {
  distance: number | null | undefined;
}

export default function DistanceBadge({ distance }: DistanceBadgeProps) {
  if (distance === null || distance === undefined) {
    return (
      <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
        <MapPin size={12} />
        <span>Distance unavailable</span>
      </span>
    );
  }

  const distanceRounded = Math.round(distance * 10) / 10;

  return (
    <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
      <MapPin size={12} />
      <span>{distanceRounded} km away</span>
    </span>
  );
}
