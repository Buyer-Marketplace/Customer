import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { IoCalendarOutline, IoTimeOutline, IoLocationOutline } from 'react-icons/io5';
import { GiFarmer } from 'react-icons/gi';

const PreOrderCard = ({ preorder, type = 'available' }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'success';
      case 'pending':
        return 'warning';
      case 'confirmed':
        return 'info';
      case 'fulfilled':
        return 'primary';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const calculateDaysLeft = (deadlineDate) => {
    const deadline = new Date(deadlineDate);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = preorder?.orderDeadline ? calculateDaysLeft(preorder.orderDeadline) : 0;

  // Handle missing data
  if (!preorder) return null;

  return (
    <div className="bg-green-900/30 backdrop-blur-sm rounded-xl overflow-hidden border border-green-400/20 hover:border-green-400/40 transition-all duration-300 card-hover group">
      <Link to={`/preorders/${preorder.id}`}>
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 transform transition-transform duration-300 group-hover:scale-110">
            <img
              src={preorder.cropImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400'}
              alt={preorder.cropName || 'Crop'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400';
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-950 via-green-950/80 to-transparent"></div>
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 z-10">
            <Badge variant={getStatusColor(preorder.status)}>
              {preorder.status || 'Unknown'}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 bg-green-950/40">
          {/* Farmer Info */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-700/30 rounded-full flex items-center justify-center">
              <GiFarmer className="text-green-400" size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {preorder.farmer?.farmName || preorder.farmer?.name || 'Unknown Farmer'}
              </p>
              {preorder.farmer?.location && (
                <div className="flex items-center gap-1 text-xs text-green-300">
                  <IoLocationOutline size={10} />
                  <span>{preorder.farmer.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Crop Name */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-white group-hover:text-green-300 transition-colors">
            {preorder.cropName || 'Unknown Crop'}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-green-300">
              {formatCurrency(preorder.price || 0)}
            </span>
            <span className="text-sm text-green-300/60">per {preorder.unit || 'kg'}</span>
          </div>

          {/* Order Info */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-300">Min Order:</span>
              <span className="text-white font-medium">{preorder.minOrder || 1} {preorder.unit || 'kg'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-300">Available:</span>
              <span className="text-white font-medium">{preorder.availableQuantity || 0} {preorder.unit || 'kg'}</span>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-1 mb-4">
            <div className="flex items-center gap-2 text-xs text-green-300">
              <IoCalendarOutline size={12} />
              <span>Harvest: {formatDate(preorder.expectedHarvestDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-green-300">
              <IoTimeOutline size={12} />
              <span>Deadline: {daysLeft > 0 ? `${daysLeft} days left` : 'Closed'}</span>
            </div>
          </div>

          {/* Action Button */}
          {type === 'available' && preorder.status === 'open' && (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Pre-Order Now
            </Button>
          )}

          {type === 'my' && (
            <div className="flex gap-2">
              <Link to={`/preorders/${preorder.id}`} className="flex-1">
                <Button variant="outline" size="sm" fullWidth className="border-2 border-green-400 text-green-300 hover:bg-green-800/30">
                  View Details
                </Button>
              </Link>
              {preorder.status === 'pending' && (
                <Button variant="danger" size="sm">
                  Cancel
                </Button>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default PreOrderCard;