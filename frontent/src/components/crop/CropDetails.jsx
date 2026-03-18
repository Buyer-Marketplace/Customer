import React from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { calculateStockStatus, getStockColor, getStockText } from '../../utils/calculateStock';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { IoHeart, IoHeartOutline, IoCartOutline, IoLeaf, IoTimeOutline } from 'react-icons/io5';
import { GiFarmer } from 'react-icons/gi';
import { FiMapPin, FiStar } from 'react-icons/fi';

const CropDetails = ({ crop }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const stockStatus = calculateStockStatus(crop.availableQuantity, crop.totalQuantity || crop.availableQuantity);
  const inWishlist = isInWishlist(crop.id);

  const handleAddToCart = () => {
    addToCart(crop, 1);
  };

  const handleWishlistClick = () => {
    if (inWishlist) {
      removeFromWishlist(crop.id);
    } else {
      addToWishlist(crop);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{crop.name}</h1>
        <div className="flex items-center gap-2">
          <Badge variant={crop.isOrganic ? 'success' : 'default'}>
            {crop.isOrganic ? 'Organic' : 'Conventional'}
          </Badge>
          {crop.isPreorder && (
            <Badge variant="warning">Pre-Order</Badge>
          )}
        </div>
      </div>

      {/* Farmer Info */}
      <div className="bg-green-950/50 rounded-xl p-4 border border-green-400/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-green-700/30 rounded-full flex items-center justify-center">
            <GiFarmer className="text-green-400" size={24} />
          </div>
          <div>
            <p className="text-white font-semibold">{crop.farmer?.farmName || crop.farmer?.name}</p>
            <div className="flex items-center gap-2 text-sm text-green-300">
              {crop.farmer?.location && (
                <span className="flex items-center gap-1">
                  <FiMapPin size={12} />
                  {crop.farmer.location}
                </span>
              )}
              {crop.farmer?.rating && (
                <span className="flex items-center gap-1">
                  <FiStar className="text-yellow-400 fill-yellow-400" size={12} />
                  {crop.farmer.rating}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold text-green-400">
          {formatCurrency(crop.price)}
        </span>
        {crop.unit && (
          <span className="text-green-300/70">per {crop.unit}</span>
        )}
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStockColor(stockStatus)}`}>
          {getStockText(stockStatus)}
        </span>
        <span className="text-sm text-green-300/70">
          {crop.availableQuantity} {crop.unit} available
        </span>
      </div>

      {/* Harvest Date */}
      {crop.harvestDate && (
        <div className="flex items-center gap-2 text-sm text-green-300">
          <IoTimeOutline size={16} />
          <span>Harvest: {new Date(crop.harvestDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>
      )}

      {/* Description */}
      <div className="prose prose-invert">
        <p className="text-green-200 leading-relaxed">{crop.description}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          variant="primary"
          size="lg"
          onClick={handleAddToCart}
          disabled={stockStatus === 'out-of-stock'}
          className="bg-green-600 hover:bg-green-700 text-white flex-1"
        >
          <IoCartOutline className="mr-2" size={20} />
          {stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
        </Button>
        
        <button
          onClick={handleWishlistClick}
          className="p-3 bg-green-950/50 border border-green-400/30 rounded-xl hover:bg-green-900/50 transition-colors"
        >
          {inWishlist ? (
            <IoHeart className="text-red-400" size={24} />
          ) : (
            <IoHeartOutline className="text-green-300" size={24} />
          )}
        </button>
      </div>

      {/* Nutrition Info */}
      {crop.nutritionInfo && (
        <div className="mt-6 pt-6 border-t border-green-800">
          <h3 className="text-lg font-semibold text-white mb-3">Nutrition Information</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(crop.nutritionInfo).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-2xl font-bold text-green-400">{value}</div>
                <div className="text-xs text-green-300 capitalize">{key}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CropDetails;