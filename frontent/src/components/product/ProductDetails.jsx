import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { calculateStockStatus, getStockColor, getStockText } from '../../utils/calculateStock';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { IoHeart, IoHeartOutline, IoCartOutline, IoTimeOutline, IoCheckmarkCircle } from 'react-icons/io5';
import { useTheme } from '../../context/ThemeContext';

const ProductDetails = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isDark } = useTheme();

  const stockStatus = calculateStockStatus(product.availableQuantity, product.totalQuantity || product.availableQuantity);
  const inWishlist = isInWishlist(product.id);
  const isPreorder = product.isPreorder || (product.harvestDate && new Date(product.harvestDate) > new Date());

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.availableQuantity) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleWishlistClick = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20 shadow-2xl transition-colors duration-300">
      {/* Title */}
      <h1 className="text-3xl font-bold text-white mb-2">{product.name}</h1>
      
      {/* Farmer Info */}
      <p className="text-green-200 mb-4">
        by {product.farmer?.farmName || product.farmer?.name || 'Unknown Farmer'}
        {product.farmer?.location && ` • ${product.farmer.location}`}
      </p>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {product.isOrganic && (
          <Badge variant="success">Certified Organic</Badge>
        )}
        {isPreorder && (
          <Badge variant="warning">Available for Pre-Order</Badge>
        )}
        {product.category && (
          <Badge variant="secondary">{product.category.name}</Badge>
        )}
      </div>

      {/* Price */}
      <div className="mb-6">
        <span className="text-4xl font-bold text-green-300">
          {formatCurrency(product.price)}
        </span>
        {product.unit && (
          <span className="text-green-200/70 ml-2">per {product.unit}</span>
        )}
      </div>

      {/* Stock Status */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStockColor(stockStatus)}`}>
            {getStockText(stockStatus)}
          </span>
          {product.availableQuantity > 0 && (
            <span className="text-green-200">
              {product.availableQuantity} {product.unit}s available
            </span>
          )}
        </div>

        {/* Progress Bar */}
        {product.totalQuantity && (
          <div className="w-full bg-green-800/50 rounded-full h-2">
            <div
              className="bg-green-500 rounded-full h-2"
              style={{ width: `${(product.availableQuantity / product.totalQuantity) * 100}%` }}
            ></div>
          </div>
        )}
      </div>

      {/* Harvest Info */}
      {product.harvestDate && (
        <div className="mb-6 p-4 bg-green-800/30 backdrop-blur-sm rounded-xl border border-green-400/20">
          <div className="flex items-start space-x-3">
            <IoTimeOutline className="text-green-300 mt-1" size={20} />
            <div>
              <h4 className="font-semibold text-white">Harvest Information</h4>
              <p className="text-green-200">
                Expected harvest: {formatDate(product.harvestDate, 'MMMM d, yyyy')}
              </p>
              {isPreorder && (
                <p className="text-sm text-green-300 mt-1">
                  Pre-order now for harvest delivery
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-green-200 mb-2">
          Quantity
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="number"
            min="1"
            max={product.availableQuantity}
            value={quantity}
            onChange={handleQuantityChange}
            className="w-24 px-3 py-2 bg-white/10 border border-green-400/30 rounded-xl text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
          <span className="text-green-200">{product.unit}s</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleAddToCart}
          disabled={stockStatus === 'out-of-stock'}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <IoCartOutline className="mr-2" size={20} />
          {stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
        </Button>
        
        <Button
          variant={inWishlist ? 'danger' : 'outline'}
          size="lg"
          fullWidth
          onClick={handleWishlistClick}
          className={inWishlist 
            ? 'bg-red-600 hover:bg-red-700 text-white' 
            : 'border-2 border-white text-white hover:bg-white/10'}
        >
          {inWishlist ? (
            <>
              <IoHeart className="mr-2" size={20} />
              Remove from Wishlist
            </>
          ) : (
            <>
              <IoHeartOutline className="mr-2" size={20} />
              Add to Wishlist
            </>
          )}
        </Button>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
          <p className="text-green-200 leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Key Features */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex items-center text-sm text-green-200">
          <IoCheckmarkCircle className="text-green-400 mr-2" size={18} />
          <span>Free shipping over KES 2,000</span>
        </div>
        <div className="flex items-center text-sm text-green-200">
          <IoCheckmarkCircle className="text-green-400 mr-2" size={18} />
          <span>Quality guaranteed</span>
        </div>
        <div className="flex items-center text-sm text-green-200">
          <IoCheckmarkCircle className="text-green-400 mr-2" size={18} />
          <span>Direct from farmer</span>
        </div>
        <div className="flex items-center text-sm text-green-200">
          <IoCheckmarkCircle className="text-green-400 mr-2" size={18} />
          <span>Secure payment</span>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;