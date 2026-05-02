import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import marketplaceApi from '../api/marketplaceApi';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { IoArrowBack, IoLeaf } from 'react-icons/io5';
import { GiFarmer } from 'react-icons/gi';
import { FiMapPin, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';

const MarketplaceItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [item, setItem] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await marketplaceApi.getItemDetails(id);
        
        if (response) {
          setItem(response);
        }
      } catch (err) {
        console.error("Error fetching marketplace item:", err);
        setError('Failed to load item details. Please check if the listing exists.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetails();
    }
  }, [id]);

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      name: item.crop_name,
      price: item.price_per_kg,
      unit: 'kg',
      availableQuantity: item.available_quantity_kg,
      images: [item.image_url],
      farmer: { name: item.farmer_name },
    }, 1);
    toast.success(`${item.crop_name} added to cart!`);
  };

  const handleBuyNow = () => {
    const formattedItem = {
      id: item.id,
      crop_name: item.crop_name,
      price_per_kg: item.price_per_kg,
      available_quantity_kg: item.available_quantity_kg,
      image_url: item.image_url,
      farmer_name: item.farmer_name,
      listing_status: item.listing_status,
      expected_harvest_date: item.expected_harvest_date
    };
    localStorage.setItem('selectedListing', JSON.stringify(formattedItem));
    navigate('/checkout', { state: { listing: formattedItem } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <Loader size="lg" showLogo={true} text="Loading listing details..." withSpinner={true} />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center px-4">
        <div className="text-center bg-green-900/30 backdrop-blur-sm rounded-3xl p-10 max-w-lg border border-green-400/20 shadow-2xl">
          <IoLeaf className="text-green-400 text-6xl mx-auto mb-4 opacity-70" />
          <h2 className="text-2xl font-bold text-white mb-2">Listing Not Found</h2>
          <p className="text-green-200 mb-8">{error || "This specific crop listing is no longer available."}</p>
          <Link to="/marketplace">
            <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white w-full shadow-lg shadow-green-900/40">
              Browse Other Listings
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const harvestDate = new Date(item.expected_harvest_date);
  const today = new Date();
  const daysToHarvest = Math.ceil((harvestDate - today) / (1000 * 60 * 60 * 24));
  const isAvailable = item.listing_status === 'Active' && item.available_quantity_kg > 0;

  return (
    <div className="min-h-screen bg-green-950 pb-20">
      {/* Header Image Section */}
      <div className="relative w-full h-72 md:h-96 overflow-hidden">
        <img 
          src={item.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200'} 
          alt={item.crop_name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-950/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-green-950/80 to-transparent"></div>
        
        <div className="absolute bottom-0 w-full px-6 py-10 md:py-14">
          <div className="max-w-7xl mx-auto">
            <Link to="/marketplace" className="inline-flex items-center text-green-300 hover:text-white mb-6 transition-colors font-medium">
              <IoArrowBack className="mr-2" />
              Back to Marketplace
            </Link>
            
            <div data-aos="fade-up">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant={isAvailable ? 'success' : 'default'} className="backdrop-blur-md">
                  {isAvailable ? 'Available Now' : 'Out of Stock'}
                </Badge>
                {item.is_organic && (
                  <Badge variant="success" className="bg-green-600/80 backdrop-blur-md">
                    Organic
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
                {item.crop_name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Details */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div 
              className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 border border-green-400/20 shadow-xl"
              data-aos="fade-up"
            >
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-green-800/50 pb-4">
                Listing Information
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-sm text-green-400 font-semibold uppercase tracking-wider mb-2">Crop Description</p>
                  <p className="text-green-100 leading-relaxed text-lg">
                    {item.description || `Fresh ${item.crop_name} cultivated with care. Excellent quality and ready for market.`}
                  </p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="bg-green-950/50 rounded-xl p-4 border border-green-800/30">
                    <div className="flex items-center gap-3 text-green-200 mb-1">
                      <FiClock className="text-green-400 text-xl" />
                      <span className="font-medium">Expected Harvest</span>
                    </div>
                    <p className="text-xl text-white font-semibold pl-8 mt-1">
                      {harvestDate.toLocaleDateString(undefined, { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    {daysToHarvest > 0 && daysToHarvest <= 14 && (
                      <p className="text-sm text-yellow-400 pl-8 mt-2 flex items-center gap-1 font-medium">
                        <FiClock size={12} /> Harvesting in {daysToHarvest} days!
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Farmer Badge large */}
              <div className="bg-gradient-to-r from-green-800/40 to-green-900/20 rounded-2xl p-6 border border-green-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-green-700/50 rounded-full flex items-center justify-center border-2 border-green-400/30 shadow-inner">
                    <GiFarmer className="text-green-300 text-3xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl mb-1">{item.farmer_name}</h3>
                    <div className="flex items-center gap-2 text-green-300 font-medium">
                      <FiMapPin size={16} />
                      <span>{item.region_name}</span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-green-400/80 text-sm font-semibold uppercase tracking-wider mb-1">Verified Seller</p>
                  <Badge variant="success" className="bg-green-600">Active Farmer</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Card */}
          <div className="lg:col-span-4" data-aos="fade-up" data-aos-delay="100">
            <div className="bg-green-800/30 backdrop-blur-md rounded-3xl p-8 border border-green-400/30 shadow-2xl sticky top-28">
              <div className="mb-8">
                <p className="text-green-300 font-medium mb-1">Price per kg</p>
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-extrabold text-green-400 tracking-tight">
                    {formatCurrency(item.price_per_kg)}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between pb-4 border-b border-green-700/50">
                  <span className="text-green-200">Total Stock Available</span>
                  <span className="text-white font-bold text-lg">{item.available_quantity_kg} kg</span>
                </div>
                <div className="flex justify-between pb-4 border-b border-green-700/50">
                  <span className="text-green-200">Minimum Order</span>
                  <span className="text-white font-bold">1 kg</span>
                </div>
                <div className="flex justify-between pb-4 border-b border-green-700/50">
                  <span className="text-green-200">Farming Status</span>
                  <span className="text-white font-bold capitalize">{item.planting_status || 'Harvested'}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleBuyNow}
                  className="w-full bg-green-500 hover:bg-green-400 text-green-950 font-bold text-lg py-4 shadow-xl shadow-green-500/20 transition-all hover:scale-[1.02]"
                  disabled={!isAvailable}
                >
                  Buy Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAddToCart}
                  className="w-full border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-white font-bold text-lg py-4 transition-all"
                  disabled={!isAvailable}
                >
                  Add to Cart
                </Button>
              </div>
              
              {!isAvailable && (
                <p className="text-center text-red-300 mt-4 font-medium">
                  This item is currently out of stock.
                </p>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default MarketplaceItemDetails;
