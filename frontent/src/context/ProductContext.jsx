import React, { createContext, useState, useContext, useEffect } from 'react';
import { productApi } from '../api/productApi';

// Mock data for development
const mockProducts = [
  {
    id: 1,
    name: 'Fresh Organic Tomatoes',
    description: 'Juicy, ripe tomatoes grown organically without pesticides.',
    price: 150,
    unit: 'kg',
    availableQuantity: 50,
    totalQuantity: 100,
    images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400'],
    category: { id: 1, name: 'Vegetables' },
    farmer: { id: 1, name: 'John Mwangi', farmName: 'Green Valley Farm', location: 'Nakuru' },
    harvestDate: '2024-04-15',
    isOrganic: true,
    isPreorder: false,
    featured: true,
  },
  {
    id: 2,
    name: 'Sweet Corn',
    description: 'Fresh sweet corn harvested at peak ripeness.',
    price: 80,
    unit: 'piece',
    availableQuantity: 200,
    totalQuantity: 500,
    images: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400'],
    category: { id: 1, name: 'Vegetables' },
    farmer: { id: 2, name: 'Mary Wanjiku', farmName: 'Highlands Farm', location: 'Eldoret' },
    harvestDate: '2024-04-20',
    isOrganic: false,
    isPreorder: true,
    featured: true,
  },
  {
    id: 3,
    name: 'Fresh Strawberries',
    description: 'Sweet, juicy strawberries picked fresh daily.',
    price: 300,
    unit: 'punnet',
    availableQuantity: 30,
    totalQuantity: 50,
    images: ['https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400'],
    category: { id: 2, name: 'Fruits' },
    farmer: { id: 3, name: 'Peter Kimani', farmName: 'Berry Fields', location: 'Kinangop' },
    harvestDate: '2024-04-10',
    isOrganic: true,
    isPreorder: false,
    featured: true,
  },
  {
    id: 4,
    name: 'Irish Potatoes',
    description: 'High-quality Irish potatoes.',
    price: 100,
    unit: 'kg',
    availableQuantity: 1000,
    totalQuantity: 2000,
    images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400'],
    category: { id: 1, name: 'Vegetables' },
    farmer: { id: 2, name: 'Mary Wanjiku', farmName: 'Highlands Farm', location: 'Eldoret' },
    harvestDate: '2024-05-01',
    isOrganic: false,
    isPreorder: true,
    featured: false,
  },
  {
    id: 5,
    name: 'Fresh Avocados',
    description: 'Creamy, ripe avocados.',
    price: 200,
    unit: 'kg',
    availableQuantity: 150,
    totalQuantity: 300,
    images: ['https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400'],
    category: { id: 2, name: 'Fruits' },
    farmer: { id: 1, name: 'John Mwangi', farmName: 'Green Valley Farm', location: 'Nakuru' },
    harvestDate: '2024-04-25',
    isOrganic: true,
    isPreorder: true,
    featured: true,
  },
  {
    id: 6,
    name: 'Pure Honey',
    description: '100% pure, raw honey from our beehives.',
    price: 500,
    unit: '500ml',
    availableQuantity: 40,
    totalQuantity: 60,
    images: ['https://images.unsplash.com/photo-1587049352847-81a56d002c9d?auto=format&fit=crop&w=400'],
    category: { id: 5, name: 'Organic' },
    farmer: { id: 2, name: 'Mary Wanjiku', farmName: 'Highlands Farm', location: 'Eldoret' },
    harvestDate: '2024-04-30',
    isOrganic: true,
    isPreorder: false,
    featured: false,
  }
];

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
  const [useMockData, setUseMockData] = useState(false);

  const fetchProducts = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productApi.getAllProducts(params);
      setProducts(response.products || response);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(params.page || 1);
      setUseMockData(false);
    } catch (err) {
      // If in development and error is network error, use mock data silently
      if (import.meta.env.DEV && (err.code === 'ERR_NETWORK' || err.message === 'Network Error')) {
        console.log('ℹ️ Using mock products data');
        
        // Filter mock products based on params
        let filteredProducts = [...mockProducts];
        if (params.category) {
          filteredProducts = filteredProducts.filter(p => p.category.id === parseInt(params.category));
        }
        if (params.search) {
          filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(params.search.toLowerCase())
          );
        }
        if (params.minPrice) {
          filteredProducts = filteredProducts.filter(p => p.price >= parseInt(params.minPrice));
        }
        if (params.maxPrice) {
          filteredProducts = filteredProducts.filter(p => p.price <= parseInt(params.maxPrice));
        }
        
        setProducts(filteredProducts);
        setTotalPages(Math.ceil(filteredProducts.length / (params.limit || 12)));
        setUseMockData(true);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchFeaturedProducts = async () => {
    try {
      const data = await productApi.getFeaturedProducts();
      setFeaturedProducts(data.products || data);
    } catch (err) {
      // Use mock data silently in development
      if (import.meta.env.DEV && (err.code === 'ERR_NETWORK' || err.message === 'Network Error')) {
        console.log('ℹ️ Using mock featured products');
        setFeaturedProducts(mockProducts.filter(p => p.featured));
      } else {
        console.error('Error fetching featured products:', err);
      }
    }
  };

  const fetchNewProducts = async () => {
    try {
      const data = await productApi.getNewProducts();
      setNewProducts(data.products || data);
    } catch (err) {
      // Use mock data silently in development
      if (import.meta.env.DEV && (err.code === 'ERR_NETWORK' || err.message === 'Network Error')) {
        console.log('ℹ️ Using mock new products');
        setNewProducts(mockProducts);
      } else {
        console.error('Error fetching new products:', err);
      }
    }
  };

  const searchProducts = async (searchTerm, params = {}) => {
    setLoading(true);
    try {
      const response = await productApi.searchProducts(searchTerm, params);
      setProducts(response.products || response);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      // Use mock data silently in development
      if (import.meta.env.DEV && (err.code === 'ERR_NETWORK' || err.message === 'Network Error')) {
        console.log('ℹ️ Using mock search results');
        const filtered = mockProducts.filter(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setProducts(filtered);
        setTotalPages(Math.ceil(filtered.length / (params.limit || 12)));
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // Load featured and new products on mount
  useEffect(() => {
    fetchFeaturedProducts();
    fetchNewProducts();
  }, []);

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