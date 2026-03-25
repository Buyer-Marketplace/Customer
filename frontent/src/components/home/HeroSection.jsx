import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiTruck, FiSun } from 'react-icons/fi';
import { IoLeaf } from 'react-icons/io5';
import Typewriter from 'typewriter-effect';
import Button from '../ui/Button';
import { headerImages, typingPhrases } from '../../constants/homeConstants';

const HeroSection = () => {

  return (
    <div className="relative h-screen min-h-[800px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={headerImages.hero} 
          alt="Farm landscape" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-900/80 to-transparent"></div>
      </div>

      {/* Content */}
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
                    cursorClassName: "text-green-400",
                    delay: 30, // Faster typing
                    deleteSpeed: 20 // Faster deleting
                  }}
                />
              </span>
            </h1>
            
            <p className="mt-6 text-xl text-gray-200 max-w-2xl leading-relaxed">
              We connect local farmers directly to your table, ensuring unmatched freshness 
              and fair pricing for everyone involved.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-10">
              <Link to="/marketplace">
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

      {/* Scroll Indicator */}
      <div className="absolute -translate-x-1/2 left-1/2 bottom-8 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-green-500 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;