import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import CategoryCard from '../components/category/CategoryCard';
import Button from '../components/ui/Button';
import Loader, { SkeletonLoader } from '../components/ui/Loader';
import { 
  IoArrowForward,
  IoSearch,
  IoLeaf
} from 'react-icons/io5';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { 
  GiFruitTree, 
  GiCarrot, 
  GiWheat, 
  GiCow,
  GiChicken,
  GiCorn,
  GiAppleSeeds,
  GiSunflower,
  GiPlantWatering,
  GiFarmer,
  GiHoneycomb,
  GiHerbsBundle,
  GiCoffeeBeans
} from 'react-icons/gi';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Header image for categories
const headerImage = "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1600";

// Gradient overlay for header images
const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

// Mock categories with icons - Using verified icons
const mockCategoriesWithIcons = [
  { 
    id: 1, 
    name: 'Vegetables', 
    icon: GiCarrot,
    image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c12e8c?auto=format&fit=crop&q=80&w=600',
    description: 'Fresh, organic vegetables directly from local farms',
    productCount: 25,
    color: 'green',
    slug: 'vegetables'
  },
  { 
    id: 2, 
    name: 'Fruits', 
    icon: GiFruitTree,
    image: 'https://images.unsplash.com/photo-1619566639371-57ce5024522c?auto=format&fit=crop&q=80&w=600',
    description: 'Seasonal fruits picked at peak ripeness',
    productCount: 18,
    color: 'yellow',
    slug: 'fruits'
  },
  { 
    id: 3, 
    name: 'Grains & Cereals', 
    icon: GiWheat,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=600',
    description: 'High-quality grains and cereals',
    productCount: 15,
    color: 'amber',
    slug: 'grains'
  },
  { 
    id: 4, 
    name: 'Dairy', 
    icon: GiCow,
    image: 'https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&q=80&w=600',
    description: 'Fresh dairy products from grass-fed cows',
    productCount: 12,
    color: 'blue',
    slug: 'dairy'
  },
  { 
    id: 5, 
    name: 'Livestock', 
    icon: GiChicken,
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=600',
    description: 'Healthy livestock and poultry',
    productCount: 8,
    color: 'orange',
    slug: 'livestock'
  },
  { 
    id: 6, 
    name: 'Seeds', 
    icon: GiAppleSeeds,
    image: 'https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&q=80&w=600',
    description: 'High-quality seeds for planting',
    productCount: 10,
    color: 'green',
    slug: 'seeds'
  },
  { 
    id: 7, 
    name: 'Organic', 
    icon: GiSunflower,
    image: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&q=80&w=600',
    description: 'Certified organic produce',
    productCount: 20,
    color: 'green',
    slug: 'organic'
  },
  { 
    id: 8, 
    name: 'Tools & Equipment', 
    icon: GiPlantWatering,
    image: 'https://images.unsplash.com/photo-1416870213587-7980fe336d74?auto=format&fit=crop&q=80&w=600',
    description: 'Farm tools and equipment',
    productCount: 15,
    color: 'gray',
    slug: 'tools'
  },
  { 
    id: 9, 
    name: 'Herbs & Spices', 
    icon: GiHerbsBundle,
    image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?auto=format&fit=crop&q=80&w=600',
    description: 'Fresh herbs and aromatic spices',
    productCount: 12,
    color: 'green',
    slug: 'herbs'
  },
  { 
    id: 10, 
    name: 'Nuts & Seeds', 
    icon: GiCorn,
    image: 'https://images.unsplash.com/photo-1542992015-5a3a5c4b6f1d?auto=format&fit=crop&q=80&w=600',
    description: 'Premium nuts and seeds',
    productCount: 10,
    color: 'amber',
    slug: 'nuts'
  },
  { 
    id: 11, 
    name: 'Beverages', 
    icon: GiCoffeeBeans,
    image: 'https://images.unsplash.com/photo-1542992015-5a3a5c4b6f1d?auto=format&fit=crop&q=80&w=600',
    description: 'Fresh juices and traditional beverages',
    productCount: 8,
    color: 'yellow',
    slug: 'beverages'
  },
  { 
    id: 12, 
    name: 'Honey & Bee Products', 
    icon: GiHoneycomb,
    image: 'https://images.unsplash.com/photo-1587049352847-81a56d002c9d?auto=format&fit=crop&q=80&w=600',
    description: 'Pure honey and bee products',
    productCount: 6,
    color: 'amber',
    slug: 'honey'
  },
];

