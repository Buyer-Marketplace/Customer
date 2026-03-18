import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import CropCard from '../components/crop/CropCard';
import Button from '../components/ui/Button';
import { IoHeartOutline, IoArrowBack, IoLeaf } from 'react-icons/io5';
import { GiFarmer } from 'react-icons/gi';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Header image
const headerImage = "https://images.pexels.com/photos/796580/pexels-photo-796580.jpeg";
const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  // Calculate statistics
  const totalValue = wishlistItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const organicCount = wishlistItems.filter(item => item.isOrganic || item.is_organic).length;
  const uniqueFarmers = new Set(wishlistItems.map(item => item.farmer?.name || item.farmer_name)).size;

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-green-950">
        {/* Header Image Section */}
        <div className="relative w-full h-80 overflow-hidden">
          <img 
            src={headerImage}
            alt="Wishlist"
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 ${headerGradient}`}></div>
          
          {/* Header Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white" data-aos="fade-down">
              <h1 className="text-5xl md:text-6xl font-bold mb-4">MY WISHLIST</h1>
              <p className="text-xl text-green-200 max-w-2xl px-4">
                Save your favorite crops for later
              </p>
            </div>
          </div>
        </div>

        <div className="container-custom py-12">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-12 border border-green-400/20" data-aos="fade-up">
              <div className="w-24 h-24 bg-green-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-400/30">
                <IoHeartOutline className="text-green-400" size={48} />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Your Wishlist is Empty</h1>
              <p className="text-green-200 mb-8">
                Save your favorite crops to your wishlist and come back to them later.
              </p>
              <Link to="/marketplace">
                <Button variant="primary" size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-950">
      {/* Header Image Section */}
      <div className="relative w-full h-80 overflow-hidden">
        <img 
          src={headerImage}
          alt="Wishlist"
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${headerGradient}`}></div>
        
        {/* Header Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white" data-aos="fade-down">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">MY WISHLIST</h1>
            <p className="text-xl text-green-200 max-w-2xl px-4">
              You have {wishlistItems.length} {wishlistItems.length === 1 ? 'crop' : 'crops'} saved
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <div className="mb-6" data-aos="fade-right">
          <Link to="/" className="inline-flex items-center text-green-300 hover:text-green-100 bg-green-950/50 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/20 transition-all duration-300">
            <IoArrowBack className="mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-aos="fade-up">
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-3xl font-bold text-green-300">{wishlistItems.length}</div>
            <div className="text-xs text-green-200/70">Saved Crops</div>
          </div>
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-3xl font-bold text-green-300">{organicCount}</div>
            <div className="text-xs text-green-200/70">Organic</div>
          </div>
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-3xl font-bold text-green-300">{totalValue.toLocaleString()}</div>
            <div className="text-xs text-green-200/70">Total Value (KES)</div>
          </div>
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-3xl font-bold text-green-300">{uniqueFarmers}</div>
            <div className="text-xs text-green-200/70">Farmers</div>
          </div>
        </div>

        {/* Wishlist Grid */}
        {wishlistItems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item, index) => (
              <div key={item.id} data-aos="fade-up" data-aos-delay={index * 100}>
                <CropCard 
                  crop={{
                    id: item.id,
                    name: item.crop_name || item.name,
                    farmer: { 
                      name: item.farmer_name || item.farmer?.name || 'Unknown Farmer' 
                    },
                    price: item.price_per_kg || item.price,
                    unit: item.unit || 'kg',
                    availableQuantity: item.available_quantity_kg || item.quantity || 0,
                    images: item.image_url ? [item.image_url] : item.images || [],
                    harvestDate: item.expected_harvest_date || item.harvest_date,
                    location: item.region_name || item.location || 'Unknown Location',
                    isOrganic: item.is_organic || item.isOrganic || false,
                    isPreorder: item.is_preorder || false,
                  }} 
                  onRemoveFromWishlist={() => removeFromWishlist(item.id)}
                  isInWishlist={isInWishlist(item.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Browse Categories Section */}
        <div className="mt-12" data-aos="fade-up">
          <h2 className="text-2xl font-bold text-white mb-6">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Vegetables', 'Fruits', 'Grains', 'Organic', 'Fresh', 'Pre-Order'].map((category, index) => (
              <Link 
                key={index} 
                to="/categories"
                className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20 hover:border-green-400/40 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-green-800/50 rounded-full mx-auto mb-3 flex items-center justify-center group-hover:bg-green-700/50 transition-colors">
                  <IoLeaf className="text-green-400 text-2xl group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-sm font-medium text-white">{category}</p>
                <p className="text-xs text-green-300 mt-1">Shop Now</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Continue Shopping Button */}
        <div className="text-center mt-8">
          <Link to="/marketplace">
            <Button variant="outline" className="border-2 border-green-400 text-green-300 hover:bg-green-800/30 px-6 py-2">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;