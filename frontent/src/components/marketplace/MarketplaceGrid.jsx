import React from 'react';
import { IoLeaf } from 'react-icons/io5';
import Loader, { SkeletonLoader } from '../ui/Loader';
import Button from '../ui/Button';
import MarketplaceCard from './MarketplaceCard';

const MarketplaceGrid = ({ 
  listings, 
  loading, 
  error, 
  onRetry, 
  onAddToCart, 
  onBuyNow,
  emptyMessage = "No listings found",
  emptySubMessage = "Try adjusting your search or filters"
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <SkeletonLoader type="card" count={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 bg-green-900/30 backdrop-blur-sm rounded-3xl border border-red-400/20">
        <p className="text-red-400 mb-4">{error}</p>
        <Button onClick={onRetry} variant="primary" className="bg-red-600 hover:bg-red-700">
          Try Again
        </Button>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-16 bg-green-900/30 backdrop-blur-sm rounded-3xl border border-green-400/20">
        <IoLeaf className="text-green-400 text-6xl mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">{emptyMessage}</h3>
        <p className="text-green-200 mb-6">{emptySubMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((item, index) => (
        <div 
          key={item.id}
          data-aos="fade-up"
          data-aos-delay={index * 100}
        >
          <MarketplaceCard 
            item={item}
            onAddToCart={onAddToCart}
            onBuyNow={onBuyNow}
          />
        </div>
      ))}
    </div>
  );
};

export default MarketplaceGrid;