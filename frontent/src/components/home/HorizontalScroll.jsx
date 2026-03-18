import React, { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const HorizontalScroll = ({ children, title, className = "" }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -scrollRef.current.clientWidth / 2 : scrollRef.current.clientWidth / 2;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className={`relative mt-8 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        {title && <h3 className="text-xl font-semibold text-white">{title}</h3>}
        <div className="flex gap-2">
          <button 
            onClick={() => scroll("left")}
            className="p-2 bg-green-800/80 backdrop-blur-md rounded-full hover:bg-green-700 transition-colors"
          >
            <FiChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button 
            onClick={() => scroll("right")}
            className="p-2 bg-green-800/80 backdrop-blur-md rounded-full hover:bg-green-700 transition-colors"
          >
            <FiChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
      >
        {children}
      </div>
    </div>
  );
};

export default HorizontalScroll;