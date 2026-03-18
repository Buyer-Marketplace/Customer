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
import { FiPlay, FiPause } from 'react-icons/fi';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { headerImages, videoSources } from '../constants/homeConstants';

const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

const Categories = () => {
  const navigate = useNavigate();
  const { categories, loading, error, refreshCategories } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);
  
  // Video states
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      mirror: false,
      offset: 20,
      easing: 'ease-out',
    });
  }, []);

  // Video handling with multiple source fallback
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoError) return;

    const handleCanPlay = () => {
      setVideoLoaded(true);
      setVideoError(false);
      
      // Try to play
      video.play()
        .then(() => {
          setVideoPlaying(true);
        })
        .catch((err) => {
          console.log("Autoplay prevented:", err);
          setVideoPlaying(false);
        });
    };

    const handleError = () => {
      // Try next source if available
      if (currentSourceIndex < videoSources.categories.length - 1) {
        setCurrentSourceIndex(prev => prev + 1);
        setVideoLoaded(false);
      } else {
        setVideoError(true);
        setVideoPlaying(false);
        console.log("All video sources failed");
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);
    
    // Load the video
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
      video.pause();
    };
  }, [currentSourceIndex, videoError]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoError) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start loading video when visible
            setCurrentSourceIndex(0);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [videoError]);

  // Filter categories based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter(cat => 
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchTerm, categories]);

  const handleCategoryClick = (categoryId) => {
    navigate(`/categories/${categoryId}`);
  };

  const handleRetry = () => {
    refreshCategories();
  };

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

  const handleVideoError = () => {
    setVideoError(true);
    setVideoPlaying(false);
  };

  // Add categories video source if not already in your constants
  // You may need to add this to your videoSources object
  const categoriesVideoSources = videoSources.categories || videoSources.marketplace || videoSources.crops;

  return (
    <div className="min-h-screen bg-green-950">
      {/* Video Header Section */}
      <div ref={sectionRef} className="relative w-full h-80 md:h-96 overflow-hidden">
        {!videoError ? (
          <div className="absolute inset-0">
            {/* Show poster while loading */}
            {!videoLoaded && (
              <img 
                src={headerImages.categories} 
                alt="Categories" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                videoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              poster={headerImages.categories}
              onError={handleVideoError}
            >
              <source 
                src={categoriesVideoSources[currentSourceIndex]} 
                type="video/mp4" 
              />
            </video>
          </div>
        ) : (
          <img 
            src={headerImages.categories} 
            alt="Categories" 
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        
        <div className={`absolute inset-0 ${headerGradient}`}></div>

        {/* Play/Pause Button - only show when video is loaded */}
        {!videoError && videoLoaded && (
          <button
            onClick={toggleVideoPlay}
            className="absolute z-20 p-3 text-white transition-all border rounded-full bottom-6 right-6 bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/20"
            aria-label={videoPlaying ? 'Pause video' : 'Play video'}
          >
            {videoPlaying ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
          </button>
        )}
        
        {/* Header Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10" data-aos="fade-down">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">SHOP BY CATEGORY</h1>
            <p className="text-lg md:text-xl text-green-200 max-w-2xl px-4">
              Browse all available crops and produce
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-aos="fade-up">
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-2xl md:text-3xl font-bold text-green-300">{categories.length}</div>
            <div className="text-xs text-green-200/70">Categories</div>
          </div>
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-2xl md:text-3xl font-bold text-green-300">
              {categories.reduce((sum, cat) => sum + (cat.productCount || 0), 0)}+
            </div>
            <div className="text-xs text-green-200/70">Total Items</div>
          </div>
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-2xl md:text-3xl font-bold text-green-300">50+</div>
            <div className="text-xs text-green-200/70">Farmers</div>
          </div>
          <div className="bg-green-900/30 backdrop-blur-sm rounded-xl p-4 text-center border border-green-400/20">
            <div className="text-2xl md:text-3xl font-bold text-green-300">24/7</div>
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

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 backdrop-blur-sm rounded-3xl p-8 border border-red-400/20 text-center mb-8">
            <p className="text-red-200 mb-4">Failed to load categories.</p>
            <Button 
              variant="outline" 
              onClick={handleRetry}
              className="border-2 border-red-400 text-red-300 hover:bg-red-800/30"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            <p className="text-green-200 mb-6">
              Showing <span className="text-white font-semibold">{filteredCategories.length}</span> categories
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map((category, index) => (
                <div 
                  key={category.id}
                  className="cursor-pointer transform transition-all duration-300 hover:scale-105 will-change-transform"
                  onClick={() => handleCategoryClick(category.id)}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <CategoryCard category={category} />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Browse All Products CTA */}
        <div className="mt-12 text-center" data-aos="fade-up">
          <p className="text-green-200 mb-4">Want to see all available items?</p>
          <Link to="/marketplace">
            <Button variant="primary" size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
              BROWSE MARKETPLACE
              <IoArrowForward className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Categories;