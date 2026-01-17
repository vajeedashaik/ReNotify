import React from 'react';

interface TimelineBarProps {
  startDate: string;
  endDate: string;
  currentDate?: string;
  showLabels?: boolean;
}

export default function TimelineBar({ startDate, endDate, currentDate, showLabels = true }: TimelineBarProps) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = currentDate ? new Date(currentDate) : new Date();
  
  const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.ceil((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const remainingDays = totalDays - elapsedDays;
  
  const percentage = Math.max(0, Math.min(100, (elapsedDays / totalDays) * 100));
  const isExpired = current > end;
  const isExpiringSoon = remainingDays <= 30 && !isExpired;
  
  const getColor = () => {
    if (isExpired) return 'bg-status-expired';
    if (isExpiringSoon) return 'bg-status-expiring';
    return 'bg-status-active';
  };

  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex justify-between text-xs text-gray-600 mb-2">
          <span>{new Date(startDate).toLocaleDateString()}</span>
          <span>{new Date(endDate).toLocaleDateString()}</span>
        </div>
      )}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()} transition-all duration-500 ease-out`}
          style={{ width: `${isExpired ? 100 : percentage}%` }}
        />
      </div>
      {showLabels && (
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{elapsedDays} days elapsed</span>
          <span className={isExpired ? 'text-status-expired' : isExpiringSoon ? 'text-status-expiring' : 'text-status-active'}>
            {isExpired ? 'Expired' : `${remainingDays} days remaining`}
          </span>
        </div>
      )}
    </div>
  );
}
