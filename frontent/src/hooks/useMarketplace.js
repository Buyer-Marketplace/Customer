import { useState, useEffect, useCallback } from 'react';
import marketplaceApi from '../api/marketplaceApi'; // ✅ Default import (no curly braces)
// Remove cropsApi import if not used
import toast from 'react-hot-toast';

/**
 * Custom hook for marketplace data and functionality
 * @returns {Object} Marketplace state and methods
 */
export const useMarketplace = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    cropId: '',
    minPrice: '',
    maxPrice: '',
    region: '',
    farmer: '',
    sort: 'newest',
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  /**
   * Fetch all active marketplace listings
   * GET /api/marketplace/active
   */
  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceApi.getAllActiveListings();
      const data = response.data || [];
      setListings(data);
      setFilteredListings(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch marketplace listings';
      setError(message);
      toast.error(message);
      console.error('Error fetching marketplace listings:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  /**
   * Fetch listing by ID
   */
  const fetchListingById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await marketplaceApi.getAllActiveListings();
      const data = response.data || [];
      const listing = data.find(item => item.id === parseInt(id));
      
      if (listing) {
        setSelectedListing(listing);
        return listing;
      } else {
        throw new Error('Listing not found');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch listing';
      setError(message);
      toast.error(message);
      console.error(`Error fetching listing ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Apply filters to listings
   */
  const applyFilters = useCallback((newFilters = {}) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    
    let filtered = [...listings];

    // Filter by crop
    if (newFilters.cropId || filters.cropId) {
      const cropId = newFilters.cropId || filters.cropId;
      filtered = filtered.filter(item => item.crop_id === parseInt(cropId));
    }

    // Filter by price range
    if (newFilters.minPrice || filters.minPrice) {
      const minPrice = parseFloat(newFilters.minPrice || filters.minPrice);
      filtered = filtered.filter(item => item.price_per_kg >= minPrice);
    }
    if (newFilters.maxPrice || filters.maxPrice) {
      const maxPrice = parseFloat(newFilters.maxPrice || filters.maxPrice);
      filtered = filtered.filter(item => item.price_per_kg <= maxPrice);
    }

    // Filter by region
    if (newFilters.region || filters.region) {
      const region = (newFilters.region || filters.region).toLowerCase();
      filtered = filtered.filter(item => 
        item.region_name?.toLowerCase().includes(region)
      );
    }

    // Filter by farmer
    if (newFilters.farmer || filters.farmer) {
      const farmer = (newFilters.farmer || filters.farmer).toLowerCase();
      filtered = filtered.filter(item => 
        item.farmer_name?.toLowerCase().includes(farmer)
      );
    }

    // Apply sorting
    const sortBy = newFilters.sort || filters.sort;
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price_per_kg - b.price_per_kg);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price_per_kg - a.price_per_kg);
        break;
      case 'harvest-earliest':
        filtered.sort((a, b) => 
          new Date(a.expected_harvest_date) - new Date(b.expected_harvest_date)
        );
        break;
      case 'harvest-latest':
        filtered.sort((a, b) => 
          new Date(b.expected_harvest_date) - new Date(a.expected_harvest_date)
        );
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => 
          new Date(b.listed_date || 0) - new Date(a.listed_date || 0)
        );
    }

    setFilteredListings(filtered);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [listings, itemsPerPage, filters]);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFilters({
      cropId: '',
      minPrice: '',
      maxPrice: '',
      region: '',
      farmer: '',
      sort: 'newest',
    });
    setFilteredListings(listings);
    setTotalPages(Math.ceil(listings.length / itemsPerPage));
    setCurrentPage(1);
  }, [listings, itemsPerPage]);

  /**
   * Get current page items
   */
  const getCurrentPageItems = useCallback(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredListings.slice(start, end);
  }, [filteredListings, currentPage, itemsPerPage]);

  /**
   * Get unique regions from listings
   */
  const getUniqueRegions = useCallback(() => {
    return [...new Set(listings.map(item => item.region_name).filter(Boolean))];
  }, [listings]);

  /**
   * Get unique farmers from listings
   */
  const getUniqueFarmers = useCallback(() => {
    return [...new Set(listings.map(item => item.farmer_name).filter(Boolean))];
  }, [listings]);

  /**
   * Get price range from listings
   */
  const getPriceRange = useCallback(() => {
    if (listings.length === 0) return { min: 0, max: 0 };
    const prices = listings.map(item => item.price_per_kg);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [listings]);

  /**
   * Get listing statistics
   */
  const getListingStats = useCallback(() => {
    return {
      totalListings: listings.length,
      totalFarmers: getUniqueFarmers().length,
      totalRegions: getUniqueRegions().length,
      averagePrice: listings.length > 0 
        ? listings.reduce((sum, item) => sum + item.price_per_kg, 0) / listings.length 
        : 0,
    };
  }, [listings, getUniqueFarmers, getUniqueRegions]);

  /**
   * Check if item is available for purchase
   */
  const isAvailable = useCallback((listing) => {
    return listing.listing_status === 'Active' && listing.available_quantity_kg > 0;
  }, []);

  /**
   * Get items by farmer
   */
  const getItemsByFarmer = useCallback(async (farmerName) => {
    try {
      const response = await marketplaceApi.getAllActiveListings();
      const data = response.data || [];
      return data.filter(item => 
        item.farmer_name?.toLowerCase() === farmerName.toLowerCase()
      );
    } catch (err) {
      console.error(`Error fetching items for farmer ${farmerName}:`, err);
      return [];
    }
  }, []);

  /**
   * Get items by region
   */
  const getItemsByRegion = useCallback(async (region) => {
    try {
      const response = await marketplaceApi.getAllActiveListings();
      const data = response.data || [];
      return data.filter(item => 
        item.region_name?.toLowerCase() === region.toLowerCase()
      );
    } catch (err) {
      console.error(`Error fetching items for region ${region}:`, err);
      return [];
    }
  }, []);

  /**
   * Search listings by term
   */
  const searchListings = useCallback(async (searchTerm) => {
    setLoading(true);
    try {
      const response = await marketplaceApi.getAllActiveListings();
      let data = response.data || [];
      
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        data = data.filter(item => 
          item.crop_name?.toLowerCase().includes(term) ||
          item.farmer_name?.toLowerCase().includes(term) ||
          item.region_name?.toLowerCase().includes(term)
        );
      }
      
      setFilteredListings(data);
      setTotalPages(Math.ceil(data.length / itemsPerPage));
      setCurrentPage(1);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Search failed';
      toast.error(message);
      console.error('Error searching listings:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  /**
   * Refresh listings
   */
  const refreshListings = useCallback(() => {
    fetchListings();
  }, [fetchListings]);

  // Load initial data
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [listings]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentItems = getCurrentPageItems();
  const stats = getListingStats();
  const priceRange = getPriceRange();
  const uniqueRegions = getUniqueRegions();
  const uniqueFarmers = getUniqueFarmers();

  return {
    // State
    listings,
    filteredListings,
    currentItems,
    selectedListing,
    loading,
    error,
    filters,
    currentPage,
    totalPages,
    itemsPerPage,
    
    // Stats
    stats,
    priceRange,
    uniqueRegions,
    uniqueFarmers,
    
    // CRUD Operations
    fetchListings,
    fetchListingById,
    refreshListings,
    searchListings,
    
    // Filtering
    applyFilters,
    clearFilters,
    setFilters,
    
    // Pagination
    setCurrentPage,
    getCurrentPageItems,
    
    // Helper Methods
    isAvailable,
    getItemsByFarmer,
    getItemsByRegion,
    getUniqueRegions,
    getUniqueFarmers,
    getPriceRange,
    getListingStats,
  };
};