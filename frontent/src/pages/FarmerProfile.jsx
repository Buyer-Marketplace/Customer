import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { farmerApi } from '../api/farmerApi';
import { productApi } from '../api/productApi';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Loader from '../components/ui/Loader';
import {
  IoLocationOutline,
  IoStar,
  IoLeaf,
  IoCallOutline,
  IoMailOutline,
  IoLogoFacebook,
  IoLogoTwitter,
  IoLogoInstagram,
} from 'react-icons/io5';

const FarmerProfile = () => {
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    fetchFarmerData();
  }, [id]);

  const fetchFarmerData = async () => {
    setLoading(true);
    try {
      const farmerData = await farmerApi.getFarmerById(id);
      setFarmer(farmerData);

      const productsData = await farmerApi.getFarmerProducts(id);
      setProducts(productsData.products || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !farmer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Farmer Not Found</h2>
          <p className="text-gray-600 mb-4">The farmer profile you're looking for doesn't exist.</p>
          <Button variant="primary" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Farmer Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-primary-600 to-primary-800 relative">
            {farmer.coverImage && (
              <img
                src={farmer.coverImage}
                alt="Farm cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Profile Info */}
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="absolute -top-16 left-6">
              <div className="w-32 h-32 bg-white rounded-full p-1 shadow-lg">
                <div className="w-full h-full bg-primary-100 rounded-full flex items-center justify-center">
                  {farmer.profileImage ? (
                    <img
                      src={farmer.profileImage}
                      alt={farmer.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-4xl text-primary-600 font-semibold">
                      {farmer.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="pt-16">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {farmer.farmName || farmer.name}
                  </h1>
                  {farmer.farmName && (
                    <p className="text-lg text-gray-600">{farmer.name}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 mt-2">
                    {farmer.location && (
                      <div className="flex items-center text-gray-600">
                        <IoLocationOutline className="mr-1" />
                        {farmer.location}
                      </div>
                    )}
                    
                    {farmer.rating && (
                      <div className="flex items-center">
                        <IoStar className="text-yellow-400 mr-1" />
                        <span className="font-medium">{farmer.rating}</span>
                        {farmer.reviewCount && (
                          <span className="text-gray-500 ml-1">
                            ({farmer.reviewCount} reviews)
                          </span>
                        )}
                      </div>
                    )}

                    {farmer.isOrganic && (
                      <Badge variant="success" className="flex items-center">
                        <IoLeaf className="mr-1" />
                        Certified Organic
                      </Badge>
                    )}

                    {farmer.isVerified && (
                      <Badge variant="info">Verified Farmer</Badge>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Contact Farmer
                  </Button>
                  <Button variant="primary" size="sm">
                    Follow
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">{farmer.productCount || 0}</p>
                  <p className="text-sm text-gray-600">Products</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">{farmer.followers || 0}</p>
                  <p className="text-sm text-gray-600">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">{farmer.yearsActive || 1}</p>
                  <p className="text-sm text-gray-600">Years Active</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">{farmer.ordersFulfilled || 0}</p>
                  <p className="text-sm text-gray-600">Orders Fulfilled</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'about'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No products available from this farmer yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Bio */}
              {farmer.bio && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">About the Farm</h3>
                  <p className="text-gray-700 leading-relaxed">{farmer.bio}</p>
                </div>
              )}

              {/* Farm Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Farm Details</h3>
                  <ul className="space-y-2 text-gray-700">
                    {farmer.farmSize && (
                      <li><span className="font-medium">Farm Size:</span> {farmer.farmSize} acres</li>
                    )}
                    {farmer.established && (
                      <li><span className="font-medium">Established:</span> {farmer.established}</li>
                    )}
                    {farmer.farmingMethods && (
                      <li><span className="font-medium">Farming Methods:</span> {farmer.farmingMethods}</li>
                    )}
                    {farmer.certifications && (
                      <li><span className="font-medium">Certifications:</span> {farmer.certifications}</li>
                    )}
                  </ul>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="font-semibold mb-3">Contact Information</h3>
                  <ul className="space-y-2">
                    {farmer.phone && (
                      <li className="flex items-center text-gray-700">
                        <IoCallOutline className="mr-2" />
                        {farmer.phone}
                      </li>
                    )}
                    {farmer.email && (
                      <li className="flex items-center text-gray-700">
                        <IoMailOutline className="mr-2" />
                        {farmer.email}
                      </li>
                    )}
                    {farmer.website && (
                      <li>
                        <a
                          href={farmer.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700"
                        >
                          {farmer.website}
                        </a>
                      </li>
                    )}
                  </ul>

                  {/* Social Media */}
                  {(farmer.facebook || farmer.twitter || farmer.instagram) && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Follow Us</h4>
                      <div className="flex space-x-3">
                        {farmer.facebook && (
                          <a
                            href={farmer.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-primary-600"
                          >
                            <IoLogoFacebook size={24} />
                          </a>
                        )}
                        {farmer.twitter && (
                          <a
                            href={farmer.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-primary-600"
                          >
                            <IoLogoTwitter size={24} />
                          </a>
                        )}
                        {farmer.instagram && (
                          <a
                            href={farmer.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-primary-600"
                          >
                            <IoLogoInstagram size={24} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Map (if location available) */}
              {farmer.latitude && farmer.longitude && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Farm Location</h3>
                  <div className="h-64 bg-gray-200 rounded-lg">
                    {/* Add map integration here */}
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      Map view would be integrated here
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              {/* Overall Rating */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Customer Reviews</h3>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <IoStar
                          key={star}
                          className={star <= Math.floor(farmer.rating || 0)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                          }
                          size={20}
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-semibold">{farmer.rating || 0}</span>
                    <span className="ml-1 text-gray-500">({farmer.reviewCount || 0} reviews)</span>
                  </div>
                </div>
                
                <Button variant="primary">Write a Review</Button>
              </div>

              {/* Reviews List */}
              {farmer.reviews && farmer.reviews.length > 0 ? (
                <div className="space-y-4">
                  {farmer.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center mb-1">
                            <span className="font-semibold mr-2">{review.userName}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <IoStar
                                  key={star}
                                  className={star <= review.rating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                  }
                                  size={16}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{review.date}</p>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No reviews yet</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;