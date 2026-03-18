import React, { useState, useEffect, useCallback } from 'react';
import { useMarketplace } from '../hooks/useMarketplace';
import { useCrops } from '../context/CropContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  MarketplaceHeader,
  MarketplaceStats,
  MarketplaceSearch,
  MarketplaceSort,
  MarketplaceFilters,
  MarketplaceGrid
} from '../components/marketplace';

import AOS from 'aos';
import 'aos/dist/aos.css';

const Marketplace = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { listings, loading, error, refetch, getUniqueRegions } = useMarketplace();
  const { crops } = useCrops();
  
  const [filteredListings, setFilteredListings] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    crop: 'all',
    sort: 'newest',
    minPrice: '',
    maxPrice: '',
    region: '',
    organicOnly: false
  });

  const regions = getUniqueRegions();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...listings];

    // Filter by search term
    if (filters.search) {
      const term = filters.search.toLowerCase();
      filtered = filtered.filter(item => 
        item.crop_name?.toLowerCase().includes(term) ||
        item.farmer_name?.toLowerCase().includes(term) ||
        item.region_name?.toLowerCase().includes(term)
      );
    }

    // Filter by crop
    if (filters.crop !== 'all') {
      filtered = filtered.filter(item => item.crop_name === filters.crop);
    }

    // Filter by price range
    if (filters.minPrice) {
      filtered = filtered.filter(item => item.price_per_kg >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(item => item.price_per_kg <= Number(filters.maxPrice));
    }

    // Filter by region
    if (filters.region) {
      filtered = filtered.filter(item => item.region_name === filters.region);
    }

    // Filter organic only
    if (filters.organicOnly) {
      filtered = filtered.filter(item => item.is_organic);
    }

    // Apply sorting
    switch (filters.sort) {
      case 'price-low':
        filtered.sort((a, b) => a.price_per_kg - b.price_per_kg);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price_per_kg - a.price_per_kg);
        break;
      case 'harvest-earliest':
        filtered.sort((a, b) => new Date(a.expected_harvest_date) - new Date(b.expected_harvest_date));
        break;
      case 'harvest-latest':
        filtered.sort((a, b) => new Date(b.expected_harvest_date) - new Date(a.expected_harvest_date));
        break;
      case 'most-available':
        filtered.sort((a, b) => b.available_quantity_kg - a.available_quantity_kg);
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.listed_date || 0) - new Date(a.listed_date || 0));
    }

    setFilteredListings(filtered);
  }, [listings, filters]);

  const handleAddToCart = useCallback((item) => {
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
  }, [addToCart]);

  const handleBuyNow = useCallback((item) => {
    localStorage.setItem('selectedListing', JSON.stringify(item));
    navigate('/checkout', { state: { listing: item } });
  }, [navigate]);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      crop: 'all',
      sort: 'newest',
      minPrice: '',
      maxPrice: '',
      region: '',
      organicOnly: false
    });
  }, []);

  const handlePriceChange = useCallback((type, value) => {
    setFilters(prev => ({ ...prev, [type === 'min' ? 'minPrice' : 'maxPrice']: value }));
  }, []);

  return (
    <div className="min-h-screen bg-green-950">
      <MarketplaceHeader />
      
      <div className="container-custom -mt-32 relative z-10 pb-12 md:pb-16 lg:pb-20">
        <MarketplaceStats listings={listings} crops={crops} />
        
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20 shadow-2xl mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <MarketplaceSearch 
              value={filters.search}
              onChange={(value) => setFilters(prev => ({ ...prev, search: value }))}
            />
            <MarketplaceSort
              value={filters.sort}
              onChange={(value) => setFilters(prev => ({ ...prev, sort: value }))}
            />
          </div>
          
          <MarketplaceFilters
            crops={crops}
            selectedCrop={filters.crop}
            onCropChange={(crop) => setFilters(prev => ({ ...prev, crop }))}
            priceRange={{ min: filters.minPrice, max: filters.maxPrice }}
            onPriceChange={handlePriceChange}
            selectedRegion={filters.region}
            onRegionChange={(region) => setFilters(prev => ({ ...prev, region }))}
            regions={regions}
            showOrganic={filters.organicOnly}
            onOrganicChange={(checked) => setFilters(prev => ({ ...prev, organicOnly: checked }))}
            onClear={handleClearFilters}
          />
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-green-200">
            Showing <span className="text-white font-semibold">{filteredListings.length}</span> active listings
            {filters.crop !== 'all' && <span> for <span className="text-white">{filters.crop}</span></span>}
            {filters.search && <span> matching "<span className="text-white">{filters.search}</span>"</span>}
          </p>
          {filteredListings.length > 0 && (
            <p className="text-sm text-green-300">
              Total: {filteredListings.reduce((sum, l) => sum + l.available_quantity_kg, 0).toLocaleString()} kg
            </p>
          )}
        </div>

        <MarketplaceGrid
          listings={filteredListings}
          loading={loading}
          error={error}
          onRetry={refetch}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          emptyMessage="No listings match your criteria"
          emptySubMessage="Try adjusting your filters or search term"
        />
      </div>
    </div>
  );
};

export default Marketplace;