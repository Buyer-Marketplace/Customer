import React, { useState } from 'react';
import { IoChevronLeft, IoChevronRight } from 'react-icons/io5';

const CropGallery = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const defaultImages = ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800'];
  const displayImages = images.length > 0 ? images : defaultImages;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="relative">
      <div className="aspect-square rounded-2xl overflow-hidden">
        <img
          src={displayImages[currentIndex]}
          alt={`Crop ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
      
      {displayImages.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-green-950/80 backdrop-blur-sm rounded-full hover:bg-green-900 transition-colors border border-green-400/30"
          >
            <IoChevronLeft className="text-white" size={20} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-green-950/80 backdrop-blur-sm rounded-full hover:bg-green-900 transition-colors border border-green-400/30"
          >
            <IoChevronRight className="text-white" size={20} />
          </button>
          
          <div className="flex justify-center mt-4 gap-2">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-green-400' : 'bg-green-700'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CropGallery;