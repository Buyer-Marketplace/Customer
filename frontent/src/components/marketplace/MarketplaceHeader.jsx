import React from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const MarketplaceHeader = ({ title = "MARKETPLACE", subtitle = "Fresh from local farms - Buy directly from farmers" }) => {
  const headerImage = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1600";
  const headerGradient = "bg-gradient-to-b from-transparent via-green-950/30 to-green-950";

  return (
    <>
      <div className="relative w-full h-96 overflow-hidden">
        <img 
          src={headerImage}
          alt="Marketplace"
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${headerGradient}`}></div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white" data-aos="fade-down">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">{title}</h1>
            <p className="text-xl text-green-200 max-w-2xl px-4">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="mb-6" data-aos="fade-right">
          <Link to="/" className="inline-flex items-center text-green-300 hover:text-green-100 transition-colors">
            <IoArrowBack className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default MarketplaceHeader;