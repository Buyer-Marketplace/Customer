import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiStar, FiClock } from 'react-icons/fi';
import { GiFarmer } from 'react-icons/gi';
import { IoLeaf, IoCalendarOutline } from 'react-icons/io5';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const MarketplaceCard = ({ item, onAddToCart, onBuyNow }) => {
  const isStockAvailable = item.listing_status === 'Active' && item.available_quantity_kg > 0;
  const harvestDate = new Date(item.expected_harvest_date);
  const today = new Date();
  
  // Normalize dates to remove time for accurate comparison
  const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const harvestNormalized = new Date(harvestDate.getFullYear(), harvestDate.getMonth(), harvestDate.getDate());
  
  const isHarvested = harvestNormalized <= todayNormalized;
  const isAvailableNow = isStockAvailable && isHarvested;
  const isPreOrder = isStockAvailable && !isHarvested;
  
  const daysToHarvest = Math.ceil((harvestDate - today) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-gradient-to-b from-green-900/40 to-green-950/40 backdrop-blur-sm rounded-xl overflow-hidden border border-green-400/20 hover:border-green-400/40 transition-all duration-300 group h-full flex flex-col">
      {/* Image Section */}
      <Link to={`/listing/${item.id}`} className="relative h-48 overflow-hidden">
        <img 
          src={item.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400'} 
          alt={item.crop_name}
          className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-transparent to-transparent"></div>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {item.is_organic && (
            <Badge variant="success" size="sm" className="bg-green-600/90 backdrop-blur-sm">
              <IoLeaf className="inline mr-1" size={12} />
              Organic
            </Badge>
          )}
          {isPreOrder && (
            <Badge variant="info" size="sm" className="bg-blue-600/90 backdrop-blur-sm">
              <IoCalendarOutline className="inline mr-1" size={12} />
              Pre-order
            </Badge>
          )}
          {daysToHarvest <= 7 && daysToHarvest > 0 && (
            <Badge variant="warning" size="sm" className="bg-yellow-600/90 backdrop-blur-sm">
              <FiClock className="inline mr-1" size={12} />
              {daysToHarvest} days left
            </Badge>
          )}
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Farmer Info */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-green-700/30 rounded-full flex items-center justify-center">
            <GiFarmer className="text-green-400" size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{item.farmer_name}</p>
            <div className="flex items-center gap-1 text-xs text-green-300">
              <FiMapPin size={10} />
              <span className="truncate">{item.region_name}</span>
            </div>
          </div>
          {item.farmer_rating && (
            <div className="flex items-center gap-1 text-yellow-400 text-xs">
              <FiStar size={12} />
              <span>{item.farmer_rating}</span>
            </div>
          )}
        </div>

        {/* Crop Info */}
        <Link to={`/listing/${item.id}`} className="block mb-2">
          <h3 className="text-lg font-semibold text-white group-hover:text-green-300 transition-colors line-clamp-1">
            {item.crop_name}
          </h3>
        </Link>

        {/* Price & Quantity */}
        <div className="flex items-end justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-green-400">
              {formatCurrency(item.price_per_kg)}
            </span>
            <span className="text-sm text-green-300/60 ml-1">/kg</span>
          </div>
          <div className="text-right">
            <span className="text-sm text-green-300">{item.available_quantity_kg} kg</span>
            <p className="text-xs text-green-300/50">
              {isPreOrder ? 'est. yield' : 'available'}
            </p>
          </div>
        </div>

        {/* Harvest Date */}
        <div className={`rounded-lg p-2 mb-3 ${isPreOrder ? 'bg-blue-900/30 border border-blue-400/20' : 'bg-green-950/50'}`}>
          <p className={`text-xs ${isPreOrder ? 'text-blue-300' : 'text-green-300'}`}>
            <FiClock className="inline mr-1" />
            {isPreOrder ? 'Expected Harvest:' : 'Harvested on:'} {formatDate(item.expected_harvest_date)}
          </p>
        </div>

        {/* Status Badge */}
        <div className="mb-3">
          <Badge 
            variant={isAvailableNow ? 'success' : isPreOrder ? 'info' : 'default'} 
            size="sm"
            className={isAvailableNow ? 'bg-green-600/80' : isPreOrder ? 'bg-blue-600/80' : 'bg-gray-600/80'}
          >
            {isAvailableNow ? 'Available Now' : isPreOrder ? 'Booking Open' : 'Sold Out'}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddToCart(item)}
            className={`flex-1 border-2 transition-all ${
              isPreOrder 
                ? 'border-blue-400 text-blue-300 hover:bg-blue-800/30 hover:text-white' 
                : 'border-green-400 text-green-300 hover:bg-green-800/30 hover:text-white'
            }`}
            disabled={!isStockAvailable}
          >
            {isPreOrder ? 'Book Order' : 'Add to Cart'}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onBuyNow(item)}
            className={`flex-1 transition-all ${
              isPreOrder ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
            } text-white`}
            disabled={!isStockAvailable}
          >
            {isPreOrder ? 'Book Now' : 'Buy Now'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceCard;