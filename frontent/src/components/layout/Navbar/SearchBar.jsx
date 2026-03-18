import React from 'react';
import { IoSearch, IoClose } from 'react-icons/io5';

const SearchBar = ({ 
  searchTerm, 
  setSearchTerm, 
  handleSearch, 
  isOpen = true, 
  inputRef,
  suggestions = [],
  showSuggestions = false,
  onSuggestionClick,
  suggestionsRef,
  size = 'desktop' 
}) => {
  
  const clearSearch = () => {
    setSearchTerm('');
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  };

  if (size === 'mobile') {
    return (
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-20 opacity-100 pb-3' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="relative" ref={suggestionsRef}>
          <form onSubmit={handleSearch}>
            <div className="relative group">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search crops, farmers, regions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pl-8 pr-8 bg-green-900/50 border border-green-700 rounded-lg text-white placeholder-green-500/50 focus:ring-2 focus:ring-green-500 focus:border-transparent text-xs sm:text-sm group-hover:border-green-500 transition-all duration-300 backdrop-blur-sm"
              />
              <IoSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-green-400 group-hover:text-green-300 transition-colors duration-300" size={14} />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-white transition-colors"
                >
                  <IoClose size={14} />
                </button>
              )}
            </div>
          </form>

          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-green-900 border border-green-700 rounded-lg shadow-2xl overflow-hidden backdrop-blur-lg">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="w-full px-3 py-2 text-left text-xs text-green-200 hover:text-white hover:bg-green-800 transition-all duration-200 border-b border-green-800 last:border-0"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full" ref={suggestionsRef}>
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-1.5 pl-8 pr-8 bg-green-900/50 border border-green-700 rounded-lg text-white placeholder-green-500/50 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover:border-green-500 backdrop-blur-sm text-xs"
          />
          <IoSearch className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-green-400 group-hover:text-green-300 transition-colors duration-300" size={14} />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-green-400 hover:text-white transition-colors"
            >
              <IoClose size={14} />
            </button>
          )}
        </div>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-green-900 border border-green-700 rounded-lg shadow-2xl overflow-hidden backdrop-blur-lg">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(suggestion)}
              className="w-full px-3 py-2 text-left text-xs text-green-200 hover:text-white hover:bg-green-800 transition-all duration-200 border-b border-green-800 last:border-0"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;