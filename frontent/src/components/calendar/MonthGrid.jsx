import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';

const MonthGrid = ({ 
  selectedDate, 
  monthlyData, 
  onDateClick,
  getHarvestEventsForDate 
}) => {
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 bg-green-950/20 rounded-lg"></div>);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    const events = getHarvestEventsForDate(date);
    const hasEvents = events.length > 0;

    days.push(
      <div
        key={day}
        onClick={() => onDateClick(date)}
        className={`
          h-24 p-2 rounded-lg border cursor-pointer transition-all duration-300
          ${hasEvents 
            ? 'bg-green-800/30 border-green-400/40 hover:bg-green-800/50' 
            : 'bg-green-950/30 border-green-700/30 hover:border-green-400/30'
          }
        `}
      >
        <div className="flex justify-between items-start">
          <span className={`text-lg font-medium ${hasEvents ? 'text-green-400' : 'text-green-300'}`}>
            {day}
          </span>
          {hasEvents && (
            <Badge size="sm" variant="success">
              {events.length}
            </Badge>
          )}
        </div>
        {hasEvents && (
          <div className="mt-1">
            <p className="text-xs text-green-300 truncate">
              {events[0].cropName}
              {events.length > 1 && ` +${events.length - 1}`}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-green-900/30 backdrop-blur-sm rounded-3xl p-6 border border-green-400/20">
      {/* Month Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
        </h2>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-green-300">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>
    </div>
  );
};

export default MonthGrid;