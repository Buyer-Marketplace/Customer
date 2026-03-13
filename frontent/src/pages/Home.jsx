import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCategories } from "../hooks/useCategories";
import ProductCard from "../components/product/ProductCard";
import CategoryCard from "../components/category/CategoryCard";
import Button from "../components/ui/Button";
import Loader, { SkeletonLoader } from "../components/ui/Loader";
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiArrowRight,
  FiPlay,
  FiPause,
  FiStar,
  FiMapPin,
  FiTruck,
  FiShield,
  FiSun,
  FiDroplet,
  FiClock,
  FiAward
} from "react-icons/fi";
import { 
  IoArrowForward, 
  IoLeafOutline, 
  IoCalendarOutline,
  IoShieldCheckmarkOutline,
  IoFlashOutline,
  IoStar,
  IoTimeOutline,
  IoPeopleOutline,
  IoLeaf
} from 'react-icons/io5';
import { BsTruck, BsTree, BsFlower1, BsCloudSun, BsDroplet } from 'react-icons/bs';
import { GiFarmer, GiWheat, GiCorn, GiFruitTree, GiAppleSeeds, GiSunflower, GiPlantWatering } from 'react-icons/gi';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Typewriter from 'typewriter-effect';

// ========== AGRICULTURAL ASSETS - FIXED URLs ==========
const categoryHeaderImages = {
  hero: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1600", // Farm landscape
  trust: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1600", // Farmers working
  featured: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1600",
  categories: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1600",
  testimonials: "https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=1600",
  flashSale: "https://images.unsplash.com/photo-1488459711615-de62097c0060?auto=format&fit=crop&q=80&w=1600",
  trending: "https://images.unsplash.com/photo-1495570683178-9486ff200d68?auto=format&fit=crop&q=80&w=1600",
  justArrived: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=1600",
  cta: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600",
  // Additional working URLs for sections that were broken
  whyChoose: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1600", // Farmers in field
  preOrder: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1600", // Fresh harvest
};

// Agricultural Category Items - FIXED URLs
const categoryImages = {
  vegetables: "https://images.unsplash.com/photo-1566385101042-1a0aa0c12e8c?auto=format&fit=crop&q=60&w=600",
  fruits: "https://images.unsplash.com/photo-1619566639371-57ce5024522c?auto=format&fit=crop&q=60&w=600",
  grains: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=60&w=600",
  dairy: "https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?auto=format&fit=crop&q=60&w=600",
  livestock: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=60&w=600",
  seeds: "https://images.unsplash.com/photo-1512149177596-f817c7ef5d4c?auto=format&fit=crop&q=60&w=600",
  organic: "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&q=60&w=600",
  tools: "https://images.unsplash.com/photo-1416870213587-7980fe336d74?auto=format&fit=crop&q=60&w=600"
};

// Typing effect phrases
const typingPhrases = [
  'Organic Farm-to-Table',
  'Fresh Harvests Every Morning',
  'Empowering Local Growers',
  'Sustainable Farming Solutions',
  'Premium Quality Grains',
  '100% Traceable Produce',
  'Direct From The Source'
];

// Uniform dark green background for entire page
const pageBackground = "bg-green-950";

// Gradient overlay for header images - smooth blend into background
const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

// Mock Categories
const mockCategories = [
  { 
    id: 1, 
    name: 'Vegetables', 
    image: categoryImages.vegetables, 
    description: 'Fresh, organic vegetables directly from local farms',
    productCount: 25 
  },
  { 
    id: 2, 
    name: 'Fruits', 
    image: categoryImages.fruits, 
    description: 'Seasonal fruits picked at peak ripeness',
    productCount: 18 
  },
  { 
    id: 3, 
    name: 'Grains', 
    image: categoryImages.grains, 
    description: 'High-quality grains and cereals',
    productCount: 15 
  },
  { 
    id: 4, 
    name: 'Dairy', 
    image: categoryImages.dairy, 
    description: 'Fresh dairy products from grass-fed cows',
    productCount: 12 
  },
  { 
    id: 5, 
    name: 'Organic', 
    image: categoryImages.organic, 
    description: 'Certified organic produce',
    productCount: 20 
  },
  { 
    id: 6, 
    name: 'Seeds', 
    image: categoryImages.seeds, 
    description: 'High-quality seeds for planting',
    productCount: 8 
  },
];

// Mock Products
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

