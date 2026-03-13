import React, { createContext, useState, useContext } from 'react';
import { productApi } from '../api/productApi';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productApi.getAllProducts(params);
      setProducts(response.products || response);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(params.page || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const data = await productApi.getFeaturedProducts();
      setFeaturedProducts(data.products || data);
    } catch (err) {
      console.error('Error fetching featured products:', err);
    }
  };

  const fetchNewProducts = async () => {
    try {
      const data = await productApi.getNewProducts();
      setNewProducts(data.products || data);
    } catch (err) {
      console.error('Error fetching new products:', err);
    }
  };

  const searchProducts = async (searchTerm, params = {}) => {
    setLoading(true);
    try {
      const response = await productApi.searchProducts(searchTerm, params);
      setProducts(response.products || response);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    products,
    featuredProducts,
    newProducts,
    loading,
    error,
    totalPages,
    currentPage,
    fetchProducts,
    fetchFeaturedProducts,
    fetchNewProducts,
    searchProducts,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};