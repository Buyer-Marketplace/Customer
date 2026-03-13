import { useState, useEffect } from 'react';
import { preorderApi } from '../api/preorderApi';

export const usePreorders = () => {
  const [availablePreorders, setAvailablePreorders] = useState([]);
  const [userPreorders, setUserPreorders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPreorders, setTotalPreorders] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    sort: 'newest',
    category: '',
  });

  // Fetch available preorders when page or filters change
  useEffect(() => {
    fetchAvailablePreorders(filters);
  }, [currentPage, filters]);

  const fetchAvailablePreorders = async (params = {}) => {
    try {
      setLoading(true);
      const response = await preorderApi.getAvailablePreorders({
        page: currentPage,
        ...params
      });
      
      if (response && response.data) {
        setAvailablePreorders(response.data);
        setTotalPages(response.totalPages || 1);
        setTotalPreorders(response.total || response.data.length || 0);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching available preorders:', err);
      setError(err.message || 'Failed to fetch available preorders');
      setAvailablePreorders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPreorders = async (userId, params = {}) => {
    try {
      setLoading(true);
      const response = await preorderApi.getUserPreorders(userId, {
        page: currentPage,
        ...params
      });
      
      if (response && response.data) {
        setUserPreorders(response.data);
        setTotalPages(response.totalPages || 1);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching user preorders:', err);
      setError(err.message || 'Failed to fetch user preorders');
      setUserPreorders([]);
    } finally {
      setLoading(false);
    }
  };

  const createPreorder = async (preorderData) => {
    try {
      setLoading(true);
      const response = await preorderApi.createPreorder(preorderData);
      setError(null);
      
      // Refresh available preorders after creating
      await fetchAvailablePreorders(filters);
      
      return response;
    } catch (err) {
      console.error('Error creating preorder:', err);
      setError(err.message || 'Failed to create preorder');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelPreorder = async (id) => {
    try {
      setLoading(true);
      const response = await preorderApi.cancelPreorder(id);
      
      // Update local state
      setUserPreorders(prev => 
        prev.map(p => p.id === id ? { ...p, status: 'cancelled' } : p)
      );
      
      // Also update available preorders if needed
      setAvailablePreorders(prev => 
        prev.map(p => p.id === id ? { ...p, status: 'cancelled' } : p)
      );
      
      setError(null);
      return response;
    } catch (err) {
      console.error('Error cancelling preorder:', err);
      setError(err.message || 'Failed to cancel preorder');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPreorderById = async (id) => {
    try {
      setLoading(true);
      const response = await preorderApi.getPreorderById(id);
      setError(null);
      return response.data || response;
    } catch (err) {
      console.error('Error fetching preorder:', err);
      setError(err.message || 'Failed to fetch preorder');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update filters and reset to page 1
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      sort: 'newest',
      category: '',
    });
    setCurrentPage(1);
  };

  // Get preorder statistics
  const getPreorderStats = () => {
    const stats = {
      total: totalPreorders,
      open: availablePreorders.filter(p => p.status === 'open').length,
      fulfilled: availablePreorders.filter(p => p.status === 'fulfilled').length,
      cancelled: availablePreorders.filter(p => p.status === 'cancelled').length,
      expiringSoon: availablePreorders.filter(p => {
        if (p.status !== 'open' || !p.orderDeadline) return false;
        const daysLeft = Math.ceil((new Date(p.orderDeadline) - new Date()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 7 && daysLeft > 0;
      }).length,
    };
    return stats;
  };

  // Get days left until deadline
  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format deadline status
  const getDeadlineStatus = (deadline) => {
    const daysLeft = getDaysLeft(deadline);
    if (daysLeft === null) return 'unknown';
    if (daysLeft < 0) return 'expired';
    if (daysLeft <= 3) return 'urgent';
    if (daysLeft <= 7) return 'soon';
    return 'normal';
  };

  return {
    // State
    availablePreorders,
    userPreorders,
    loading,
    error,
    totalPages,
    currentPage,
    totalPreorders,
    filters,
    
    // Actions
    setCurrentPage,
    fetchAvailablePreorders,
    fetchUserPreorders,
    createPreorder,
    cancelPreorder,
    getPreorderById,
    updateFilters,
    clearFilters,
    
    // Helpers
    getPreorderStats,
    getDaysLeft,
    getDeadlineStatus,
  };
};