// Helper function to get category image
const getCategoryImage = (categoryName) => {
  const name = categoryName?.toLowerCase() || '';
  
  if (name.includes('veg')) return categoryImages.vegetables;
  if (name.includes('fruit')) return categoryImages.fruits;
  if (name.includes('grain') || name.includes('cereal')) return categoryImages.grains;
  if (name.includes('milk') || name.includes('dairy')) return categoryImages.dairy;
  if (name.includes('animal') || name.includes('meat')) return categoryImages.livestock;
  if (name.includes('seed')) return categoryImages.seeds;
  
  return categoryImages.organic;
};

// Counter Component
const Counter = ({ end, label, duration = 4, suffix = "+" }) => {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.3,
    delay: 100
  });

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-primary-400">
        {inView ? (
          <CountUp 
            end={end} 
            duration={duration} 
            delay={0.3}
            separator=","
            suffix={suffix}
            redraw={true}
          />
        ) : (
          `0${suffix}`
        )}
      </div>
      <div className="text-sm font-medium text-green-200 mt-2 tracking-wider">{label}</div>
    </div>
  );
};

const Home = () => {
  const navigate = useNavigate();
  const { featuredProducts, newProducts, fetchFeaturedProducts, fetchNewProducts, loading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  
  // Use mock data if API data is not available
  const displayCategories = categories.length > 0 ? categories : mockCategories;
  const displayFeaturedProducts = featuredProducts.length > 0 ? featuredProducts : mockProducts.filter(p => p.featured);
  const displayNewProducts = newProducts.length > 0 ? newProducts : mockProducts;
  
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  
  const categoryRef = useRef(null);
  const featuredRef = useRef(null);
  const newArrivalsRef = useRef(null);
  const videoRef = useRef(null);

  // Updated Trust stats with realistic values
  const trustStats = [
    { number: 500, label: "HAPPY CLIENTS", duration: 5, suffix: "+" },
    { number: 250, label: "LOCAL FARMERS", duration: 4.5, suffix: "+" },
    { number: 20, label: "COUNTIES SERVED", duration: 4, suffix: "+" },
    { number: 35, label: "ORGANIC PRODUCTS", duration: 5, suffix: "+" },
  ];

  // Testimonials with valid agricultural customer photos
  const testimonials = [
    {
      name: "John Mwangi",
      text: "The freshest produce I've ever bought! Direct from farmers, delivered to my doorstep within hours.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
      rating: 5,
      location: "Nairobi"
    },
    {
      name: "Mary Wanjiku",
      text: "I love being able to pre-order harvests. The quality is amazing and the prices are fair.",
      image: "https://images.unsplash.com/photo-1494790108777-766d1e6f9b8a?auto=format&fit=crop&w=200&h=200&q=80",
      rating: 5,
      location: "Kisumu"
    },
    {
      name: "Peter Kimani",
      text: "Agritrace Market has changed how I shop for food. Fresh, organic, and supporting local farmers.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
      rating: 5,
      location: "Mombasa"
    }
  ];

  useEffect(() => {
    fetchFeaturedProducts();
    fetchNewProducts();
  }, []);

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

  // Video Autoplay - FIXED with working video and proper error handling
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set video attributes
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    
    // Use a more reliable video source (Pexels agricultural video)
    video.src = "https://videos.pexels.com/video-files/2885232/2885232-uhd_2560_1440_25fps.mp4";
    video.load();
    
    const playVideo = async () => {
      try {
        await video.play();
        setVideoPlaying(true);
        setVideoError(false);
      } catch (err) {
        console.log("Video autoplay failed:", err);
        setVideoPlaying(false);
        setVideoError(true);
        
        // Try playing with user interaction
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            setVideoPlaying(false);
          });
        }
      }
    };

    // Small delay to ensure video is loaded
    setTimeout(playVideo, 100);

    const handleError = (e) => {
      console.log("Video error:", e);
      setVideoError(true);
      setVideoPlaying(false);
      
      // Fallback to a different video source
      video.src = "https://cdn.pixabay.com/video/2023/06/27/168979-842943392_large.mp4";
      video.load();
      playVideo();
    };

    video.addEventListener('error', handleError);
    video.addEventListener('loadeddata', playVideo);

    return () => {
      video.removeEventListener('error', handleError);
      video.removeEventListener('loadeddata', playVideo);
      video.pause();
      video.src = '';
      video.load();
    };
  }, []);

  const toggleVideoPlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play()
        .then(() => setVideoPlaying(true))
        .catch(err => console.log("Video play failed:", err));
    } else {
      video.pause();
      setVideoPlaying(false);
    }
  };

  const scrollHorizontally = (ref, direction) => {
    if (ref.current) {
      const container = ref.current;
      const scrollAmount = direction === "left" ? -container.clientWidth / 2 : container.clientWidth / 2;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className={`min-h-screen ${pageBackground}`}>
      {/* ========== HERO SECTION WITH VIDEO ========== */}
      <div className="relative h-screen min-h-[800px] overflow-hidden">
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster={categoryHeaderImages.hero}
          />
          
          {/* Gradient overlay for hero - dark at bottom fading to transparent */}
          <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-900/80 to-transparent"></div>
        </div>

        <button
          onClick={toggleVideoPlay}
          className="absolute z-20 p-4 text-white transition-all border rounded-full top-6 right-6 bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/20"
        >
          {videoPlaying ? <FiPause className="w-5 h-5" /> : <FiPlay className="w-5 h-5" />}
        </button>

        <div className="relative z-10 flex items-center h-full">
          <div className="w-full px-6 mx-auto max-w-7xl">
            <div className="max-w-4xl" data-aos="fade-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-green-600/20 backdrop-blur-sm rounded-full border border-green-400/30">
                <IoLeaf className="text-green-400" size={20} />
                <span className="text-green-100 text-sm font-medium">Farm Direct • 100% Organic</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
                Fresh From Farm
                <span className="block text-4xl md:text-6xl text-green-300 mt-2">
                  <Typewriter
                    options={{
                      strings: typingPhrases,
                      autoStart: true,
                      loop: true,
                      wrapperClassName: "font-extrabold",
                      cursorClassName: "text-primary-400"
                    }}
                  />
                </span>
              </h1>
              
              <p className="mt-6 text-xl text-gray-200 max-w-2xl leading-relaxed">
                We connect local farmers directly to your table, ensuring unmatched freshness 
                and fair pricing for everyone involved.
              </p>
              
              <div className="flex flex-wrap gap-4 mt-10">
                <Link to="/products">
                  <Button variant="primary" size="lg" className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30">
                    START EXPLORING
                    <FiArrowRight className="ml-2" />
                  </Button>
                </Link>
              </div>

              <div className="flex gap-6 mt-12">
                <div className="flex items-center gap-2">
                  <FiShield className="text-green-400" />
                  <span className="text-sm text-gray-300">Quality Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiTruck className="text-green-400" />
                  <span className="text-sm text-gray-300">Free Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiSun className="text-green-400" />
                  <span className="text-sm text-gray-300">Farm Fresh</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -translate-x-1/2 left-1/2 bottom-8 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-green-500 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* ========== TRUST STATS SECTION ========== */}
      <section className="py-20">
        {/* Header Image for this section */}
        <div className="relative w-full h-64 md:h-96 mb-12 overflow-hidden">
          <img 
            src={categoryHeaderImages.trust}
            alt="Farmers working in field"
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1600";
            }}
          />
          {/* Gradient overlay to blend into background */}
          <div className={`absolute inset-0 ${headerGradient}`}></div>
        </div>
        
        <div className="container-custom">
          <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-12 border border-green-400/20 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16" data-aos="fade-down">
              TRUSTED BY FARMERS & CUSTOMERS
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {trustStats.map((stat, index) => (
                <div key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                  <Counter 
                    end={stat.number} 
                    label={stat.label} 
                    duration={stat.duration}
                    suffix={stat.suffix}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURED PRODUCTS SECTION ========== */}
      <section className="py-20">
        {/* Header Image for this section */}
        <div className="relative w-full h-64 md:h-96 mb-12 overflow-hidden">
          <img 
            src={categoryHeaderImages.featured}
            alt="Fresh vegetables at market"
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1600";
            }}
          />
          {/* Gradient overlay to blend into background */}
          <div className={`absolute inset-0 ${headerGradient}`}></div>
        </div>
        
        <div className="container-custom">
          <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-green-400/20 shadow-2xl">
            <div className="text-center mb-12" data-aos="fade-down">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">FEATURED CROPS</h2>
              <p className="text-green-200 text-lg">Fresh from our partner farms</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SkeletonLoader type="card" count={4} />
              </div>
            ) : (
              <>
                {/* First 3 products in grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {displayFeaturedProducts.slice(0, 3).map((product, index) => (
                    <div 
                      key={product.id} 
                      className="cursor-pointer transform transition-all duration-500 hover:scale-105"
                      onClick={() => navigate(`/products/${product.id}`)}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Remaining products in horizontal scroll */}
                {displayFeaturedProducts.length > 3 && (
                  <div className="relative mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">More Featured Items</h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => scrollHorizontally(featuredRef, "left")}
                          className="p-2 bg-green-800/80 backdrop-blur-md rounded-full hover:bg-green-700 transition-colors"
                          aria-label="Scroll left"
                        >
                          <FiChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <button 
                          onClick={() => scrollHorizontally(featuredRef, "right")}
                          className="p-2 bg-green-800/80 backdrop-blur-md rounded-full hover:bg-green-700 transition-colors"
                          aria-label="Scroll right"
                        >
                          <FiChevronRight className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                    <div 
                      ref={featuredRef}
                      className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      {displayFeaturedProducts.slice(3).map((product, index) => (
                        <div 
                          key={product.id}
                          className="flex-shrink-0 w-72 cursor-pointer transform transition-all duration-500 hover:scale-105"
                          onClick={() => navigate(`/products/${product.id}`)}
                        >
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ========== HARVEST PREVIEW / PRE-ORDER SECTION ========== */}
      <section className="py-20">
        {/* Header Image for this section */}
        <div className="relative w-full h-64 md:h-96 mb-12 overflow-hidden">
          <img 
            src={categoryHeaderImages.preOrder}
            alt="Farmers harvesting crops"
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1600";
            }}
          />
          {/* Gradient overlay to blend into background */}
          <div className={`absolute inset-0 ${headerGradient}`}></div>
        </div>
        
        <div className="container-custom">
          <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-green-400/20 shadow-2xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div data-aos="fade-right">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">PRE-ORDER FUTURE HARVESTS</h2>
                <p className="text-lg text-green-200 mb-8 leading-relaxed">
                  Secure your share of upcoming harvests. Pre-order now and get the freshest produce 
                  directly from farmers on harvest day.
                </p>
                <Link to="/preorders">
                  <Button variant="primary" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                    EXPLORE PRE-ORDERS
                    <IoArrowForward className="ml-2" />
                  </Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4" data-aos="fade-left">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-green-400/30">
                  <IoCalendarOutline className="text-green-400 text-3xl mb-2" />
                  <h3 className="text-white font-semibold">Seasonal Planning</h3>
                  <p className="text-green-200 text-sm">Plan your purchases</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-green-400/30">
                  <GiPlantWatering className="text-green-400 text-3xl mb-2" />
                  <h3 className="text-white font-semibold">Fresh Harvest</h3>
                  <p className="text-green-200 text-sm">Straight from farm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== NEW ARRIVALS SECTION ========== */}
      <section className="py-20">
        {/* Header Image for this section */}
        <div className="relative w-full h-64 md:h-96 mb-12 overflow-hidden">
          <img 
            src={categoryHeaderImages.justArrived}
            alt="Freshly harvested produce"
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=1600";
            }}
          />
          {/* Gradient overlay to blend into background */}
          <div className={`absolute inset-0 ${headerGradient}`}></div>
        </div>
        
        <div className="container-custom">
          <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-green-400/20 shadow-2xl">
            <div className="text-center mb-12" data-aos="fade-down">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">JUST HARVESTED</h2>
              <p className="text-green-200 text-lg">Fresh from the fields this week</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SkeletonLoader type="card" count={4} />
              </div>
            ) : (
              <>
                {/* First 3 products in grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {displayNewProducts.slice(0, 3).map((product, index) => (
                    <div 
                      key={product.id}
                      className="cursor-pointer transform transition-all duration-500 hover:scale-105"
                      onClick={() => navigate(`/products/${product.id}`)}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Remaining products in horizontal scroll */}
                {displayNewProducts.length > 3 && (
                  <div className="relative mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white">More Fresh Items</h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => scrollHorizontally(newArrivalsRef, "left")}
                          className="p-2 bg-green-800/80 backdrop-blur-md rounded-full hover:bg-green-700 transition-colors"
                          aria-label="Scroll left"
                        >
                          <FiChevronLeft className="w-5 h-5 text-white" />
                        </button>
                        <button 
                          onClick={() => scrollHorizontally(newArrivalsRef, "right")}
                          className="p-2 bg-green-800/80 backdrop-blur-md rounded-full hover:bg-green-700 transition-colors"
                          aria-label="Scroll right"
                        >
                          <FiChevronRight className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                    <div 
                      ref={newArrivalsRef}
                      className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      {displayNewProducts.slice(3).map((product, index) => (
                        <div 
                          key={product.id}
                          className="flex-shrink-0 w-72 cursor-pointer transform transition-all duration-500 hover:scale-105"
                          onClick={() => navigate(`/products/${product.id}`)}
                        >
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES SECTION ========== */}
      <section className="py-20">
        {/* Header Image for this section */}
        <div className="relative w-full h-64 md:h-96 mb-12 overflow-hidden">
          <img 
            src={categoryHeaderImages.categories}
            alt="Fresh produce categories"
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=1600";
            }}
          />
          {/* Gradient overlay to blend into background */}
          <div className={`absolute inset-0 ${headerGradient}`}></div>
        </div>
        
        <div className="container-custom">
          <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-green-400/20 shadow-2xl">
            <div className="text-center mb-12" data-aos="fade-down">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">SHOP BY CATEGORY</h2>
              <p className="text-green-200 text-lg">Browse our wide selection</p>
            </div>
            
            {categoriesLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <SkeletonLoader type="card" count={6} />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                  {displayCategories.slice(0, 6).map((category, index) => (
                    <div 
                      key={category.id}
                      className="cursor-pointer transform transition-all duration-500 hover:scale-105"
                      onClick={() => navigate(`/categories/${category.id}`)}
                      data-aos="fade-up"
                      data-aos-delay={index * 50}
                    >
                      <CategoryCard category={category} />
                    </div>
                  ))}
                </div>

                {displayCategories.length > 6 && (
                  <div className="relative mt-8">
                    <h3 className="text-xl font-semibold text-white mb-4">More Categories</h3>
                    <div className="relative group">
                      <div 
                        ref={categoryRef}
                        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
                        style={{ scrollBehavior: 'smooth' }}
                      >
                        {displayCategories.slice(6).map((category, index) => (
                          <div 
                            key={category.id}
                            className="flex-shrink-0 w-48 cursor-pointer transform transition-all duration-500 hover:scale-105"
                            onClick={() => navigate(`/categories/${category.id}`)}
                          >
                            <CategoryCard category={category} />
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => scrollHorizontally(categoryRef, "left")}
                        className="absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-green-800/80 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-700"
                      >
                        <FiChevronLeft className="w-6 h-6 text-white" />
                      </button>
                      <button 
                        onClick={() => scrollHorizontally(categoryRef, "right")}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-green-800/80 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-700"
                      >
                        <FiChevronRight className="w-6 h-6 text-white" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
            
            <div className="text-center mt-12">
              <Link to="/categories">
                <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-3">
                  VIEW ALL CATEGORIES
                  <FiArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES / WHY CHOOSE AGRITRACE MARKET SECTION ========== */}
      <section className="py-20">
        {/* Header Image for this section */}
        <div className="relative w-full h-64 md:h-96 mb-12 overflow-hidden">
          <img 
            src={categoryHeaderImages.whyChoose}
            alt="Organic farming landscape"
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1600";
            }}
          />
          {/* Gradient overlay to blend into background */}
          <div className={`absolute inset-0 ${headerGradient}`}></div>
        </div>
        
        <div className="container-custom">
          <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-green-400/20 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16" data-aos="fade-down">
              WHY CHOOSE AGRITRACE MARKET
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: GiFarmer,
                  title: 'Direct from Farmers',
                  description: 'No middlemen. Get fresh produce directly from local farmers at fair prices.',
                },
                {
                  icon: IoCalendarOutline,
                  title: 'Pre-Order Future Harvest',
                  description: 'Secure your share of upcoming harvests with our pre-order system.',
                },
                {
                  icon: BsTruck,
                  title: 'Free Delivery',
                  description: 'Free delivery on orders over KES 2,000. Freshness guaranteed.',
                }
              ].map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-green-400/30 text-center hover:bg-white/20 transition-all duration-500 hover:-translate-y-2"
                    data-aos="fade-up"
                    data-aos-delay={index * 150}
                  >
                    <div className="w-20 h-20 bg-green-600/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Icon className="text-green-400 text-4xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-green-200">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========== HARVEST CALENDAR SECTION ========== */}
      <section className="py-20">
        {/* Header Image for this section */}
        <div className="relative w-full h-64 md:h-96 mb-12 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1523741543316-32c162c9e05c?auto=format&fit=crop&q=80&w=1600"
            alt="Seasonal harvest calendar"
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1600";
            }}
          />
          {/* Gradient overlay to blend into background */}
          <div className={`absolute inset-0 ${headerGradient}`}></div>
        </div>
        
        <div className="container-custom">
          <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-green-400/20 shadow-2xl">
            <div className="text-center mb-12" data-aos="fade-down">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">HARVEST CALENDAR</h2>
              <p className="text-green-200 text-lg">Plan your purchases with our seasonal harvest guide</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Current Season */}
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-green-400/30" data-aos="fade-right">
                <div className="flex items-center gap-3 mb-4">
                  <IoCalendarOutline className="text-green-400 text-3xl" />
                  <h3 className="text-xl font-semibold text-white">Current Season</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-green-200">Maize</span>
                    <span className="text-green-400 text-sm bg-green-800/30 px-3 py-1 rounded-full">In Season</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-200">Beans</span>
                    <span className="text-green-400 text-sm bg-green-800/30 px-3 py-1 rounded-full">In Season</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-200">Tomatoes</span>
                    <span className="text-yellow-400 text-sm bg-yellow-800/30 px-3 py-1 rounded-full">Coming Soon</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-200">Strawberries</span>
                    <span className="text-green-400 text-sm bg-green-800/30 px-3 py-1 rounded-full">In Season</span>
                  </div>
                </div>
              </div>

              {/* Upcoming Harvests */}
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-green-400/30" data-aos="fade-left">
                <div className="flex items-center gap-3 mb-4">
                  <IoTimeOutline className="text-green-400 text-3xl" />
                  <h3 className="text-xl font-semibold text-white">Upcoming Harvests</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-green-200">Avocados</span>
                    <span className="text-yellow-400 text-sm">2 weeks</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-200">Oranges</span>
                    <span className="text-yellow-400 text-sm">3 weeks</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-200">Potatoes</span>
                    <span className="text-yellow-400 text-sm">1 month</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-200">Apples</span>
                    <span className="text-yellow-400 text-sm">2 months</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Calendar Preview */}
            <div className="mb-12" data-aos="fade-up">
              <h3 className="text-xl font-semibold text-white mb-6 text-center">Monthly Harvest Guide</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { month: 'Jan', crops: 'Kale, Spinach' },
                  { month: 'Feb', crops: 'Tomatoes, Peppers' },
                  { month: 'Mar', crops: 'Maize, Beans' },
                  { month: 'Apr', crops: 'Strawberries' },
                  { month: 'May', crops: 'Potatoes' },
                  { month: 'Jun', crops: 'Avocados' },
                  { month: 'Jul', crops: 'Oranges' },
                  { month: 'Aug', crops: 'Apples' },
                ].map((item, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-green-400/20 text-center">
                    <div className="text-green-400 font-bold mb-1">{item.month}</div>
                    <div className="text-xs text-green-200/70">{item.crops}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center" data-aos="fade-up">
              <Link to="/harvest-calendar">
                <Button variant="primary" size="lg" className="bg-green-600 hover:bg-green-700 text-white px-10 py-4 text-lg">
                  VIEW FULL CALENDAR
                  <IoArrowForward className="ml-2" />
                </Button>
              </Link>
              <p className="text-green-300/50 text-sm mt-4">
                Plan ahead and never miss a fresh harvest
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS SECTION ========== */}
      <section className="py-20">
        {/* Header Image for this section */}
        <div className="relative w-full h-64 md:h-96 mb-12 overflow-hidden">
          <img 
            src={categoryHeaderImages.testimonials}
            alt="Happy customers at market"
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=1600";
            }}
          />
          {/* Gradient overlay to blend into background */}
          <div className={`absolute inset-0 ${headerGradient}`}></div>
        </div>
        
        <div className="container-custom">
          <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-green-400/20 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16" data-aos="fade-down">
              WHAT OUR CUSTOMERS SAY
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-green-400/30 hover:bg-white/20 transition-all duration-500 hover:-translate-y-2"
                  data-aos="fade-up"
                  data-aos-delay={index * 150}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-green-400"
                      loading="lazy"
                    />
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="flex items-center gap-1 text-sm text-green-300">
                        <FiMapPin className="w-3 h-3" />
                        {testimonial.location}
                      </div>
                    </div>
                  </div>
                  <p className="text-green-100 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FiStar key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-500'}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;