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
      
      // Refresh available preorders
      await fetchAvailablePreorders();
      
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

  const getPreorderStats = () => {
    const stats = {
      total: totalPreorders,
      open: availablePreorders.filter(p => p.status === 'open').length,
      fulfilled: availablePreorders.filter(p => p.status === 'fulfilled').length,
      cancelled: availablePreorders.filter(p => p.status === 'cancelled').length,
    };
    return stats;
  };

  return {
    availablePreorders,
    userPreorders,
    loading,
    error,
    totalPages,
    currentPage,
    totalPreorders,
    setCurrentPage,
    fetchAvailablePreorders,
    fetchUserPreorders,
    createPreorder,
    cancelPreorder,
    getPreorderById,
    getPreorderStats,
  };
};