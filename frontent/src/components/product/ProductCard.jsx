import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { calculateStockStatus, getStockColor, getStockText } from '../../utils/calculateStock';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { IoHeart, IoHeartOutline, IoCartOutline } from 'react-icons/io5';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
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
    <div className="bg-green-950/30 backdrop-blur-sm rounded-xl overflow-hidden border border-green-400/20 hover:border-green-400/40 transition-all duration-300 card-hover group shadow-xl">
      <Link to={`/products/${product.id}`}>
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          {/* Image and Gradient together in same scaling container */}
          <div className="absolute inset-0 transform transition-transform duration-300 group-hover:scale-110 origin-bottom">
            <img
              src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {/* Gradient - Stays at bottom of image even when scaled */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-950 via-green-950/60 via-green-950/30 to-transparent pointer-events-none"></div>
          </div>
          
          {/* Wishlist Button - Only visible on hover */}
          <button
            onClick={handleWishlistClick}
            className="absolute top-2 right-2 p-2 bg-green-950/80 backdrop-blur-sm rounded-full shadow-md hover:bg-green-900 transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-[-5px] group-hover:translate-y-0 border border-green-400/30 z-10"
          >
            {inWishlist ? (
              <IoHeart className="text-red-400" size={20} />
            ) : (
              <IoHeartOutline className="text-green-300" size={20} />
            )}
          </button>

          {/* Badges - Always visible */}
          <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10">
            {product.isOrganic && (
              <Badge variant="success">Organic</Badge>
            )}
            {product.isPreorder && (
              <Badge variant="warning">Pre-Order</Badge>
            )}
          </div>
        </div>

        {/* Content - Dark theme background */}
        <div className="p-4 bg-green-950/40">
          {/* Farmer */}
          <p className="text-sm text-green-300/80 mb-1">
            {product.farmer?.farmName || product.farmer?.name || 'Unknown Farmer'}
          </p>

          {/* Product Name */}
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-white">{product.name}</h3>

          {/* Price */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-green-300">
              {formatCurrency(product.price)}
            </span>
            {product.unit && (
              <span className="text-sm text-green-300/60">per {product.unit}</span>
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
            <p className="text-sm text-green-300/70 mb-3">
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
            className="bg-green-600 hover:bg-green-700 text-white border-none"
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