import { useState, useEffect } from 'react';
import { farmerApi } from '../api/farmerApi';

export const useFarmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  const fetchFarmers = async (params = {}) => {
    try {
      setLoading(true);
      const response = await farmerApi.getAllFarmers({
        page: currentPage,
        ...params
      });
      
      if (response && response.data) {
        setFarmers(response.data);
        setTotalPages(response.totalPages || 1);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching farmers:', err);
      setError(err.message || 'Failed to fetch farmers');
      setFarmers([]);
    } finally {
      setLoading(false);
    }
  };

  const getFarmerById = async (id) => {
    try {
      setLoading(true);
      const response = await farmerApi.getFarmerById(id);
      
      if (response && response.data) {
        setSelectedFarmer(response.data);
        return response.data;
      }
      
      return null;
    } catch (err) {
      console.error('Error fetching farmer:', err);
      setError(err.message || 'Failed to fetch farmer');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getFarmerProducts = async (farmerId, params = {}) => {
    try {
      setLoading(true);
      const response = await farmerApi.getFarmerProducts(farmerId, params);
      
      if (response && response.products) {
        return response;
      }
      
      return { products: [], totalPages: 1 };
    } catch (err) {
      console.error('Error fetching farmer products:', err);
      setError(err.message || 'Failed to fetch farmer products');
      return { products: [], totalPages: 1 };
    } finally {
      setLoading(false);
    }
  };

  return {
    farmers,
    loading,
    error,
    totalPages,
    currentPage,
    selectedFarmer,
    setCurrentPage,
    fetchFarmers,
    getFarmerById,
    getFarmerProducts,
  };
};