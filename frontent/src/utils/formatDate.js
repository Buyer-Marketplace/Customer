import { format, formatDistance, isToday, isTomorrow, isYesterday } from 'date-fns';

export const formatDate = (date, formatStr = 'PPP') => {
  if (!date) return '';
  const dateObj = new Date(date);
  return format(dateObj, formatStr);
};

export const formatRelativeDate = (date) => {
  if (!date) return '';
  const dateObj = new Date(date);
  
  if (isToday(dateObj)) return 'Today';
  if (isTomorrow(dateObj)) return 'Tomorrow';
  if (isYesterday(dateObj)) return 'Yesterday';
  
  return formatDistance(dateObj, new Date(), { addSuffix: true });
};

export const formatHarvestDate = (date) => {
  if (!date) return '';
  const dateObj = new Date(date);
  return format(dateObj, 'MMM d, yyyy');
};