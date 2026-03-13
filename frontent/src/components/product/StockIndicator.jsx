import React from 'react';
import { calculateStockStatus, getStockColor, getStockText } from '../../utils/calculateStock';

const StockIndicator = ({ available, total, showText = true, showProgress = false }) => {
  const status = calculateStockStatus(available, total);
  const percentage = (available / total) * 100;

  const getStatusColor = () => {
    switch (status) {
      case 'critical':
        return 'bg-red-500';
      case 'low':
        return 'bg-yellow-500';
      case 'in-stock':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="space-y-2">
      {showText && (
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${getStockColor(status)}`}>
            {getStockText(status)}
          </span>
          <span className="text-sm text-gray-600">
            {available} / {total} available
          </span>
        </div>
      )}

      {showProgress && (
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`${getStatusColor()} rounded-full h-2.5 transition-all duration-300`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          
          {/* Warning indicators */}
          {percentage <= 20 && (
            <div className="mt-1 text-xs text-red-600">
              ⚠️ Low stock - Order soon!
            </div>
          )}
          
          {available === 0 && (
            <div className="mt-1 text-xs text-red-600 font-semibold">
              Out of stock
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockIndicator;