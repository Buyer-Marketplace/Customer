import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { calculateStockStatus, getStockColor, getStockText } from '../../utils/calculateStock';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { IoHeart, IoHeartOutline, IoCartOutline } from 'react-icons/io5';
import { useTheme } from '../../context/ThemeContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isDark } = useTheme();
  
  const stockStatus = calculateStockStatus(product.availableQuantity, product.totalQuantity || product.availableQuantity);
  const inWishlist = isInWishlist(product.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className={`bg-white dark:bg-dark-card rounded-lg shadow-md overflow-hidden card-hover transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      <Link to={`/products/${product.id}`}>
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          
          {/* Wishlist Button */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-2 right-2 p-2 bg-white dark:bg-dark-card rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-dark-border transition-colors"
          >
            {inWishlist ? (
              <IoHeart className="text-red-500" size={20} />
            ) : (
              <IoHeartOutline className="text-gray-600 dark:text-gray-400" size={20} />
            )}
          </button>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1">
            {product.isOrganic && (
              <Badge variant="success">Organic</Badge>
            )}
            {product.isPreorder && (
              <Badge variant="warning">Pre-Order</Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Farmer */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {product.farmer?.farmName || product.farmer?.name || 'Unknown Farmer'}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 dark:text-white">{product.name}</h3>

          {/* Price */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-primary">
              {formatCurrency(product.price)}
            </span>
            {product.unit && (
              <span className="text-sm text-gray-500 dark:text-gray-400">per {product.unit}</span>
            )}
          </div>

          {/* Stock Status */}
          <div className="mb-3">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStockColor(stockStatus)}`}>
              {getStockText(stockStatus)}
            </span>
          </div>

          {/* Harvest Date */}
          {product.harvestDate && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Harvest: {new Date(product.harvestDate).toLocaleDateString()}
            </p>
          )}

          {/* Add to Cart Button */}
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={handleAddToCart}
            disabled={stockStatus === 'out-of-stock'}
          >
            <IoCartOutline className="mr-2" size={18} />
            {stockStatus === 'out-of-stock' ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;