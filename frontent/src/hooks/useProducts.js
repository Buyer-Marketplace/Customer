import { useState, useEffect } from 'react';
import { productApi } from '../api/productApi';

export const useProducts = (initialParams = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);
  const [params, setParams] = useState(initialParams);

  useEffect(() => {
    fetchProducts();
  }, [params]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productApi.getAllProducts(params);
      setProducts(response.products || response);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateParams = (newParams) => {
    setParams(prev => ({ ...prev, ...newParams, page: 1 }));
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setParams(prev => ({ ...prev, page: currentPage + 1 }));
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setParams(prev => ({ ...prev, page: currentPage - 1 }));
      setCurrentPage(prev => prev - 1);
    }
  };

  return {
    products,
    loading,
    error,
    totalPages,
    currentPage,
    updateParams,
    nextPage,
    prevPage,
    refetch: fetchProducts,
  };
};