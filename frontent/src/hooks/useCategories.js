import { useState, useEffect, useCallback } from 'react';
import { categoryApi } from '../api/categoryApi';
import toast from 'react-hot-toast';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  /**
   * Fetch all categories
   * GET /api/buyer/crops
   */
  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryApi.getAllCategories();
      const categoriesData = response.data || [];
      setCategories(categoriesData);
      return categoriesData;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch categories';
      setError(message);
      toast.error(message);
      console.error('Error fetching categories:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch category by ID
   */
  const fetchCategoryById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryApi.getCategoryById(id);
      const categoryData = response.data || null;
      setSelectedCategory(categoryData);
      return categoryData;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch category';
      setError(message);
      toast.error(message);
      console.error(`Error fetching category ${id}:`, err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch items by category ID
   * GET /api/buyer/crops/:id/items
   */
  const fetchItemsByCategory = useCallback(async (categoryId, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryApi.getItemsByCategory(categoryId, filters);
      let items = response.data || [];
      
      // Apply additional client-side filters if needed
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
      
      // Apply sorting
      if (filters.sort === 'price-low') {
        items.sort((a, b) => a.price_per_kg - b.price_per_kg);
      } else if (filters.sort === 'price-high') {
        items.sort((a, b) => b.price_per_kg - a.price_per_kg);
      } else if (filters.sort === 'harvest-earliest') {
        items.sort((a, b) => new Date(a.expected_harvest_date) - new Date(b.expected_harvest_date));
      } else if (filters.sort === 'harvest-latest') {
        items.sort((a, b) => new Date(b.expected_harvest_date) - new Date(a.expected_harvest_date));
      }
      
      setCategoryItems(items);
      setTotalItems(items.length);
      
      // Handle pagination
      const page = filters.page || 1;
      const limit = filters.limit || itemsPerPage;
      const start = (page - 1) * limit;
      const end = start + limit;
      const paginatedItems = items.slice(start, end);
      
      setTotalPages(Math.ceil(items.length / limit));
      setCurrentPage(page);
      
      return paginatedItems;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch category items';
      setError(message);
      toast.error(message);
      console.error(`Error fetching items for category ${categoryId}:`, err);
      return [];
    } finally {
      setLoading(false);
    }
  }, [itemsPerPage]);

  /**
   * Get current page items
   */
  const getCurrentPageItems = useCallback(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return categoryItems.slice(start, end);
  }, [categoryItems, currentPage, itemsPerPage]);

  /**
   * Get unique regions from category items
   */
  const getUniqueRegions = useCallback(() => {
    return [...new Set(categoryItems.map(item => item.region_name).filter(Boolean))];
  }, [categoryItems]);

  /**
   * Get unique farmers from category items
   */
  const getUniqueFarmers = useCallback(() => {
    return [...new Set(categoryItems.map(item => item.farmer_name).filter(Boolean))];
  }, [categoryItems]);

  /**
   * Get price range from category items
   */
  const getPriceRange = useCallback(() => {
    if (categoryItems.length === 0) return { min: 0, max: 0 };
    const prices = categoryItems.map(item => item.price_per_kg);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [categoryItems]);

  /**
   * Get category statistics
   */
  const getCategoryStats = useCallback(() => {
    return {
      totalCategories: categories.length,
      totalItems: categoryItems.length,
      activeFarmers: getUniqueFarmers().length,
      regions: getUniqueRegions().length,
    };
  }, [categories.length, categoryItems.length, getUniqueFarmers, getUniqueRegions]);

  /**
   * Get items by farmer in current category
   */
  const getItemsByFarmer = useCallback((farmerName) => {
    return categoryItems.filter(item => 
      item.farmer_name?.toLowerCase() === farmerName.toLowerCase()
    );
  }, [categoryItems]);

  /**
   * Get items by region in current category
   */
  const getItemsByRegion = useCallback((region) => {
    return categoryItems.filter(item => 
      item.region_name?.toLowerCase() === region.toLowerCase()
    );
  }, [categoryItems]);

  /**
   * Get upcoming harvests in current category
   */
  const getUpcomingHarvests = useCallback((days = 30) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    return categoryItems.filter(item => {
      const harvestDate = new Date(item.expected_harvest_date);
      return harvestDate >= today && harvestDate <= futureDate;
    }).sort((a, b) => new Date(a.expected_harvest_date) - new Date(b.expected_harvest_date));
  }, [categoryItems]);

  /**
   * Search items in current category
   */
  const searchItems = useCallback((searchTerm) => {
    if (!searchTerm) return categoryItems;
    
    const term = searchTerm.toLowerCase();
    return categoryItems.filter(item => 
      item.crop_name?.toLowerCase().includes(term) ||
      item.farmer_name?.toLowerCase().includes(term) ||
      item.region_name?.toLowerCase().includes(term)
    );
  }, [categoryItems]);

  /**
   * Clear selected category
   */
  const clearSelectedCategory = useCallback(() => {
    setSelectedCategory(null);
    setCategoryItems([]);
    setCurrentPage(1);
  }, []);

  /**
   * Change page
   */
  const changePage = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const currentItems = getCurrentPageItems();
  const stats = getCategoryStats();
  const priceRange = getPriceRange();
  const uniqueRegions = getUniqueRegions();
  const uniqueFarmers = getUniqueFarmers();

  return {
    // State
    categories,
    selectedCategory,
    categoryItems,
    currentItems,
    loading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    
    // Stats
    stats,
    priceRange,
    uniqueRegions,
    uniqueFarmers,
    
    // CRUD Operations
    fetchCategories,
    fetchCategoryById,
    fetchItemsByCategory,
    clearSelectedCategory,
    
    // Pagination
    changePage,
    setCurrentPage,
    getCurrentPageItems,
    
    // Helper Methods
    getUniqueRegions,
    getUniqueFarmers,
    getPriceRange,
    getCategoryStats,
    getItemsByFarmer,
    getItemsByRegion,
    getUpcomingHarvests,
    searchItems,
  };
};