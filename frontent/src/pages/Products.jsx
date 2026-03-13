import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import ProductCard from '../components/product/ProductCard';
import Pagination from '../components/ui/Pagination';
import Loader, { SkeletonLoader } from '../components/ui/Loader';
import Button from '../components/ui/Button';
import { 
  IoSearch, 
  IoFilter,
  IoLeaf,
  IoArrowBack,
  IoClose
} from 'react-icons/io5';
import { FiChevronDown } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Header image
const headerImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600";
const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
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
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

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
    setMobileFiltersOpen(false);
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
  ];

  const activeFilterCount = [
    filters.category,
    filters.search,
    filters.minPrice,
    filters.maxPrice,
    filters.organic ? 'organic' : null
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-green-950">
      {/* Header Image Section */}
      <div className="relative w-full h-80 overflow-hidden">
        <img 
          src={headerImage}
          alt="Fresh Products"
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${headerGradient}`}></div>
        
        {/* Header Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white" data-aos="fade-down">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">ALL PRODUCTS</h1>
            <p className="text-xl text-green-200 max-w-2xl px-4">
              Discover fresh produce directly from local farmers
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Breadcrumb */}
        <div className="mb-6" data-aos="fade-right">
          <Link to="/" className="inline-flex items-center text-green-300 hover:text-green-100">
            <IoArrowBack className="mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-aos="fade-up">
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-3xl font-bold text-green-300">{products.length}+</div>
            <div className="text-xs text-green-200/70">Products</div>
          </div>
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-3xl font-bold text-green-300">{categories.length}+</div>
            <div className="text-xs text-green-200/70">Categories</div>
          </div>
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-3xl font-bold text-green-300">50+</div>
            <div className="text-xs text-green-200/70">Farmers</div>
          </div>
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-3xl font-bold text-green-300">24/7</div>
            <div className="text-xs text-green-200/70">Fresh Supply</div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20 shadow-2xl mb-8" data-aos="fade-up">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search products..."
                  defaultValue={filters.search}
                  className="w-full px-4 py-3 pl-10 bg-green-950/50 border border-green-700/50 rounded-xl text-white placeholder-green-300/50 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
                <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" size={18} />
              </div>
            </form>

            {/* Sort Dropdown */}
            <div className="relative md:w-64">
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-4 py-3 bg-green-950/50 border border-green-700/50 rounded-xl text-white appearance-none focus:ring-2 focus:ring-green-400 focus:border-transparent cursor-pointer"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-green-900 text-white">
                    {option.label}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 pointer-events-none" size={18} />
            </div>

            {/* Filter Toggle Buttons */}
            <div className="flex gap-2">
              {/* Desktop Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="hidden md:flex items-center px-4 py-3 bg-green-950/50 border border-green-700/50 rounded-xl text-white hover:bg-green-900/50 transition-colors"
              >
                <IoFilter className="mr-2" size={18} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden flex items-center px-4 py-3 bg-green-950/50 border border-green-700/50 rounded-xl text-white"
              >
                <IoFilter className="mr-2" size={18} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-green-700/30">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-green-200 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-2 bg-green-950/50 border border-green-700/50 rounded-xl text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  >
                    <option value="" className="bg-green-900">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id} className="bg-green-900">
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-sm font-medium text-green-200 mb-1">
                    Min Price (KES)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="w-full px-4 py-2 bg-green-950/50 border border-green-700/50 rounded-xl text-white placeholder-green-300/50 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-sm font-medium text-green-200 mb-1">
                    Max Price (KES)
                  </label>
                  <input
                    type="number"
                    placeholder="Any"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="w-full px-4 py-2 bg-green-950/50 border border-green-700/50 rounded-xl text-white placeholder-green-300/50 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  />
                </div>

                {/* Organic Checkbox */}
                <div className="flex items-end pb-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.organic}
                      onChange={(e) => handleFilterChange('organic', e.target.checked)}
                      className="rounded bg-green-950/50 border-green-700/50 text-green-400 focus:ring-green-400"
                    />
                    <span className="text-white">Organic Only</span>
                  </label>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="text-sm text-green-300 hover:text-green-100 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Filters Modal */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)}></div>
            <div className="absolute right-0 top-0 h-full w-80 bg-green-950 p-6 overflow-y-auto border-l border-green-400/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <IoClose className="text-green-300 text-2xl" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-green-200 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full px-4 py-3 bg-green-950/50 border border-green-700/50 rounded-xl text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  >
                    <option value="" className="bg-green-900">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id} className="bg-green-900">
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-green-200 mb-2">
                    Price Range (KES)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      className="w-1/2 px-4 py-3 bg-green-950/50 border border-green-700/50 rounded-xl text-white placeholder-green-300/50 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      className="w-1/2 px-4 py-3 bg-green-950/50 border border-green-700/50 rounded-xl text-white placeholder-green-300/50 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Organic Filter */}
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.organic}
                      onChange={(e) => handleFilterChange('organic', e.target.checked)}
                      className="rounded bg-green-950/50 border-green-700/50 text-green-400 focus:ring-green-400"
                    />
                    <span className="text-white">Organic Only</span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => setMobileFiltersOpen(false)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="border-2 border-green-400 text-green-300 hover:bg-green-800/30"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6" data-aos="fade-up">
          <p className="text-green-200">
            Showing <span className="text-white font-semibold">{products.length}</span> products
            {filters.search && <span> for "<span className="text-white">{filters.search}</span>"</span>}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <SkeletonLoader type="card" count={8} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-green-900/30 backdrop-blur-sm rounded-3xl border border-green-400/20" data-aos="fade-up">
            <IoLeaf className="text-green-400 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Products Found</h3>
            <p className="text-green-200 mb-6">Try adjusting your search or filters</p>
            <Button 
              variant="primary" 
              onClick={clearFilters}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div 
                  key={product.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12" data-aos="fade-up">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => updateParams({ page })}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;