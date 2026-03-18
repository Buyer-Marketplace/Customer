import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { SkeletonLoader } from '../ui/Loader';
import Button from '../ui/Button';
import HeaderImage from './HeaderImage';
import SectionHeader from './SectionHeader';
import { headerImages } from '../../constants/homeConstants';
import { categoryApi } from '../../api/categoryApi';

// Category card component
const CategoryCard = ({ category }) => {
  if (!category) return null;
  
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-green-400/30 hover:border-green-400 transition-all duration-300 group">
      <div className="relative h-32 overflow-hidden">
        <img 
          src={category.image} 
          alt={category.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1566385101042-1a0aa0c12e8c?auto=format&fit=crop&w=400';
          }}
        />
      </div>
      <div className="p-3 text-center">
        <h3 className="text-white font-semibold">{category.name}</h3>
        <p className="text-green-300 text-xs mt-1">{category.productCount || 0} products</p>
      </div>
    </div>
  );
};

const CategoriesSection = () => {
  const navigate = useNavigate();
  const categoryRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryApi.getAllCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const scrollHorizontally = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === "left" ? -ref.current.clientWidth / 2 : ref.current.clientWidth / 2;
      ref.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!categories.length && !loading) {
    return null;
  }

  return (
    <section className="py-20">
      <HeaderImage 
        src={headerImages.categories} 
        alt="Fresh produce categories" 
      />
      
      <div className="container-custom">
        <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-green-400/20 shadow-2xl">
          <SectionHeader 
            title="SHOP BY CATEGORY" 
            subtitle="Browse our wide selection"
          />
          
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <SkeletonLoader type="card" count={6} />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {categories.slice(0, 6).map((category, index) => (
                  <div 
                    key={category.id}
                    className="cursor-pointer transform transition-all duration-500 hover:scale-105"
                    onClick={() => navigate(`/categories/${category.id}`)}
                    data-aos="fade-up"
                    data-aos-delay={index * 50}
                  >
                    <CategoryCard category={category} />
                  </div>
                ))}
              </div>

              {categories.length > 6 && (
                <div className="relative mt-8">
                  <h3 className="text-xl font-semibold text-white mb-4">More Categories</h3>
                  <div className="relative group">
                    <div 
                      ref={categoryRef}
                      className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
                    >
                      {categories.slice(6).map((category) => (
                        <div 
                          key={category.id}
                          className="flex-shrink-0 w-48 cursor-pointer transform transition-all duration-500 hover:scale-105"
                          onClick={() => navigate(`/categories/${category.id}`)}
                        >
                          <CategoryCard category={category} />
                        </div>
                      ))}
                    </div>
                    
                    <button 
                      onClick={() => scrollHorizontally(categoryRef, "left")}
                      className="absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-green-800/80 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-700"
                    >
                      <FiChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button 
                      onClick={() => scrollHorizontally(categoryRef, "right")}
                      className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-green-800/80 backdrop-blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-700"
                    >
                      <FiChevronRight className="w-6 h-6 text-white" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
          
          <div className="text-center mt-12">
            <Link to="/categories">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 px-8 py-3">
                VIEW ALL CATEGORIES
                <FiArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;