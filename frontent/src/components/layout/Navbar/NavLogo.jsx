import React from 'react';
import { Link } from 'react-router-dom';
import { IoLeaf } from 'react-icons/io5';

const NavLogo = () => {
  return (
    <Link 
      to="/" 
      className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 group hover:opacity-90 transition-opacity"
      aria-label="Go to homepage"
    >
      <div className="relative flex-shrink-0">
        <IoLeaf className="text-green-400 text-xl sm:text-2xl md:text-3xl lg:text-4xl group-hover:text-green-300 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110" />
        <div className="absolute inset-0 bg-green-400/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
      <div className="flex flex-col">
        <span className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-white group-hover:text-green-300 transition-colors leading-tight">
          AgriTrace
        </span>
        <span className="text-[8px] sm:text-[10px] md:text-xs text-green-500/70 group-hover:text-green-400/90 transition-colors -mt-0.5 hidden xs:block">
          Fresh from farm
        </span>
      </div>
    </Link>
  );
};

export default NavLogo;