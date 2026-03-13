export const formatCurrency = (amount, currency = 'KES') => {
  if (typeof amount !== 'number') {
    return `${currency} 0`;
  }
  
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};