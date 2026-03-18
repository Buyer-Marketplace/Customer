import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import Badge from '../ui/Badge';
import { IoCalendarOutline, IoLocationOutline } from 'react-icons/io5';
import { GiFarmer } from 'react-icons/gi';

const CalendarCard = ({ harvest, date }) => {
  return (
    <div className="bg-green-900/30 backdrop-blur-sm rounded-xl overflow-hidden border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
      <div className="p-4">
        {/* Date Header */}
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-green-800">
          <IoCalendarOutline className="text-green-400" size={18} />
          <span className="text-white font-medium">
            {date.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        </div>

        {/* Harvest Items */}
        <div className="space-y-3">
          {harvest.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              {/* Crop Image */}
              <img
                src={item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=60&h=60'}
                alt={item.cropName}
                className="w-12 h-12 rounded-lg object-cover"
              />

              {/* Crop Details */}
              <div className="flex-1">
                <Link to={`/crops/${item.cropId}`} className="hover:text-green-300">
                  <h4 className="font-medium text-white">{item.cropName}</h4>
                </Link>
                
                {/* Farmer Info */}
                {item.farmerName && (
                  <div className="flex items-center gap-1 text-xs text-green-300 mt-1">
                    <GiFarmer size={10} />
                    <span>{item.farmerName}</span>
                  </div>
                )}

                {/* Location */}
                {item.region && (
                  <div className="flex items-center gap-1 text-xs text-green-300/70 mt-1">
                    <IoLocationOutline size={10} />
                    <span>{item.region}</span>
                  </div>
                )}

                {/* Quantity & Price */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-green-300">
                    {item.quantity} {item.unit || 'kg'}
                  </span>
                  {item.price && (
                    <span className="text-sm font-semibold text-green-400">
                      {formatCurrency(item.price)}/{item.unit || 'kg'}
                    </span>
                  )}
                </div>

                {/* Status Badge */}
                {item.status && (
                  <div className="mt-2">
                    <Badge size="sm" variant={item.status === 'available' ? 'success' : 'warning'}>
                      {item.status}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View Details Link */}
        <div className="mt-3 pt-2 border-t border-green-800">
          <Link 
            to={`/harvest-calendar?date=${date.toISOString().split('T')[0]}`}
            className="text-xs text-green-400 hover:text-green-300 flex items-center justify-end gap-1"
          >
            View Details
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CalendarCard;