import React from 'react';
import { Link } from 'react-router-dom';
import { IoLocationOutline, IoStar, IoLeaf } from 'react-icons/io5';
import Button from '../ui/Button';

const FarmerPreview = ({ farmer }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              {farmer.profileImage ? (
                <img
                  src={farmer.profileImage}
                  alt={farmer.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-2xl text-primary-600 font-semibold">
                  {farmer.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Farmer Info */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {farmer.farmName || farmer.name}
            </h3>
            
            {farmer.location && (
              <p className="flex items-center text-gray-600 text-sm mt-1">
                <IoLocationOutline className="mr-1" />
                {farmer.location}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center space-x-4 mt-2">
              {farmer.rating && (
                <div className="flex items-center">
                  <IoStar className="text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{farmer.rating}</span>
                  {farmer.reviewCount && (
                    <span className="text-sm text-gray-500 ml-1">
                      ({farmer.reviewCount} reviews)
                    </span>
                  )}
                </div>
              )}
              
              {farmer.productCount && (
                <span className="text-sm text-gray-600">
                  {farmer.productCount} products
                </span>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-3">
              {farmer.isOrganic && (
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  <IoLeaf className="mr-1" size={12} />
                  Organic Farmer
                </span>
              )}
              {farmer.isVerified && (
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  Verified
                </span>
              )}
            </div>
          </div>

          {/* Action */}
          <Link to={`/farmers/${farmer.id}`}>
            <Button variant="outline" size="sm">
              View Profile
            </Button>
          </Link>
        </div>

        {/* Bio */}
        {farmer.bio && (
          <p className="mt-4 text-gray-700 text-sm line-clamp-2">
            {farmer.bio}
          </p>
        )}
      </div>
    </div>
  );
};

export default FarmerPreview;