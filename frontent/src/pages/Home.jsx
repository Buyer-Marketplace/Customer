import React, { useEffect, useState } from 'react';
import {
  HeroSection,
  TrustStats,
  FeaturedCrops,
  NewArrivals,
  FeaturesSection,
  Testimonials
} from '../components/home';
import AOS from 'aos';
import 'aos/dist/aos.css';

const pageBackground = "bg-green-950";

const Home = () => {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Preload critical images
  useEffect(() => {
    const criticalImages = [
      'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=1600',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1600'
    ];
    
    Promise.all(
      criticalImages.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = resolve;
          img.onerror = resolve;
        });
      })
    ).then(() => {
      setImagesLoaded(true);
    });

    const timeout = setTimeout(() => setImagesLoaded(true), 2000);
    return () => clearTimeout(timeout);
  }, []);

  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
      easing: 'ease-out-cubic',
    });
  }, []);

  // Show minimal loader while critical images load
  if (!imagesLoaded) {
    return (
      <div className={`min-h-screen ${pageBackground} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-green-200 text-sm">Loading fresh harvest...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${pageBackground}`}>
      {/* CSS for scrollbar hiding */}
      <style>
        {`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
      </style>

      {/* Hero Section */}
      <HeroSection />
      
      {/* Trust Stats */}
      <TrustStats />
      
      {/* Featured Crops */}
      <FeaturedCrops />
      

      
      {/* Testimonials */}
      <Testimonials />
    </div>
  );
};

export default Home;