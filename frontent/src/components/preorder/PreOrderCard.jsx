import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  return (
    <Link to={`/categories/${category.id}`}>
      <div className="bg-green-900/30 backdrop-blur-sm rounded-xl overflow-hidden border border-green-400/20 hover:border-green-400/40 transition-all duration-300 card-hover group shadow-xl">
        <div className="relative h-40 overflow-hidden">
          <img
            src={category.image || 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600'}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=600';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-950/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-xl font-semibold text-white">{category.name}</h3>
            {category.productCount && (
              <p className="text-sm text-green-300">{category.productCount} products</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;