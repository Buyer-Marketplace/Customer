// src/context/CropContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import cropsApi from '../api/cropsApi';
import marketplaceApi from '../api/marketplaceApi';

const CropContext = createContext();

// Export the hook directly from here
export const useCrops = () => {
  const context = useContext(CropContext);
  if (!context) {
    throw new Error('useCrops must be used within a CropProvider');
  }
  return context;
};

export const CropProvider = ({ children }) => {
  // ... rest of your provider code remains exactly the same ...
  const [crops, setCrops] = useState([]);
  const [cropItems, setCropItems] = useState([]);
  const [featuredCrops, setFeaturedCrops] = useState([]);
  const [newCrops, setNewCrops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCrop, setSelectedCrop] = useState(null);

  /**
   * Fetch all crops
   * GET /api/buyer/crops
   */
  const fetchAllCrops = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await cropsApi.getAllCrops();
      const cropsData = response.data || [];
      setCrops(cropsData);
      
      // Set featured crops (first 6 by default)
      setFeaturedCrops(cropsData.slice(0, 6));
      
      return cropsData;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch crops';
      setError(message);
      console.error('Error fetching crops:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch new crops (last 6 added)
   */
  const fetchNewCrops = async (limit = 6) => {
    try {
      const response = await cropsApi.getAllCrops();
      const cropsData = response.data || [];
      // Sort by created_at if available
      const sorted = cropsData.sort((a, b) => {
        if (a.created_at && b.created_at) {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        return 0;
      });
      const recent = sorted.slice(0, limit);
      setNewCrops(recent);
      return recent;
    } catch (err) {
      console.error('Error fetching new crops:', err);
      setNewCrops([]);
      return [];
    }
  };

  /**
   * Fetch featured crops (first 6 by default)
   */
  const fetchFeaturedCrops = async (limit = 6) => {
    try {
      const response = await cropsApi.getAllCrops();
      const cropsData = response.data || [];
      const featured = cropsData.slice(0, limit);
      setFeaturedCrops(featured);
      return featured;
    } catch (err) {
      console.error('Error fetching featured crops:', err);
      setFeaturedCrops([]);
      return [];
    }
  };

  /**
   * Fetch crop by ID
   */
  const fetchCropById = async (cropId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cropsApi.getAllCrops();
      const cropsData = response.data || [];
      const crop = cropsData.find(c => c.id === parseInt(cropId));
      
      if (crop) {
        setSelectedCrop(crop);
        
        // Fetch items for this crop
        await fetchItemsByCrop(cropId);
        
        return crop;
      } else {
        throw new Error('Crop not found');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch crop';
      setError(message);
      console.error(`Error fetching crop ${cropId}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch items by crop ID
   * GET /api/buyer/crops/:id/items
   */
  const fetchItemsByCrop = async (cropId, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cropsApi.getItemsByCrop(cropId);
      let items = response.data || [];
      
      // Apply filters client-side
      if (filters.minPrice) {
        items = items.filter(item => item.price_per_kg >= parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        items = items.filter(item => item.price_per_kg <= parseFloat(filters.maxPrice));
      }
      if (filters.farmer) {
        items = items.filter(item => 
          item.farmer_name?.toLowerCase().includes(filters.farmer.toLowerCase())
        );
      }
      if (filters.region) {
        items = items.filter(item => 
          item.region_name?.toLowerCase().includes(filters.region.toLowerCase())
        );
      }
      
      // Sort items
      if (filters.sort === 'price-low') {
        items.sort((a, b) => a.price_per_kg - b.price_per_kg);
      } else if (filters.sort === 'price-high') {
        items.sort((a, b) => b.price_per_kg - a.price_per_kg);
      } else if (filters.sort === 'harvest-earliest') {
        items.sort((a, b) => new Date(a.expected_harvest_date) - new Date(b.expected_harvest_date));
      } else if (filters.sort === 'harvest-latest') {
        items.sort((a, b) => new Date(b.expected_harvest_date) - new Date(a.expected_harvest_date));
      }
      
      setCropItems(items);
      
      // Handle pagination
      const page = filters.page || 1;
      const limit = filters.limit || 12;
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedItems = items.slice(start, end);
      
      setTotalPages(Math.ceil(items.length / limit));
      setCurrentPage(page);
      
      return paginatedItems;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch crop items';
      setError(message);
      console.error(`Error fetching items for crop ${cropId}:`, err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Search crops by name or description
   */
  const searchCrops = async (searchTerm) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cropsApi.getAllCrops();
      const cropsData = response.data || [];
      
      if (!searchTerm) {
        return cropsData;
      }
      
      const term = searchTerm.toLowerCase();
      const filtered = cropsData.filter(crop => 
        crop.crop_name?.toLowerCase().includes(term) ||
        crop.description?.toLowerCase().includes(term)
      );
      
      return filtered;
    } catch (err) {
      const message = err.response?.data?.message || 'Search failed';
      setError(message);
      console.error('Error searching crops:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get crop statistics
   */
  const getCropStats = () => {
    return {
      totalCrops: crops.length,
      totalItems: cropItems.length,
      activeFarmers: [...new Set(cropItems.map(item => item.farmer_name))].length,
      regions: [...new Set(cropItems.map(item => item.region_name))].length,
    };
  };

  /**
   * Get unique regions from crop items
   */
  const getUniqueRegions = () => {
    return [...new Set(cropItems.map(item => item.region_name).filter(Boolean))];
  };

  /**
   * Get price range for current crop
   */
  const getPriceRange = () => {
    if (cropItems.length === 0) return { min: 0, max: 0 };
    const prices = cropItems.map(item => item.price_per_kg);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  /**
   * Get upcoming harvests for current crop
   */
  const getUpcomingHarvests = (days = 30) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return cropItems.filter(item => {
      const harvestDate = new Date(item.expected_harvest_date);
      return harvestDate >= today && harvestDate <= futureDate;
    }).sort((a, b) => new Date(a.expected_harvest_date) - new Date(b.expected_harvest_date));
  };

  /**
   * Clear selected crop
   */
  const clearSelectedCrop = () => {
    setSelectedCrop(null);
    setCropItems([]);
  };

  // Load initial data
  useEffect(() => {
    fetchAllCrops();
    fetchNewCrops();
    fetchFeaturedCrops();
  }, []);

  const value = {
    // State
    crops,
    cropItems,
    featuredCrops,
    newCrops,
    selectedCrop,
    loading,
    error,
    totalPages,
    currentPage,
    
    // CRUD Operations
    fetchAllCrops,
    fetchCropById,
    fetchItemsByCrop,
    fetchNewCrops,
    fetchFeaturedCrops,
    searchCrops,
    clearSelectedCrop,
    
    // Pagination
    setCurrentPage,
    
    // Helper Methods
    getCropStats,
    getUniqueRegions,
    getPriceRange,
    getUpcomingHarvests,
  };

  return (
    <CropContext.Provider value={value}>
      {children}
    </CropContext.Provider>
  );
};

export default CropProvider;