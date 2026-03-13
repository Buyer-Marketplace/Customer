import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/ui/Button';
import { IoHeartOutline, IoArrowBack } from 'react-icons/io5';
import { GiFarmer } from 'react-icons/gi';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Header image
const headerImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600";
const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const Wishlist = () => {
  const { wishlistItems } = useWishlist();

  React.useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

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
                Save your favorite products for later
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
                Save your favorite products to your wishlist and come back to them later.
              </p>
              <Link to="/products">
                <Button variant="primary" size="lg" className="bg-green-600 hover:bg-green-700 text-white">
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
              You have {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Back Button */}
        <div className="mb-6" data-aos="fade-right">
          <Link to="/" className="inline-flex items-center text-green-300 hover:text-green-100 bg-green-950/50 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/20">
            <IoArrowBack className="mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-aos="fade-up">
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-3xl font-bold text-green-300">{wishlistItems.length}</div>
            <div className="text-xs text-green-200/70">Saved Items</div>
          </div>
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-3xl font-bold text-green-300">
              {wishlistItems.filter(p => p.isOrganic).length}
            </div>
            <div className="text-xs text-green-200/70">Organic</div>
          </div>
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-3xl font-bold text-green-300">
              {wishlistItems.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString()}
            </div>
            <div className="text-xs text-green-200/70">Total Value (KES)</div>
          </div>
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-3xl font-bold text-green-300">
              {new Set(wishlistItems.map(p => p.farmer?.id)).size}
            </div>
            <div className="text-xs text-green-200/70">Farmers</div>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((product, index) => (
            <div key={product.id} data-aos="fade-up" data-aos-delay={index * 100}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Recently Viewed */}
        <div className="mt-12" data-aos="fade-up">
          <h2 className="text-2xl font-bold text-white mb-6">Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
                <div className="w-16 h-16 bg-green-800/50 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <GiFarmer className="text-green-400 text-2xl" />
                </div>
                <p className="text-sm font-medium text-white">Fresh Product</p>
                <p className="text-xs text-green-300 mt-1">KES 150</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;