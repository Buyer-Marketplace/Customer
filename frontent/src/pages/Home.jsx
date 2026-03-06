import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [activeTab, setActiveTab] = useState('All Crops');

  const harvestTabs = [
    'All Crops',
    'Root Vegetables',
    'Orchard Fruits',
    'Leafy Greens',
    'Medicinal Herbs'
  ];

  // Product data with images
  const products = [
    {
      id: 1,
      name: "Organic Heirloom Tomatoes",
      type: "Bulk items & Brandywine style",
      price: null,
      daysLeft: 12,
      progress: 60,
      desc: "Rich, smoky, and incredibly sweet. These tomatoes are hand-seeded and grown in...",
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format",
      badge: "Limited Supply",
      buttonText: "Pre-order Now"
    },
    {
      id: 2,
      name: "Sweet Summer Corn",
      type: "Seasonal variety",
      price: "$8.00 / 4-pack",
      daysLeft: 24,
      progress: 30,
      desc: "Blistering aromas with a crisp, mildly sweet flavor. Perfect for late-summer grilling.",
      image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&auto=format",
      buttonText: "Join Waitlist"
    },
    {
      id: 3,
      name: "Kitchen Herb Bundle",
      type: "Bulk items & Thyme",
      daysLeft: 0,
      progress: 100,
      desc: "A curated selection of our most fragrant culinary herbs, harvested at dawn for...",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format",
      badge: "READY TO PICK",
      buttonText: "Buy Now"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors">
      {/* Main Container - Responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section with Banner Card */}
        <section className="py-4 sm:py-6 md:py-8">
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden shadow-sm">
            {/* Banner Image - Responsive height */}
            <div className="relative h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px]">
              <img 
                src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&auto=format"
                alt="Farm field at sunset"
                className="w-full h-full object-cover"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center">
                <div className="text-center text-white max-w-3xl px-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 drop-shadow-lg">
                    From Our Soil<br />to Your Kitchen
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-5 md:mb-6 text-gray-100 drop-shadow max-w-2xl mx-auto px-2">
                    Pre-order seasonal heirloom crops before they reach peak ripeness. Experience food as nature intended.
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                    <Link 
                      to="/harvest" 
                      className="px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-lg text-xs sm:text-sm md:text-base"
                    >
                      Explore Today's Harvest
                    </Link>
                    <Link 
                      to="/calendar" 
                      className="px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 md:py-2.5 bg-white/20 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/30 transition-colors border border-white/50 text-xs sm:text-sm md:text-base"
                    >
                      View Calendar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Harvests */}
        <section className="py-8 sm:py-10 md:py-12">
          <div className="text-center mb-6 sm:mb-7 md:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">Upcoming Harvests</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-dark-muted">Reserve your share of the next seasonal yields.</p>
          </div>

          {/* Tabs - Scrollable on mobile */}
          <div className="flex flex-nowrap sm:flex-wrap gap-1 sm:gap-2 justify-start sm:justify-center overflow-x-auto pb-2 sm:pb-0 mb-6 sm:mb-8 px-1 hide-scrollbar">
            {harvestTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-full whitespace-nowrap transition-colors flex-shrink-0 ${
                  activeTab === tab
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-dark-muted hover:text-primary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Product Cards - Responsive grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                {/* Responsive image height */}
                <img src={product.image} alt={product.name} className="w-full h-40 sm:h-44 md:h-48 object-cover" />
                <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
                  {product.badge && (
                    <span className={`text-xs font-medium px-2 py-1 rounded inline-block mb-2 sm:mb-3 self-start ${
                      product.badge === 'READY TO PICK' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {product.badge}
                    </span>
                  )}
                  
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">{product.name}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-dark-muted mb-2 sm:mb-3 line-clamp-1">{product.type}</p>
                  
                  {product.price && (
                    <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">{product.price}</p>
                  )}

                  {/* Progress Bar */}
                  <div className="mb-2 sm:mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500 dark:text-dark-muted text-[10px] sm:text-xs">HARVEST PROGRESS</span>
                      <span className="text-gray-900 dark:text-white font-medium text-[10px] sm:text-xs">
                        {product.daysLeft ? `${product.daysLeft} DAYS LEFT` : 'READY TO PICK'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: `${product.progress}%` }}></div>
                    </div>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 line-clamp-2 flex-1">{product.desc}</p>
                  
                  <Link to={`/product/${product.id}`} className="text-primary hover:text-primary-dark text-xs sm:text-sm font-medium mt-auto">
                    {product.buttonText} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Card */}
        <section className="py-8 sm:py-10 md:py-12">
          <div className="bg-gray-50 dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-4 sm:p-6 md:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">Never Miss a Harvest</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-dark-muted mb-4 sm:mb-6">
              Subscribe to get early access notifications and seasonal planting updates.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 sm:px-4 py-2 text-sm border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-4 sm:px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark whitespace-nowrap text-sm">
                Notify Me
              </button>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-dark-muted mt-3 sm:mt-4">
              Receive an email when new products are added to our catalog.
            </p>
          </div>
        </section>
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Home;