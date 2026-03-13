import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { farmerApi } from '../api/farmerApi';
import { productApi } from '../api/productApi';
import { mockFarmers, mockDataUtils } from '../data/mockData';
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
  IoArrowBack,
  IoCalendarOutline,
  IoCheckmarkCircle
} from 'react-icons/io5';
import { GiFarmer, GiFarmTractor } from 'react-icons/gi';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Header image
const headerImage = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1600";
const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const FarmerProfile = () => {
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  useEffect(() => {
    fetchFarmerData();
  }, [id]);

  const fetchFarmerData = async () => {
    setLoading(true);
    try {
      // Fetch farmer details
      let farmerData;
      try {
        const response = await farmerApi.getFarmerById(id);
        farmerData = response.data || response;
      } catch (err) {
        console.log('Using mock farmer data');
        farmerData = mockFarmers.find(f => f.id === parseInt(id)) || {
          id: parseInt(id),
          name: `Farmer ${id}`,
          farmName: `Farm ${id}`,
          location: 'Kenya',
          rating: 4.5,
          totalProducts: 0,
          memberSince: new Date().toISOString().split('T')[0],
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
          description: 'Dedicated farmer providing fresh produce to local communities.',
          verified: true,
        };
      }
      setFarmer(farmerData);

      // Fetch farmer products
      let productsData;
      try {
        const response = await farmerApi.getFarmerProducts(id, { limit: 12 });
        productsData = response.products || response;
      } catch (err) {
        console.log('Using mock farmer products');
        productsData = mockDataUtils.getProductsByFarmerId ? 
          mockDataUtils.getProductsByFarmerId(id) : [];
      }
      setProducts(productsData);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !farmer) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <div className="text-center bg-green-900/30 backdrop-blur-sm rounded-3xl p-12 border border-green-400/20">
          <GiFarmer className="text-green-400 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Farmer Not Found</h2>
          <p className="text-green-200 mb-6">The farmer profile you're looking for doesn't exist.</p>
          <Link to="/farmers">
            <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white">
              Browse Farmers
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-950">
      {/* Header Image Section */}
      <div className="relative w-full h-80 overflow-hidden">
        <img 
          src={farmer.coverImage || headerImage}
          alt={farmer.farmName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = headerImage;
          }}
        />
        <div className={`absolute inset-0 ${headerGradient}`}></div>
      </div>

      <div className="container-custom py-8 -mt-40 relative z-10">
        {/* Breadcrumb */}
        <div className="mb-6" data-aos="fade-right">
          <Link to="/farmers" className="inline-flex items-center text-green-300 hover:text-green-100 bg-green-950/50 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/20">
            <IoArrowBack className="mr-2" />
            Back to Farmers
          </Link>
        </div>

        {/* Profile Card */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl overflow-hidden border border-green-400/20 shadow-2xl mb-8" data-aos="fade-up">
          {/* Profile Header */}
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-400 shadow-xl bg-green-800">
                {farmer.image ? (
                  <img
                    src={farmer.image}
                    alt={farmer.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-600 to-green-800">
                    <GiFarmer className="text-white text-5xl" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {farmer.farmName || farmer.name}
                </h1>
                {farmer.farmName && (
                  <p className="text-xl text-green-300 mb-3">{farmer.name}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-4">
                  {farmer.location && (
                    <div className="flex items-center text-green-200">
                      <IoLocationOutline className="mr-1 text-green-400" />
                      {farmer.location}
                    </div>
                  )}
                  
                  {farmer.rating && (
                    <div className="flex items-center">
                      <IoStar className="text-yellow-400 mr-1" />
                      <span className="font-medium text-white">{farmer.rating}</span>
                      {farmer.reviewCount && (
                        <span className="text-green-300 ml-1">
                          ({farmer.reviewCount} reviews)
                        </span>
                      )}
                    </div>
                  )}

                  {farmer.verified && (
                    <Badge variant="success" className="flex items-center">
                      <IoCheckmarkCircle className="mr-1" />
                      Verified Farmer
                    </Badge>
                  )}
                </div>

                {/* Member since */}
                {farmer.memberSince && (
                  <div className="flex items-center text-sm text-green-300/70 mt-3">
                    <IoCalendarOutline className="mr-1" />
                    Member since {new Date(farmer.memberSince).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </div>
                )}
              </div>

              <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white">
                Contact Farmer
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 pt-0">
            <div className="bg-green-950/50 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
              <p className="text-3xl font-bold text-green-300">{products.length}</p>
              <p className="text-xs text-green-200/70">Products</p>
            </div>
            <div className="bg-green-950/50 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
              <p className="text-3xl font-bold text-green-300">{farmer.followers || 128}</p>
              <p className="text-xs text-green-200/70">Followers</p>
            </div>
            <div className="bg-green-950/50 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
              <p className="text-3xl font-bold text-green-300">
                {Math.floor((new Date() - new Date(farmer.memberSince)) / (1000 * 60 * 60 * 24 * 365)) || 1}
              </p>
              <p className="text-xs text-green-200/70">Years Active</p>
            </div>
            <div className="bg-green-950/50 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
              <p className="text-3xl font-bold text-green-300">{farmer.ordersFulfilled || 245}</p>
              <p className="text-xs text-green-200/70">Orders Fulfilled</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-green-800 mb-6" data-aos="fade-up">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'products'
                  ? 'border-green-400 text-green-300'
                  : 'border-transparent text-green-200/60 hover:text-green-200 hover:border-green-700'
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'about'
                  ? 'border-green-400 text-green-300'
                  : 'border-transparent text-green-200/60 hover:text-green-200 hover:border-green-700'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reviews'
                  ? 'border-green-400 text-green-300'
                  : 'border-transparent text-green-200/60 hover:text-green-200 hover:border-green-700'
              }`}
            >
              Reviews ({farmer.reviews?.length || 0})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div data-aos="fade-up">
              {products.length === 0 ? (
                <div className="text-center py-12 bg-green-900/30 backdrop-blur-sm rounded-3xl border border-green-400/20">
                  <GiFarmTractor className="text-green-400 text-5xl mx-auto mb-4" />
                  <p className="text-green-200">No products available from this farmer yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product, index) => (
                    <div key={product.id} data-aos="fade-up" data-aos-delay={index * 100}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 border border-green-400/20" data-aos="fade-up">
              {/* Bio */}
              {farmer.description && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-white mb-3">About the Farm</h3>
                  <p className="text-green-200 leading-relaxed">{farmer.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Farm Details */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Farm Details</h3>
                  <ul className="space-y-2 text-green-200">
                    {farmer.farmSize && (
                      <li><span className="font-medium text-green-300">Farm Size:</span> {farmer.farmSize} acres</li>
                    )}
                    {farmer.established && (
                      <li><span className="font-medium text-green-300">Established:</span> {farmer.established}</li>
                    )}
                    {farmer.farmingMethods && (
                      <li><span className="font-medium text-green-300">Farming Methods:</span> {farmer.farmingMethods}</li>
                    )}
                    {farmer.certifications && (
                      <li><span className="font-medium text-green-300">Certifications:</span> {farmer.certifications}</li>
                    )}
                    {farmer.isOrganic && (
                      <li className="flex items-center">
                        <IoLeaf className="text-green-400 mr-2" />
                        <span className="text-green-300">Certified Organic</span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Contact Information</h3>
                  <ul className="space-y-3">
                    {farmer.phone && (
                      <li className="flex items-center text-green-200">
                        <IoCallOutline className="mr-3 text-green-400" />
                        <a href={`tel:${farmer.phone}`} className="hover:text-green-300">
                          {farmer.phone}
                        </a>
                      </li>
                    )}
                    {farmer.email && (
                      <li className="flex items-center text-green-200">
                        <IoMailOutline className="mr-3 text-green-400" />
                        <a href={`mailto:${farmer.email}`} className="hover:text-green-300">
                          {farmer.email}
                        </a>
                      </li>
                    )}
                  </ul>

                  {/* Social Media */}
                  {(farmer.facebook || farmer.twitter || farmer.instagram) && (
                    <div className="mt-6">
                      <h4 className="font-medium text-white mb-3">Follow Us</h4>
                      <div className="flex space-x-4">
                        {farmer.facebook && (
                          <a
                            href={farmer.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 transition-colors"
                          >
                            <IoLogoFacebook size={24} />
                          </a>
                        )}
                        {farmer.twitter && (
                          <a
                            href={farmer.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 transition-colors"
                          >
                            <IoLogoTwitter size={24} />
                          </a>
                        )}
                        {farmer.instagram && (
                          <a
                            href={farmer.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:text-green-300 transition-colors"
                          >
                            <IoLogoInstagram size={24} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 border border-green-400/20" data-aos="fade-up">
              {/* Overall Rating */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Customer Reviews</h3>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <IoStar
                          key={star}
                          className={star <= Math.floor(farmer.rating || 0)
                            ? 'text-yellow-400'
                            : 'text-green-700'
                          }
                          size={24}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-xl font-semibold text-white">{farmer.rating || 0}</span>
                    <span className="ml-1 text-green-300">({farmer.reviewCount || farmer.reviews?.length || 0} reviews)</span>
                  </div>
                </div>
                
                <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white">
                  Write a Review
                </Button>
              </div>

              {/* Reviews List */}
              {farmer.reviews && farmer.reviews.length > 0 ? (
                <div className="space-y-6">
                  {farmer.reviews.map((review) => (
                    <div key={review.id} className="border-b border-green-800 pb-6 last:border-b-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="font-semibold text-white mr-3">{review.userName || review.user}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <IoStar
                                  key={star}
                                  className={star <= review.rating
                                    ? 'text-yellow-400'
                                    : 'text-green-700'
                                  }
                                  size={16}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-green-300/70 mb-2">{review.date}</p>
                          <p className="text-green-200">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-green-300 py-8">No reviews yet. Be the first to review this farmer!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;