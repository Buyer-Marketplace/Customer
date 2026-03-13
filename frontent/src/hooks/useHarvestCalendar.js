import { useState, useEffect } from 'react';
import { productApi } from '../api/productApi';

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
      const data = await productApi.getProductsForHarvestCalendar(month, year);
      setCalendarData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProductsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return calendarData[dateStr] || [];
  };

  return {
    calendarData,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    getProductsForDate,
    refetch: fetchHarvestData,
  };
};