export const calculateStockStatus = (available, total) => {
  const percentage = (available / total) * 100;
  
  if (percentage <= 0) return 'out-of-stock';
  if (percentage <= 20) return 'critical';
  if (percentage <= 50) return 'low';
  return 'in-stock';
};

export const getStockColor = (status) => {
  switch (status) {
    case 'out-of-stock':
      return 'bg-red-100 text-red-800';
    case 'critical':
      return 'bg-orange-100 text-orange-800';
    case 'low':
      return 'bg-yellow-100 text-yellow-800';
    case 'in-stock':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getStockText = (status) => {
  switch (status) {
    case 'out-of-stock':
      return 'Out of Stock';
    case 'critical':
      return 'Very Low Stock';
    case 'low':
      return 'Low Stock';
    case 'in-stock':
      return 'In Stock';
    default:
      return 'Unknown';
  }
};

export const isPreorderAvailable = (harvestDate) => {
  if (!harvestDate) return false;
  const harvest = new Date(harvestDate);
  const now = new Date();
  const threeDaysFromNow = new Date(now.setDate(now.getDate() + 3));
  
  return harvest > threeDaysFromNow;
};