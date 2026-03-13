import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { formatDate } from '../../utils/formatDate';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import './HarvestCalendar.css'; // We'll create this

const HarvestCalendar = ({ calendarData, onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (onDateChange) {
      onDateChange(date);
    }
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const products = calendarData[dateStr];
      
      if (products && products.length > 0) {
        return (
          <div className="calendar-tile-content">
            <span className="harvest-indicator"></span>
            <span className="harvest-count">{products.length}</span>
          </div>
        );
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      if (calendarData[dateStr]?.length > 0) {
        return 'harvest-day';
      }
    }
    return null;
  };

  const selectedDateProducts = calendarData[selectedDate.toISOString().split('T')[0]] || [];

  return (
    <div className="harvest-calendar-container">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            tileContent={tileContent}
            tileClassName={tileClassName}
            className="rounded-lg shadow-lg border-0 w-full"
          />
        </div>

        {/* Selected Date Products */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">
              Harvest on {formatDate(selectedDate)}
            </h3>
            
            {selectedDateProducts.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No harvest scheduled for this date
              </p>
            ) : (
              <div className="space-y-4">
                {selectedDateProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="block p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-3">
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/50x50'}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{product.name}</h4>
                        <p className="text-sm text-gray-600">
                          {product.farmer?.farmName || product.farmer?.name}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="primary">
                            {product.availableQuantity} {product.unit}s
                          </Badge>
                          <span className="font-semibold text-primary-600">
                            KES {product.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex justify-center space-x-6">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600">Harvest available</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
          <span className="text-sm text-gray-600">Limited harvest</span>
        </div>
      </div>
    </div>
  );
};

export default HarvestCalendar;