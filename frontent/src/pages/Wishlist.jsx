import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/ui/Button';
import { IoHeartOutline } from 'react-icons/io5';

const Wishlist = () => {
  const { wishlistItems } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-md p-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <IoHeartOutline className="text-gray-400" size={48} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h1>
              <p className="text-gray-600 mb-8">
                Save your favorite products to your wishlist and come back to them later.
              </p>
              <Link to="/products">
                <Button variant="primary" size="lg">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Wishlist</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            You have {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Recently Viewed */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* This would be populated with recently viewed products */}
            <div className="bg-white rounded-lg shadow p-3 text-center">
              <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-2"></div>
              <p className="text-sm font-medium">Sample Product</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;