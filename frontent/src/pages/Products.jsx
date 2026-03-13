import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import ProductCard from '../components/product/ProductCard';
import Pagination from '../components/ui/Pagination';
import Loader from '../components/ui/Loader';
import { IoSearch, IoFilter } from 'react-icons/io5';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'newest',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    organic: searchParams.get('organic') === 'true',
  });

  const { products, loading, totalPages, currentPage, updateParams } = useProducts({
    page: 1,
    ...filters,
  });

  const { categories } = useCategories();

  useEffect(() => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.search) params.search = filters.search;
    if (filters.sort) params.sort = filters.sort;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.organic) params.organic = filters.organic;
    
    setSearchParams(params);
    updateParams({ page: 1, ...params });
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    handleFilterChange('search', formData.get('search'));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      sort: 'newest',
      minPrice: '',
      maxPrice: '',
      organic: false,
    });
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
  ];

  return (
    <div className="min-h-screen bg-green-950">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">All Products</h1>
          <p className="text-green-200 mt-2">
            Discover fresh produce from local farmers
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20 shadow-2xl mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search products..."
                  defaultValue={filters.search}
                  className="w-full px-4 py-3 pl-10 bg-white/10 border border-green-400/30 rounded-xl text-white placeholder-green-300/70 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
                <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-300" />
              </div>
            </form>

            {/* Sort Dropdown */}
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="px-4 py-3 bg-white/10 border border-green-400/30 rounded-xl text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value} className="bg-green-900 text-white">
                  {option.label}
                </option>
              ))}
            </select>

            {/* Filter Toggle Button (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center px-4 py-3 bg-white/10 border border-green-400/30 rounded-xl text-white"
            >
              <IoFilter className="mr-2" />
              Filters
            </button>
          </div>

          {/* Filters */}
          <div className={`mt-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="px-4 py-3 bg-white/10 border border-green-400/30 rounded-xl text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
              >
                <option value="" className="bg-green-900">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id} className="bg-green-900">
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Min Price */}
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="px-4 py-3 bg-white/10 border border-green-400/30 rounded-xl text-white placeholder-green-300/70 focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />

              {/* Max Price */}
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="px-4 py-3 bg-white/10 border border-green-400/30 rounded-xl text-white placeholder-green-300/70 focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />

              {/* Organic Checkbox */}
              <label className="flex items-center space-x-2 text-white">
                <input
                  type="checkbox"
                  checked={filters.organic}
                  onChange={(e) => handleFilterChange('organic', e.target.checked)}
                  className="rounded text-green-400 focus:ring-green-400 bg-white/10 border-green-400/30"
                />
                <span>Organic Only</span>
              </label>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="mt-4 text-sm text-green-300 hover:text-green-100"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-green-900/30 rounded-xl p-4 border border-green-400/20 animate-pulse">
                <div className="h-48 bg-green-800/50 rounded-lg mb-4"></div>
                <div className="h-4 bg-green-800/50 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-green-800/50 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-green-800/50 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-green-900/30 backdrop-blur-sm rounded-3xl p-12 border border-green-400/20">
            <p className="text-green-200 text-lg">No products found</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-green-300 hover:text-green-100"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => updateParams({ page })}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Products;