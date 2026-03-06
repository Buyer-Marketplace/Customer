import React from 'react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

const ProductCard = ({ product }) => {
  const { name, farmer, price, unit, description, image, harvestCycle, badge } = product;

  return (
    <Card hover className="overflow-hidden group animate-fade-in h-full flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {badge && (
          <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4">
            <Badge variant={badge === 'Organic' ? 'success' : 'primary'} size="sm">
              {badge}
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-2 mb-1 sm:mb-2">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 flex-1">
            {name}
          </h3>
          <span className="text-primary font-bold text-sm sm:text-base md:text-lg whitespace-nowrap">
            ${price}/{unit}
          </span>
        </div>
        
        <p className="text-xs sm:text-sm text-gray-600 dark:text-dark-muted mb-1 sm:mb-2 line-clamp-1">
          {farmer}
        </p>
        
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 sm:mb-3 md:mb-4 line-clamp-2 flex-1">
          {description}
        </p>
        
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 mt-auto">
          <span className="text-[10px] sm:text-xs text-gray-500 dark:text-dark-muted">
            {harvestCycle}
          </span>
          <Button variant="outline" size="sm" className="w-full xs:w-auto">
            Pre-order
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;