import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/ui/Button';
import Loader, { SkeletonLoader } from '../components/ui/Loader';
import { 
  IoCalendarOutline, 
  IoArrowForward,
  IoFilter,
  IoSearch,
  IoLeaf
} from 'react-icons/io5';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { GiPlantWatering, GiHarvest } from 'react-icons/gi';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Header image for pre-orders section
const headerImage = "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1600";

// Gradient overlay for header images
const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const PreOrders = () => {
  const { newProducts, loading } = useProducts();
  const [preOrderProducts, setPreOrderProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  
  const scrollRef = useRef(null);

  // Mock pre-order products (in real app, these would come from API)
  const mockPreOrders = [
    {
      id: 101,
      name: 'June Maize Harvest',
      description: 'Fresh maize from the June harvest. Pre-order now for guaranteed supply.',
      price: 120,
      unit: 'kg',
      availableQuantity: 1000,
      totalQuantity: 5000,
      images: ['https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400'],
      category: { id: 1, name: 'Grains' },
      farmer: { id: 2, name: 'Mary Wanjiku', farmName: 'Highlands Farm', location: 'Eldoret' },
      harvestDate: '2024-06-15',
      isOrganic: true,
      isPreorder: true,
      featured: false,
      preOrderDeadline: '2024-06-01',
      estimatedDelivery: '2024-06-20',
    },
    {
      id: 102,
      name: 'July Avocado Pre-Order',
      description: 'Creamy avocados from the July harvest. Limited pre-order slots available.',
      price: 250,
      unit: 'kg',
      availableQuantity: 500,
      totalQuantity: 2000,
      images: ['https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400'],
      category: { id: 2, name: 'Fruits' },
      farmer: { id: 1, name: 'John Mwangi', farmName: 'Green Valley Farm', location: 'Nakuru' },
      harvestDate: '2024-07-10',
      isOrganic: true,
      isPreorder: true,
      featured: true,
      preOrderDeadline: '2024-07-01',
      estimatedDelivery: '2024-07-15',
    },
    {
      id: 103,
      name: 'August Potato Harvest',
      description: 'High-quality Irish potatoes from the August harvest.',
      price: 90,
      unit: 'kg',
      availableQuantity: 2000,
      totalQuantity: 8000,
      images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400'],
      category: { id: 1, name: 'Vegetables' },
      farmer: { id: 2, name: 'Mary Wanjiku', farmName: 'Highlands Farm', location: 'Eldoret' },
      harvestDate: '2024-08-05',
      isOrganic: false,
      isPreorder: true,
      featured: false,
      preOrderDeadline: '2024-07-25',
      estimatedDelivery: '2024-08-10',
    },
    {
      id: 104,
      name: 'September Strawberries',
      description: 'Sweet strawberries from the September harvest. Pre-order now!',
      price: 350,
      unit: 'punnet',
      availableQuantity: 300,
      totalQuantity: 1000,
      images: ['https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400'],
      category: { id: 2, name: 'Fruits' },
      farmer: { id: 3, name: 'Peter Kimani', farmName: 'Berry Fields', location: 'Kinangop' },
      harvestDate: '2024-09-12',
      isOrganic: true,
      isPreorder: true,
      featured: true,
      preOrderDeadline: '2024-09-01',
      estimatedDelivery: '2024-09-18',
    },
    {
      id: 105,
      name: 'October Organic Tomatoes',
      description: 'Juicy organic tomatoes from the October harvest.',
      price: 180,
      unit: 'kg',
      availableQuantity: 800,
      totalQuantity: 3000,
      images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400'],
      category: { id: 1, name: 'Vegetables' },
      farmer: { id: 1, name: 'John Mwangi', farmName: 'Green Valley Farm', location: 'Nakuru' },
      harvestDate: '2024-10-08',
      isOrganic: true,
      isPreorder: true,
      featured: false,
      preOrderDeadline: '2024-09-28',
      estimatedDelivery: '2024-10-15',
    },
    {
      id: 106,
      name: 'November Oranges',
      description: 'Sweet oranges from the November harvest.',
      price: 150,
      unit: 'kg',
      availableQuantity: 1200,
      totalQuantity: 4000,
      images: ['https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?auto=format&fit=crop&w=400'],
      category: { id: 2, name: 'Fruits' },
      farmer: { id: 3, name: 'Peter Kimani', farmName: 'Berry Fields', location: 'Kinangop' },
      harvestDate: '2024-11-20',
      isOrganic: true,
      isPreorder: true,
      featured: false,
      preOrderDeadline: '2024-11-10',
      estimatedDelivery: '2024-11-25',
    },
  ];

  useEffect(() => {
    // In real app, fetch pre-order products from API
    // For now, use mock data and filter from newProducts if available
    if (newProducts.length > 0) {
      const preOrders = newProducts.filter(p => p.isPreorder);
      setPreOrderProducts(preOrders.length > 0 ? preOrders : mockPreOrders);
    } else {
      setPreOrderProducts(mockPreOrders);
    }
  }, [newProducts]);

  useEffect(() => {
    // Filter products based on search and month
    let filtered = [...preOrderProducts];
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(p => {
        const month = new Date(p.harvestDate).getMonth();
        return month === parseInt(selectedMonth);
      });
    }
    
    // Sort products
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(a.harvestDate) - new Date(b.harvestDate);
      } else if (sortBy === 'price-low') {
        return a.price - b.price;
      } else if (sortBy === 'price-high') {
        return b.price - a.price;
      }
      return 0;
    });
    
    setFilteredProducts(filtered);
  }, [preOrderProducts, searchTerm, selectedMonth, sortBy]);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
      easing: 'ease-out-cubic',
    });
  }, []);

  const scrollHorizontally = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const months = [
    { value: 'all', label: 'All Months' },
    { value: '5', label: 'June' },
    { value: '6', label: 'July' },
    { value: '7', label: 'August' },
    { value: '8', label: 'September' },
    { value: '9', label: 'October' },
    { value: '10', label: 'November' },
    { value: '11', label: 'December' },
  ];

  return (
    <div className="min-h-screen bg-green-950">
      {/* Header Image Section */}
      <div className="relative w-full h-96 overflow-hidden">
        <img 
          src={headerImage}
          alt="Pre-order harvests"
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${headerGradient}`}></div>
        
        {/* Header Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white" data-aos="fade-down">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">PRE-ORDER HARVESTS</h1>
            <p className="text-xl text-green-200 max-w-2xl px-4">
              Secure your share of upcoming harvests. Pre-order now and get the freshest produce directly from farmers.
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Featured Pre-Orders Banner */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 mb-12 border border-green-400/20" data-aos="fade-up">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-green-600/30 rounded-full flex items-center justify-center">
                <GiHarvest className="text-green-400 text-3xl" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Why Pre-Order?</h2>
                <p className="text-green-200">Guaranteed supply, best prices, direct from farm</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300">100%</div>
                <div className="text-xs text-green-200/70">Fresh Guarantee</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300">30+</div>
                <div className="text-xs text-green-200/70">Farm Partners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-300">15%</div>
                <div className="text-xs text-green-200/70">Pre-Order Savings</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20 mb-8" data-aos="fade-up">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search pre-order items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 bg-green-950/50 border border-green-700/50 rounded-xl text-white placeholder-green-300/50 focus:ring-2 focus:ring-green-400 focus:border-transparent"
              />
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" size={18} />
            </div>

            {/* Month Filter */}
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-3 bg-green-950/50 border border-green-700/50 rounded-xl text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
            >
              {months.map(month => (
                <option key={month.value} value={month.value} className="bg-green-900">
                  {month.label}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-green-950/50 border border-green-700/50 rounded-xl text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
            >
              <option value="date" className="bg-green-900">Sort by: Harvest Date</option>
              <option value="price-low" className="bg-green-900">Sort by: Price (Low to High)</option>
              <option value="price-high" className="bg-green-900">Sort by: Price (High to Low)</option>
            </select>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-3 bg-green-950/50 border border-green-700/50 rounded-xl text-white"
            >
              <IoFilter />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader type="card" count={6} />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-green-900/30 backdrop-blur-sm rounded-3xl border border-green-400/20">
            <GiPlantWatering className="text-green-400 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Pre-Orders Available</h3>
            <p className="text-green-200 mb-6">Check back soon for upcoming harvests</p>
            <Link to="/products">
              <Button variant="primary" className="bg-green-600 hover:bg-green-700">
                Browse Current Products
                <IoArrowForward className="ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* First 3 products in grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredProducts.slice(0, 3).map((product, index) => (
                <div 
                  key={product.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Remaining products in horizontal scroll */}
            {filteredProducts.length > 3 && (
              <div className="relative mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">More Pre-Order Items</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => scrollHorizontally('left')}
                      className="p-2 bg-green-800/80 backdrop-blur-md rounded-full hover:bg-green-700 transition-colors"
                    >
                      <FiChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button 
                      onClick={() => scrollHorizontally('right')}
                      className="p-2 bg-green-800/80 backdrop-blur-md rounded-full hover:bg-green-700 transition-colors"
                    >
                      <FiChevronRight className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
                <div 
                  ref={scrollRef}
                  className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {filteredProducts.slice(3).map((product, index) => (
                    <div 
                      key={product.id}
                      className="flex-shrink-0 w-72"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How Pre-Order Works Section */}
            <div className="mt-16 bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 border border-green-400/20" data-aos="fade-up">
              <h3 className="text-2xl font-bold text-white text-center mb-8">How Pre-Order Works</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-400">1</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Browse & Select</h4>
                  <p className="text-green-200 text-sm">Choose from upcoming harvests and select your quantity</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-400">2</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Secure Your Order</h4>
                  <p className="text-green-200 text-sm">Pay a deposit to secure your share of the harvest</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-400">3</span>
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">Receive Fresh Produce</h4>
                  <p className="text-green-200 text-sm">Get your fresh produce delivered on harvest day</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PreOrders;