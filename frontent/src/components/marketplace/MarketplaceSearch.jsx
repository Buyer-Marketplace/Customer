import React, { useState, useEffect, useRef } from 'react';
import { IoSearch, IoClose } from 'react-icons/io5';

const MarketplaceSearch = ({ value, onChange, placeholder = "Search crops, farmers, regions..." }) => {
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
    onChange(e.target.value);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="flex-1 relative group">
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 pl-10 pr-10 bg-green-950/50 border border-green-700/50 rounded-xl text-white placeholder-green-300/50 focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all group-hover:border-green-500"
      />
      <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 group-hover:text-green-300 transition-colors" size={18} />
      
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-white transition-colors"
          aria-label="Clear search"
        >
          <IoClose size={18} />
        </button>
      )}
    </div>
  );
};

export default MarketplaceSearch;