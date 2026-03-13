import { useState, useEffect } from 'react';
import { productApi } from '../api/productApi';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [params, setParams] = useState(initialParams);

  // Fetch products when params change
  useEffect(() => {
    fetchProducts();
  }, [params]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.getAllProducts(params);
      
      // Handle different response structures
      if (response && response.products) {
        setProducts(response.products);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(response.currentPage || 1);
        setTotalProducts(response.totalProducts || response.products.length || 0);
      } else if (Array.isArray(response)) {
        setProducts(response);
        setTotalPages(1);
        setTotalProducts(response.length);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async (limit = 8) => {
    try {
      setLoading(true);
      const response = await productApi.getFeaturedProducts(limit);
      
      if (response && response.products) {
        setProducts(response.products);
        setTotalProducts(response.totalProducts || response.products.length || 0);
      } else if (Array.isArray(response)) {
        setProducts(response);
        setTotalProducts(response.length);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setError(err.message || 'Failed to fetch featured products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchNewProducts = async (limit = 8) => {
    try {
      setLoading(true);
      const response = await productApi.getNewProducts(limit);
      
      if (response && response.products) {
        setProducts(response.products);
        setTotalProducts(response.totalProducts || response.products.length || 0);
      } else if (Array.isArray(response)) {
        setProducts(response);
        setTotalProducts(response.length);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching new products:', err);
      setError(err.message || 'Failed to fetch new products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsByCategory = async (categoryId, params = {}) => {
    try {
      setLoading(true);
      const response = await productApi.getProductsByCategory(categoryId, params);
      
      if (response && response.products) {
        setProducts(response.products);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(response.currentPage || 1);
        setTotalProducts(response.totalProducts || response.products.length || 0);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching products by category:', err);
      setError(err.message || 'Failed to fetch products by category');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id) => {
    try {
      setLoading(true);
      const response = await productApi.getProductById(id);
      setError(null);
      return response.product || response;
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to fetch product');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams }));
  };

  const resetParams = () => {
    setParams({ page: 1 });
  };

  return {
    // State
    products,
    loading,
    error,
    totalPages,
    currentPage,
    totalProducts,
    params,
    
    // Actions
    setCurrentPage,
    updateParams,
    resetParams,
    fetchProducts,
    fetchFeaturedProducts,
    fetchNewProducts,
    fetchProductsByCategory,
    getProductById,
  };
};