const Categories = () => {
  const navigate = useNavigate();
  const { categories, loading } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [displayCount, setDisplayCount] = useState(8);
  
  const scrollRef = useRef(null);

  // Use mock data if API data is not available
  const displayCategories = categories.length > 0 
    ? categories.map((cat, index) => ({
        ...cat,
        icon: mockCategoriesWithIcons[index % mockCategoriesWithIcons.length]?.icon || GiCarrot,
        color: mockCategoriesWithIcons[index % mockCategoriesWithIcons.length]?.color || 'green',
        slug: cat.slug || cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')
      }))
    : mockCategoriesWithIcons;

  useEffect(() => {
    // Filter categories based on search
    if (searchTerm) {
      const filtered = displayCategories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(displayCategories);
    }
  }, [searchTerm, displayCategories]);

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

  const loadMore = () => {
    setDisplayCount(prev => prev + 4);
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/categories/${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-green-950">
      {/* Header Image Section */}
      <div className="relative w-full h-96 overflow-hidden">
        <img 
          src={headerImage}
          alt="Product Categories"
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${headerGradient}`}></div>
        
        {/* Header Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white" data-aos="fade-down">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">SHOP BY CATEGORY</h1>
            <p className="text-xl text-green-200 max-w-2xl px-4">
              Browse our wide selection of fresh produce and farm products
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Category Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-aos="fade-up">
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-3xl font-bold text-green-300">{displayCategories.length}+</div>
            <div className="text-xs text-green-200/70">Categories</div>
          </div>
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-3xl font-bold text-green-300">200+</div>
            <div className="text-xs text-green-200/70">Products</div>
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

        {/* Search Bar */}
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20 mb-8" data-aos="fade-up">
          <div className="relative">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-green-950/50 border border-green-700/50 rounded-xl text-white placeholder-green-300/50 focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
            <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" size={18} />
          </div>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkeletonLoader type="card" count={8} />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-green-900/30 backdrop-blur-sm rounded-3xl border border-green-400/20">
            <IoLeaf className="text-green-400 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">No Categories Found</h3>
            <p className="text-green-200 mb-6">Try adjusting your search term</p>
            <Button 
              variant="primary" 
              onClick={() => setSearchTerm('')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <>
            {/* First 4 categories in grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {filteredCategories.slice(0, 4).map((category, index) => (
                <div 
                  key={category.id}
                  className="cursor-pointer transform transition-all duration-500 hover:scale-105"
                  onClick={() => handleCategoryClick(category.id)}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>

            {/* Remaining categories */}
            {filteredCategories.length > 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCategories.slice(4).map((category, index) => (
                  <div 
                    key={category.id}
                    className="cursor-pointer transform transition-all duration-500 hover:scale-105"
                    onClick={() => handleCategoryClick(category.id)}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <CategoryCard category={category} />
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {displayCount < filteredCategories.length && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  className="border-2 border-green-400 text-green-300 hover:bg-green-800/30 px-8 py-3"
                >
                  Load More Categories
                </Button>
              </div>
            )}
          </>
        )}

        {/* Browse All Products CTA */}
        <div className="mt-12 text-center" data-aos="fade-up">
          <p className="text-green-200 mb-4">Can't find what you're looking for?</p>
          <Link to="/products">
            <Button variant="primary" size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
              BROWSE ALL PRODUCTS
              <IoArrowForward className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Categories;