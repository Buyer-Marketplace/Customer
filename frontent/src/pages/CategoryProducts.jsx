import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoryApi } from '../api/categoryApi';
import { productApi } from '../api/productApi';
import { mockCategories, mockDataUtils } from '../data/mockData'; // Import centralized mock data
import ProductCard from '../components/product/ProductCard';
import Pagination from '../components/ui/Pagination';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';
import { IoArrowBack, IoFilter, IoClose, IoLeaf } from 'react-icons/io5';
import { FiChevronDown } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Header image
const headerImage = "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1600";
const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const CategoryProducts = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [organicOnly, setOrganicOnly] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
    });
  }, []);

  useEffect(() => {
    fetchCategoryData();
  }, [id, currentPage, sort, priceRange.min, priceRange.max, organicOnly]);

  const fetchCategoryData = async () => {
    setLoading(true);
    try {
      // Fetch category details
      let categoryData;
      try {
        const response = await categoryApi.getCategoryById(id);
        categoryData = response.data || response;
      } catch (err) {
        console.log('Using mock category data');
        categoryData = mockCategories.find(c => c.id === parseInt(id)) || {
          id: parseInt(id),
          name: `Category ${id}`,
          description: 'Browse our selection of fresh products',
          image: headerImage,
          productCount: 0,
        };
      }
      setCategory(categoryData);

      // Build params
      const params = {
        page: currentPage,
        sort,
        limit: 12
      };
      
      if (priceRange.min) params.minPrice = priceRange.min;
      if (priceRange.max) params.maxPrice = priceRange.max;
      if (organicOnly) params.organic = true;

      // Fetch products for this category
      let productsData;
      try {
        productsData = await productApi.getProductsByCategory(id, params);
      } catch (err) {
        console.log('Using mock products data');
        // Get products from mockDataUtils
        const categoryProducts = mockDataUtils.getProductsByCategory(id);
        const filtered = mockDataUtils.filterProducts(categoryProducts, params);
        const paginated = mockDataUtils.paginateProducts(filtered, params.page, params.limit);
        productsData = paginated;
      }
      
      setProducts(productsData.products || []);
      setTotalPages(productsData.totalPages || 1);
      setTotalProducts(productsData.totalProducts || productsData.products?.length || 0);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'popular', label: 'Most Popular' },
  ];

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setPriceRange({ min: '', max: '' });
    setOrganicOnly(false);
    setSort('newest');
    setCurrentPage(1);
    setMobileFiltersOpen(false);
  };

  const activeFilterCount = [
    priceRange.min,
    priceRange.max,
    organicOnly ? 'organic' : null
  ].filter(Boolean).length;

  if (loading && !category) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-green-950 flex items-center justify-center">
        <div className="text-center bg-green-900/30 backdrop-blur-sm rounded-3xl p-12 border border-green-400/20">
          <IoLeaf className="text-green-400 text-6xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Category Not Found</h2>
          <p className="text-green-200 mb-4">The category you're looking for doesn't exist.</p>
          <Link to="/categories">
            <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white">
              Back to Categories
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-950">
      {/* Header Image Section */}
      <div className="relative w-full h-80 overflow-hidden">
        <img 
          src={category.image || headerImage}
          alt={category.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = headerImage;
          }}
        />
        <div className={`absolute inset-0 ${headerGradient}`}></div>
        
        {/* Header Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white" data-aos="fade-down">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{category.name}</h1>
            <p className="text-xl text-green-200 max-w-2xl px-4">
              {category.description || `Browse our selection of fresh ${category.name.toLowerCase()}`}
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <div className="mb-6" data-aos="fade-right">
          <Link to="/categories" className="inline-flex items-center text-green-300 hover:text-green-100 bg-green-950/50 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/20">
            <IoArrowBack className="mr-2" />
            Back to Categories
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-aos="fade-up">
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-3xl font-bold text-green-300">{totalProducts}</div>
            <div className="text-xs text-green-200/70">Products</div>
          </div>
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-3xl font-bold text-green-300">{totalPages}</div>
            <div className="text-xs text-green-200/70">Pages</div>
          </div>
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-3xl font-bold text-green-300">
              {products.filter(p => p.isOrganic).length}
            </div>
            <div className="text-xs text-green-200/70">Organic</div>
          </div>
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-3xl font-bold text-green-300">
              {products.filter(p => p.isPreorder).length}
            </div>
            <div className="text-xs text-green-200/70">Pre-order</div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20 mb-6" data-aos="fade-up">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <span className="text-green-200 font-medium">Sort by:</span>
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="px-4 py-2 bg-green-950/50 border border-green-700/50 rounded-xl text-white appearance-none focus:ring-2 focus:ring-green-400 focus:border-transparent cursor-pointer pr-10"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value} className="bg-green-900">
                      {option.label}
                    </option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden flex items-center px-4 py-2 bg-green-950/50 border border-green-700/50 rounded-xl text-white"
              >
                <IoFilter className="mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              <p className="text-green-200 hidden md:block">
                {products.length} products found
              </p>
            </div>
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:block mt-4 pt-4 border-t border-green-700/30">
            <div className="grid grid-cols-3 gap-4">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-green-200 mb-1">
                  Min Price (KES)
                </label>
                <input
                  type="number"
                  name="min"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={handlePriceChange}
                  className="w-full px-4 py-2 bg-green-950/50 border border-green-700/50 rounded-xl text-white placeholder-green-300/50 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-green-200 mb-1">
                  Max Price (KES)
                </label>
                <input
                  type="number"
                  name="max"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={handlePriceChange}
                  className="w-full px-4 py-2 bg-green-950/50 border border-green-700/50 rounded-xl text-white placeholder-green-300/50 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
              </div>

              {/* Organic Filter */}
              <div className="flex items-end pb-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={organicOnly}
                    onChange={(e) => setOrganicOnly(e.target.checked)}
                    className="rounded bg-green-950/50 border-green-700/50 text-green-400 focus:ring-green-400"
                  />
                  <span className="text-white">Organic Only</span>
                </label>
              </div>
            </div>

            {/* Clear Filters */}
            {(priceRange.min || priceRange.max || organicOnly) && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="text-sm text-green-300 hover:text-green-100 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
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
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-green-200 mb-2">
                    Price Range (KES)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="min"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={handlePriceChange}
                      className="w-1/2 px-4 py-3 bg-green-950/50 border border-green-700/50 rounded-xl text-white placeholder-green-300/50 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    />
                    <input
                      type="number"
                      name="max"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={handlePriceChange}
                      className="w-1/2 px-4 py-3 bg-green-950/50 border border-green-700/50 rounded-xl text-white placeholder-green-300/50 focus:ring-2 focus:ring-green-400 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Organic Filter */}
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={organicOnly}
                      onChange={(e) => setOrganicOnly(e.target.checked)}
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

        {/* Results Info (Mobile) */}
        <p className="text-green-200 md:hidden mb-4">
          {products.length} products found
        </p>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <div className="text-center py-12 bg-green-900/30 backdrop-blur-sm rounded-3xl p-12 border border-green-400/20" data-aos="fade-up">
            <IoLeaf className="text-green-400 text-6xl mx-auto mb-4" />
            <p className="text-green-200 text-lg mb-4">No products found in this category</p>
            {(priceRange.min || priceRange.max || organicOnly) && (
              <button
                onClick={clearFilters}
                className="text-green-300 hover:text-green-100"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <div key={product.id} data-aos="fade-up" data-aos-delay={index * 100}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8" data-aos="fade-up">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;