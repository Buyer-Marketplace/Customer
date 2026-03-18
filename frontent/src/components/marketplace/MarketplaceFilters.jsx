import React, { useState } from 'react';
import { IoFilter, IoClose } from 'react-icons/io5';
import Button from '../ui/Button';

const MarketplaceFilters = ({ 
  crops, 
  selectedCrop, 
  onCropChange, 
  onClear,
  priceRange,
  onPriceChange,
  selectedRegion,
  onRegionChange,
  regions,
  showOrganic,
  onOrganicChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeFilterCount = [
    selectedCrop !== 'all' ? 1 : 0,
    priceRange?.min > 0 || priceRange?.max < 100000 ? 1 : 0,
    selectedRegion ? 1 : 0,
    showOrganic ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden md:block mt-6 pt-6 border-t border-green-700/30">
        <div className="grid grid-cols-4 gap-6">
          {/* Crop Filter */}
          <div>
            <label className="block text-sm font-medium text-green-200 mb-2">
              Crop Type
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => onCropChange(e.target.value)}
              className="w-full px-3 py-2 bg-green-950/50 border border-green-700/50 rounded-lg text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
            >
              <option value="all" className="bg-green-900">All Crops</option>
              {crops.map(crop => (
                <option key={crop.id} value={crop.crop_name} className="bg-green-900">
                  {crop.crop_name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-green-200 mb-2">
              Price Range (KES/kg)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={priceRange?.min || ''}
                onChange={(e) => onPriceChange('min', e.target.value)}
                className="w-full px-3 py-2 bg-green-950/50 border border-green-700/50 rounded-lg text-white placeholder-green-300/50 focus:ring-2 focus:ring-green-400"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange?.max || ''}
                onChange={(e) => onPriceChange('max', e.target.value)}
                className="w-full px-3 py-2 bg-green-950/50 border border-green-700/50 rounded-lg text-white placeholder-green-300/50 focus:ring-2 focus:ring-green-400"
              />
            </div>
          </div>

          {/* Region Filter */}
          <div>
            <label className="block text-sm font-medium text-green-200 mb-2">
              Region
            </label>
            <select
              value={selectedRegion || ''}
              onChange={(e) => onRegionChange(e.target.value || null)}
              className="w-full px-3 py-2 bg-green-950/50 border border-green-700/50 rounded-lg text-white focus:ring-2 focus:ring-green-400 focus:border-transparent"
            >
              <option value="" className="bg-green-900">All Regions</option>
              {regions?.map(region => (
                <option key={region} value={region} className="bg-green-900">
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Organic Filter */}
          <div>
            <label className="block text-sm font-medium text-green-200 mb-2">
              &nbsp;
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showOrganic}
                onChange={(e) => onOrganicChange(e.target.checked)}
                className="w-4 h-4 text-green-600 bg-green-950 border-green-700 rounded focus:ring-green-500"
              />
              <span className="text-sm text-green-200">Organic Only</span>
            </label>
          </div>
        </div>

        {/* Clear Filters */}
        {(activeFilterCount > 0 || selectedCrop !== 'all') && (
          <div className="flex justify-end mt-4">
            <button
              onClick={onClear}
              className="text-sm text-green-300 hover:text-green-100 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden flex items-center px-4 py-3 bg-green-950/50 border border-green-700/50 rounded-xl text-white hover:bg-green-900/50 transition-colors"
      >
        <IoFilter className="mr-2" size={18} />
        Filters
        {activeFilterCount > 0 && (
          <span className="ml-2 px-2 py-0.5 bg-green-600 text-white text-xs rounded-full">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Mobile Filters Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-80 bg-gradient-to-b from-green-950 to-green-900 p-6 overflow-y-auto border-l border-green-400/20">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Filters</h3>
              <button onClick={() => setIsOpen(false)}>
                <IoClose className="text-green-300 text-2xl hover:text-white transition-colors" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Crop Filter */}
              <div>
                <label className="block text-sm font-medium text-green-200 mb-2">
                  Crop Type
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => onCropChange(e.target.value)}
                  className="w-full px-4 py-3 bg-green-950/50 border border-green-700/50 rounded-xl text-white focus:ring-2 focus:ring-green-400"
                >
                  <option value="all" className="bg-green-900">All Crops</option>
                  {crops.map(crop => (
                    <option key={crop.id} value={crop.crop_name} className="bg-green-900">
                      {crop.crop_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-green-200 mb-2">
                  Price Range (KES/kg)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange?.min || ''}
                    onChange={(e) => onPriceChange('min', e.target.value)}
                    className="w-full px-3 py-2 bg-green-950/50 border border-green-700/50 rounded-lg text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange?.max || ''}
                    onChange={(e) => onPriceChange('max', e.target.value)}
                    className="w-full px-3 py-2 bg-green-950/50 border border-green-700/50 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Region Filter */}
              <div>
                <label className="block text-sm font-medium text-green-200 mb-2">
                  Region
                </label>
                <select
                  value={selectedRegion || ''}
                  onChange={(e) => onRegionChange(e.target.value || null)}
                  className="w-full px-4 py-3 bg-green-950/50 border border-green-700/50 rounded-xl text-white"
                >
                  <option value="" className="bg-green-900">All Regions</option>
                  {regions?.map(region => (
                    <option key={region} value={region} className="bg-green-900">
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Organic Filter */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOrganic}
                  onChange={(e) => onOrganicChange(e.target.checked)}
                  className="w-4 h-4 text-green-600 bg-green-950 border-green-700 rounded"
                />
                <span className="text-sm text-green-200">Organic Only</span>
              </label>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => setIsOpen(false)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Apply Filters
                </Button>
                <Button
                  variant="outline"
                  onClick={onClear}
                  className="border-2 border-green-400 text-green-300 hover:bg-green-800/30"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MarketplaceFilters;