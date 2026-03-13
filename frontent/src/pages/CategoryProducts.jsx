import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { categoryApi } from '../api/categoryApi';
import { productApi } from '../api/productApi';
import ProductCard from '../components/product/ProductCard';
import Pagination from '../components/ui/Pagination';
import Loader from '../components/ui/Loader';
import { IoArrowBack, IoFilter } from 'react-icons/io5';

const CategoryProducts = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [organicOnly, setOrganicOnly] = useState(false);

  useEffect(() => {
    fetchCategoryData();
  }, [id, currentPage, sort, priceRange.min, priceRange.max, organicOnly]);

  const fetchCategoryData = async () => {
    setLoading(true);
    try {
      // Fetch category details
      const categoryData = await categoryApi.getCategoryById(id);
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
      const productsData = await productApi.getProductsByCategory(id, params);
      setProducts(productsData.products || []);
      setTotalPages(productsData.totalPages || 1);
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
  };

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
          <h2 className="text-2xl font-bold text-white mb-2">Category Not Found</h2>
          <p className="text-green-200 mb-4">The category you're looking for doesn't exist.</p>
          <Link to="/categories" className="text-green-300 hover:text-green-100">
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-950 py-8">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/categories" className="inline-flex items-center text-green-300 hover:text-green-100">
            <IoArrowBack className="mr-2" />
            Back to Categories
          </Link>
        </div>

        {/* Category Header */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl overflow-hidden mb-8 border border-green-400/20">
          <div className="relative h-64">
            <img
              src={category.image || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1200'}
              alt={category.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-900/80 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h1 className="text-4xl font-bold text-white mb-2">{category.name}</h1>
              {category.description && (
                <p className="text-lg text-green-200">{category.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <span className="text-green-200 font-medium">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-2 bg-green-950/50 border border-green-700/50 rounded-xl text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value} className="bg-green-900">
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center px-4 py-2 bg-green-950/50 border border-green-700/50 rounded-xl text-white"
            >
              <IoFilter className="mr-2" />
              Filters
            </button>

            <p className="text-green-200">
              {products.length} products found
            </p>
          </div>

          {/* Filters */}
          <div className={`mt-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={organicOnly}
                    onChange={(e) => setOrganicOnly(e.target.checked)}
                    className="rounded bg-green-950/50 border-green-700/50 text-green-400 focus:ring-green-400"
                  />
                  <span className="text-green-200">Organic Only</span>
                </label>
              </div>
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
          <div className="text-center py-12 bg-green-900/30 backdrop-blur-sm rounded-3xl p-12 border border-green-400/20">
            <p className="text-green-200 text-lg mb-4">No products found in this category</p>
            <button
              onClick={clearFilters}
              className="text-green-300 hover:text-green-100"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;