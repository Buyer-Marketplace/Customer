import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { SkeletonLoader } from '../ui/Loader';
import HeaderImage from './HeaderImage';
import SectionHeader from './SectionHeader';
import { headerImages } from '../../constants/homeConstants';
import { useMarketplace } from '../../hooks/useMarketplace'; // ✅ Named import with curly braces

// Crop card component using API data structure
const CropCard = ({ item }) => {
  if (!item) return null;
  
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-green-400/30 hover:border-green-400 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={item.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400'} 
          alt={item.crop_name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400';
          }}
        />
        {item.listing_status === 'Active' && (
          <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            Available
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-1">{item.crop_name}</h3>
        <p className="text-green-300 text-sm mb-2">{item.farmer_name}</p>
        <p className="text-green-300 text-xs mb-2">{item.region_name}</p>
        <div className="flex justify-between items-center">
          <span className="text-green-400 font-bold">KES {item.price_per_kg}</span>
          <span className="text-green-300 text-sm">/kg</span>
        </div>
        {item.expected_harvest_date && (
          <p className="text-xs text-green-300/70 mt-2">
            Harvest: {new Date(item.expected_harvest_date).toLocaleDateString()}
          </p>
        )}
        <p className="text-xs text-green-300/70 mt-1">
          Available: {item.available_quantity_kg} kg
        </p>
      </div>
    </div>
  );
};

const FeaturedCrops = () => {
  const navigate = useNavigate();
  const featuredRef = useRef(null);
  const { listings, loading } = useMarketplace(); // ✅ This now works with named export

  const scrollHorizontally = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -ref.current.clientWidth / 2 : ref.current.clientWidth / 2;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Filter only active listings
  const activeListings = listings?.filter(item => item.listing_status === 'Active') || [];

  if (!activeListings.length && !loading) {
    return null;
  }

  return (
    <section className="py-20">
      <HeaderImage 
        src={headerImages.featured} 
        alt="Fresh vegetables at market" 
      />
      
      <div className="container-custom">
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-green-400/20 shadow-2xl">
          <SectionHeader 
            title="FEATURED CROPS" 
            subtitle="Fresh from our partner farms"
          />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <SkeletonLoader type="card" count={4} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {activeListings.slice(0, 3).map((item, index) => (
                  <div 
                    key={item.id} 
                    className="cursor-pointer transform transition-all duration-500 hover:scale-105"
                    onClick={() => navigate(`/marketplace/item/${item.id}`)}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <CropCard item={item} />
                  </div>
                ))}
              </div>

              {activeListings.length > 3 && (
                <div className="relative mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">More Featured Items</h3>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => scrollHorizontally(featuredRef, "left")}
                        className="p-2 bg-green-800/80 backdrop-blur-md rounded-full hover:bg-green-700 transition-colors"
                      >
                        <FiChevronLeft className="w-5 h-5 text-white" />
                      </button>
                      <button 
                        onClick={() => scrollHorizontally(featuredRef, "right")}
                        className="p-2 bg-green-800/80 backdrop-blur-md rounded-full hover:bg-green-700 transition-colors"
                      >
                        <FiChevronRight className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                  <div 
                    ref={featuredRef}
                    className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                  >
                    {activeListings.slice(3).map((item) => (
                      <div 
                        key={item.id}
                        className="flex-shrink-0 w-72 cursor-pointer transform transition-all duration-500 hover:scale-105"
                        onClick={() => navigate(`/marketplace/item/${item.id}`)}
                      >
                        <CropCard item={item} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCrops;