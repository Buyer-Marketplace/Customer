import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cropsApi } from '../api/cropsApi';
import { useCategories } from '../hooks/useCategories';
import CropCard from '../components/crop/CropCard';
import Loader, { SkeletonLoader } from '../components/ui/Loader';
import Button from '../components/ui/Button';
import { IoArrowBack, IoLeaf } from 'react-icons/io5';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Header image
const headerImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600";
const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const CategoryCrops = () => {
  const { id } = useParams();
  const { categories, loading: categoriesLoading } = useCategories();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Find the category by ID (handle both string and number)
  const category = categories.find(c => c.id === parseInt(id) || c.id === id);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  useEffect(() => {
    if (id) {
      fetchCrops();
    }
  }, [id]);

  const fetchCrops = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cropsApi.getItemsByCrop(id);
      // Handle different response structures
      const cropsData = response.data?.data || response.data || [];
      setCrops(cropsData);
    } catch (err) {
      console.error('Error fetching crops:', err);
      setError(err.response?.data?.message || 'Failed to load crops. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading while categories are loading or crops are loading
  if (categoriesLoading || loading) {
    return (
      <div className="min-h-screen bg-green-950">
        <div className="container-custom py-12">
          <div className="mb-6">
            <Link to="/categories" className="inline-flex items-center text-green-300 hover:text-green-100">
              <IoArrowBack className="mr-2" />
              Back to Categories
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <SkeletonLoader type="card" count={8} />
          </div>
        </div>
      </div>
    );
  }

  // If category not found
  if (!category) {
    return (
      <div className="min-h-screen bg-green-950">
        <div className="container-custom py-12">
          <div className="mb-6">
            <Link to="/categories" className="inline-flex items-center text-green-300 hover:text-green-100">
              <IoArrowBack className="mr-2" />
              Back to Categories
            </Link>
          </div>
          <div className="text-center py-16 bg-green-900/30 backdrop-blur-sm rounded-3xl border border-green-400/20">
            <IoLeaf className="text-green-400 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Category Not Found</h3>
            <p className="text-green-200 mb-6">The category you're looking for doesn't exist.</p>
            <Link to="/categories">
              <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white">
                Browse Categories
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-950">
      {/* Header */}
      <div className="relative w-full h-80 overflow-hidden">
        <img 
          src={category.image || headerImage}
          alt={category.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = headerImage; // Fallback to default if category image fails
          }}
        />
        <div className={`absolute inset-0 ${headerGradient}`}></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white" data-aos="fade-down">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{category.name}</h1>
            <p className="text-xl text-green-200 max-w-2xl px-4">
              {category.description || `Browse all available ${category.name.toLowerCase()}`}
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Breadcrumb */}
        <div className="mb-6" data-aos="fade-right">
          <Link to="/categories" className="inline-flex items-center text-green-300 hover:text-green-100 transition-colors">
            <IoArrowBack className="mr-2" />
            Back to Categories
          </Link>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-16 bg-green-900/30 backdrop-blur-sm rounded-3xl border border-green-400/20 mb-8">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={fetchCrops} variant="primary" className="bg-green-600 hover:bg-green-700 text-white">
              Try Again
            </Button>
          </div>
        )}

        {/* No Items State */}
        {!error && crops.length === 0 ? (
          <div className="text-center py-16 bg-green-900/30 backdrop-blur-sm rounded-3xl border border-green-400/20">
            <IoLeaf className="text-green-400 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Items Found</h3>
            <p className="text-green-200 mb-6">No active listings for {category.name} at the moment.</p>
            <Link to="/categories">
              <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white">
                Browse Other Categories
              </Button>
            </Link>
          </div>
        ) : null}

        {/* Crops Grid */}
        {!error && crops.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-green-200">
                Showing <span className="text-white font-semibold">{crops.length}</span> {crops.length === 1 ? 'item' : 'items'}
              </p>
              <select className="bg-green-900/50 border border-green-700/50 rounded-lg text-white px-4 py-2 text-sm focus:ring-2 focus:ring-green-400 focus:border-transparent">
                <option>Sort by: Latest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Harvest Date</option>
              </select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {crops.map((item, index) => (
                <div key={item.id || index} data-aos="fade-up" data-aos-delay={index * 100}>
                  <CropCard 
                    crop={{
                      id: item.id,
                      name: item.crop_name || item.name,
                      farmer: { 
                        name: item.farmer_name || item.farmer?.name || 'Unknown Farmer' 
                      },
                      price: item.price_per_kg || item.price,
                      unit: item.unit || 'kg',
                      availableQuantity: item.available_quantity_kg || item.quantity,
                      images: item.image_url ? [item.image_url] : item.images || [],
                      harvestDate: item.expected_harvest_date || item.harvest_date,
                      location: item.region_name || item.location || 'Unknown Location',
                      description: item.description || item.crop_description,
                    }} 
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryCrops;