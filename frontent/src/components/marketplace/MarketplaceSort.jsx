import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'harvest-earliest', label: 'Earliest Harvest' },
  { value: 'harvest-latest', label: 'Latest Harvest' },
  { value: 'most-available', label: 'Most Available' },
];

const MarketplaceSort = ({ value, onChange }) => {
  return (
    <div className="relative md:w-64 group">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-green-950/50 border border-green-700/50 rounded-xl text-white appearance-none focus:ring-2 focus:ring-green-400 focus:border-transparent cursor-pointer group-hover:border-green-500 transition-all"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value} className="bg-green-900">
            {option.label}
          </option>
        ))}
      </select>
      <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400 pointer-events-none group-hover:text-green-300 transition-colors" size={18} />
    </div>
  );
};

export default MarketplaceSort;