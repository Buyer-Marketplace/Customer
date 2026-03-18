import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  // Use only icons that we confirmed exist
  IoLeaf,
  IoFlower,
  IoRose,
  IoRestaurant,
  IoWine,
  IoBeer,
  IoFastFood,
  IoPizza,
  IoFish,
  IoEgg,
  IoIceCream,
  IoCafe,
  IoThermometer,
  IoWater,
  IoFlash,
  IoHeart,
  IoBug,
  IoPaw,
  IoSunny,
  IoRainy,
  IoEarth,
  IoLocation,
  IoBasket,
  IoCart,
  IoBag,
  IoGift,
  IoPricetag,
  IoCalendar,
  IoTime,
  IoHourglass,
  IoPeople,
  IoPerson,
  IoStorefront,
  IoBusiness,
  IoHome,
  IoConstruct,
  IoBuild,
  IoMedkit,
  IoFitness,
  IoBody,
  IoCloud,
  IoSnow,
  IoThunderstorm,
  IoArrowForward,
} from 'react-icons/io5';
import { BsGrid } from 'react-icons/bs';

const CategoryCard = ({ category }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Map category names to icons based on what's available
  const getIconForCategory = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';
    
    // Coffee & Tea
    if (name.includes('coffee') || name.includes('tea')) return IoCafe;
    
    // Fish & Seafood
    if (name.includes('fish')) return IoFish;
    
    // Eggs & Poultry
    if (name.includes('egg') || name.includes('chicken')) return IoEgg;
    
    // Flowers & Ornamentals
    if (name.includes('flower') || name.includes('rose') || name.includes('ornamental')) return IoFlower;
    
    // Water-related (rice, irrigation, etc.)
    if (name.includes('rice') || name.includes('water') || name.includes('irrigation')) return IoWater;
    
    // Harvest & Basket
    if (name.includes('harvest') || name.includes('basket')) return IoBasket;
    
    // Market & Cart
    if (name.includes('market') || name.includes('cart') || name.includes('shop')) return IoCart;
    
    // Weather-related
    if (name.includes('sun') || name.includes('sunny')) return IoSunny;
    if (name.includes('rain') || name.includes('rainy')) return IoRainy;
    if (name.includes('cloud')) return IoCloud;
    if (name.includes('snow')) return IoSnow;
    
    // Temperature-sensitive
    if (name.includes('cold') || name.includes('frozen')) return IoSnow;
    if (name.includes('hot') || name.includes('warm')) return IoSunny;
    
    // Location-based
    if (name.includes('location') || name.includes('farm') || name.includes('field')) return IoLocation;
    
    // People/Community
    if (name.includes('farmer') || name.includes('community')) return IoPeople;
    
    // Business/Store
    if (name.includes('store') || name.includes('business')) return IoStorefront;
    
    // Equipment/Tools
    if (name.includes('tool') || name.includes('equipment') || name.includes('machine')) return IoConstruct;
    
    // Health/Organic
    if (name.includes('organic') || name.includes('healthy') || name.includes('natural')) return IoHeart;
    
    // Pests/Animals
    if (name.includes('pest') || name.includes('insect')) return IoBug;
    if (name.includes('animal') || name.includes('livestock')) return IoPaw;
    
    // Grains & Cereals (use IoLeaf or IoRestaurant)
    if (name.includes('wheat') || name.includes('corn') || name.includes('barley') || 
        name.includes('oat') || name.includes('grain')) return IoLeaf;
    
    // Fruits & Vegetables (use IoLeaf or IoFlower)
    if (name.includes('fruit') || name.includes('vegetable') || 
        name.includes('tomato') || name.includes('potato') || 
        name.includes('carrot') || name.includes('onion') ||
        name.includes('cabbage') || name.includes('lettuce') ||
        name.includes('mango') || name.includes('banana') || 
        name.includes('orange') || name.includes('apple')) return IoFlower;
    
    // Dairy
    if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt') || 
        name.includes('cream') || name.includes('butter')) return IoIceCream;
    
    // Prepared foods
    if (name.includes('bread') || name.includes('baked') || name.includes('pastry')) return IoRestaurant;
    
    // Beverages
    if (name.includes('juice') || name.includes('drink')) return IoWater;
    if (name.includes('wine')) return IoWine;
    if (name.includes('beer')) return IoBeer;
    
    // Pizza/Fast food
    if (name.includes('pizza')) return IoPizza;
    if (name.includes('fast')) return IoFastFood;
    
    // Default for everything else
    return IoLeaf;
  };
  
  const IconComponent = getIconForCategory(category?.name);
  
  // Fallback image
  const fallbackImage = 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600';
  const categoryImage = category?.image || fallbackImage;

  // Get color classes based on category color
  const getColorClasses = () => {
    const colors = {
      green: {
        bg: 'bg-green-500/20',
        text: 'text-green-300',
        border: 'border-green-500/30',
        hover: 'group-hover:bg-green-500/30',
        icon: 'text-green-400'
      },
      yellow: {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-300',
        border: 'border-yellow-500/30',
        hover: 'group-hover:bg-yellow-500/30',
        icon: 'text-yellow-400'
      },
      amber: {
        bg: 'bg-amber-500/20',
        text: 'text-amber-300',
        border: 'border-amber-500/30',
        hover: 'group-hover:bg-amber-500/30',
        icon: 'text-amber-400'
      },
      red: {
        bg: 'bg-red-500/20',
        text: 'text-red-300',
        border: 'border-red-500/30',
        hover: 'group-hover:bg-red-500/30',
        icon: 'text-red-400'
      },
      orange: {
        bg: 'bg-orange-500/20',
        text: 'text-orange-300',
        border: 'border-orange-500/30',
        hover: 'group-hover:bg-orange-500/30',
        icon: 'text-orange-400'
      },
      purple: {
        bg: 'bg-purple-500/20',
        text: 'text-purple-300',
        border: 'border-purple-500/30',
        hover: 'group-hover:bg-purple-500/30',
        icon: 'text-purple-400'
      },
      blue: {
        bg: 'bg-blue-500/20',
        text: 'text-blue-300',
        border: 'border-blue-500/30',
        hover: 'group-hover:bg-blue-500/30',
        icon: 'text-blue-400'
      },
      brown: {
        bg: 'bg-amber-700/20',
        text: 'text-amber-300',
        border: 'border-amber-700/30',
        hover: 'group-hover:bg-amber-700/30',
        icon: 'text-amber-400'
      },
      default: {
        bg: 'bg-green-500/20',
        text: 'text-green-300',
        border: 'border-green-500/30',
        hover: 'group-hover:bg-green-500/30',
        icon: 'text-green-400'
      }
    };
    
    return colors[category?.color] || colors.default;
  };

  const colorClasses = getColorClasses();

  return (
    <Link to={`/categories/${category?.id}`} className="block h-full w-full">
      <div className="group relative bg-gradient-to-b from-green-900/40 to-green-950/40 backdrop-blur-sm rounded-xl overflow-hidden border border-green-400/20 hover:border-green-400/40 transition-all duration-300 card-hover shadow-xl h-full w-full">
        
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <div className="absolute inset-0 transform transition-transform duration-300 group-hover:scale-110 origin-bottom">
            <img
              src={imageError ? fallbackImage : categoryImage}
              alt={category?.name || 'Category'}
              className="w-full h-full object-cover"
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true);
                setImageLoaded(true);
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-green-950 via-green-950/80 to-transparent pointer-events-none"></div>
          </div>
          
          {IconComponent && (
            <div className={`absolute top-2 right-2 z-10 ${colorClasses.bg} p-2 rounded-full backdrop-blur-sm border ${colorClasses.border} transform transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-[-5px] group-hover:translate-y-0`}>
              <IconComponent className={colorClasses.icon} size={18} />
            </div>
          )}
          
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <h3 className="font-semibold text-lg text-white group-hover:text-green-300 transition-colors duration-300">
              {category?.name || 'Category'}
            </h3>
            {category?.productCount > 0 && (
              <div className="flex items-center gap-1 text-xs text-green-300/70">
                <BsGrid size={12} />
                <span>{category.productCount} items</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-green-950/40">
          {category?.description && (
            <p className="text-sm text-green-200/80 mb-3 line-clamp-2">
              {category.description}
            </p>
          )}

          <button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group/btn">
            <span>Explore {category?.name || 'Category'}</span>
            <IoArrowForward className="group-hover/btn:translate-x-1 transition-transform duration-300" size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;