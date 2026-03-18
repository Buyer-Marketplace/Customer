import { useState, useEffect, useCallback } from 'react';
import { calendarApi } from '../api/calendarApi';
import toast from 'react-hot-toast';

export const useHarvestCalendar = () => {
  const [calendarData, setCalendarData] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchHarvestCalendar = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await calendarApi.getHarvestCalendar();
      setCalendarData(response.data || {});
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch harvest calendar';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMonthlyCalendar = useCallback(async (month, year) => {
    setLoading(true);
    setError(null);
    try {
      const response = await calendarApi.getMonthlyCalendar(month, year);
      setMonthlyData(response.data || []);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch monthly calendar';
      setError(message);
      toast.error(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFarmerCalendar = useCallback(async (farmerId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await calendarApi.getFarmerCalendar(farmerId);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch farmer calendar';
      setError(message);
      toast.error(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCropCalendar = useCallback(async (cropId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await calendarApi.getCropCalendar(cropId);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch crop calendar';
      setError(message);
      toast.error(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHarvestCalendar();
  }, [fetchHarvestCalendar]);

  useEffect(() => {
    const month = selectedDate.getMonth() + 1;
    const year = selectedDate.getFullYear();
    fetchMonthlyCalendar(month, year);
  }, [selectedDate, fetchMonthlyCalendar]);

  const getHarvestEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return calendarData[dateStr] || [];
  };

  const getUpcomingHarvests = (days = 30) => {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const events = [];
    Object.entries(calendarData).forEach(([dateStr, harvests]) => {
      const eventDate = new Date(dateStr);
      if (eventDate >= today && eventDate <= futureDate) {
        events.push({
          date: eventDate,
          harvests: harvests,
        });
      }
    });

    return events.sort((a, b) => a.date - b.date);
  };

  const getHarvestsByCrop = (cropName) => {
    const cropEvents = [];
    Object.entries(calendarData).forEach(([dateStr, harvests]) => {
      const filtered = harvests.filter(h => 
        h.cropName?.toLowerCase().includes(cropName.toLowerCase())
      );
      if (filtered.length > 0) {
        cropEvents.push({
          date: new Date(dateStr),
          harvests: filtered,
        });
      }
    });
    return cropEvents;
  };

  const getHarvestsByRegion = (region) => {
    const regionEvents = [];
    Object.entries(calendarData).forEach(([dateStr, harvests]) => {
      const filtered = harvests.filter(h => 
        h.region?.toLowerCase().includes(region.toLowerCase())
      );
      if (filtered.length > 0) {
        regionEvents.push({
          date: new Date(dateStr),
          harvests: filtered,
        });
      }
    });
    return regionEvents;
  };

  const getHarvestSummary = () => {
    let totalHarvests = 0;
    let upcomingHarvests = 0;
    const today = new Date();

    Object.entries(calendarData).forEach(([dateStr, harvests]) => {
      const eventDate = new Date(dateStr);
      totalHarvests += harvests.length;
      if (eventDate >= today) {
        upcomingHarvests += harvests.length;
      }
    });

    return {
      totalHarvests,
      upcomingHarvests,
      thisMonth: monthlyData.length,
    };
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const changeMonth = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  return {
    calendarData,
    monthlyData,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    fetchHarvestCalendar,
    fetchMonthlyCalendar,
    fetchFarmerCalendar,
    fetchCropCalendar,
    getHarvestEventsForDate,
    getUpcomingHarvests,
    getHarvestsByCrop,
    getHarvestsByRegion,
    getHarvestSummary,
    months,
    getDaysInMonth,
    getFirstDayOfMonth,
    changeMonth,
  };
};