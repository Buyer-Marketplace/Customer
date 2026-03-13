import { useState, useEffect } from 'react';
import { productApi } from '../api/productApi';
import { mockHarvestCalendar } from '../data/mockData';

export const useHarvestCalendar = () => {
  const [calendarData, setCalendarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    fetchHarvestData();
  }, [selectedDate]);

  const fetchHarvestData = async () => {
    setLoading(true);
    try {
      const month = selectedDate.getMonth() + 1;
      const year = selectedDate.getFullYear();
      
      let data;
      try {
        // Try API first
        data = await productApi.getProductsForHarvestCalendar(month, year);
      } catch (err) {
        console.log('Using mock harvest calendar data');
        // Filter mock data by month/year
        const filtered = {};
        Object.entries(mockHarvestCalendar).forEach(([date, products]) => {
          const d = new Date(date);
          if (d.getMonth() + 1 === month && d.getFullYear() === year) {
            filtered[date] = products;
          }
        });
        data = filtered;
      }
      
      setCalendarData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching harvest calendar:', err);
      setError(err.message || 'Failed to fetch harvest calendar');
      
      // Fallback to empty object
      setCalendarData({});
    } finally {
      setLoading(false);
    }
  };

  const getProductsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return calendarData[dateStr] || [];
  };

  const getHarvestSummary = () => {
    const summary = {
      totalProducts: 0,
      upcomingHarvests: 0,
      thisMonth: 0,
      nextMonth: 0,
    };

    Object.entries(calendarData).forEach(([date, products]) => {
      const harvestDate = new Date(date);
      const now = new Date();
      const monthDiff = harvestDate.getMonth() - now.getMonth();
      
      summary.totalProducts += products.length;
      
      if (harvestDate > now) {
        summary.upcomingHarvests += products.length;
      }
      
      if (monthDiff === 0) {
        summary.thisMonth += products.length;
      } else if (monthDiff === 1) {
        summary.nextMonth += products.length;
      }
    });

    return summary;
  };

  return {
    calendarData,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    getProductsForDate,
    getHarvestSummary,
    refetch: fetchHarvestData,
  };
};