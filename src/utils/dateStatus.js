const parseLocalDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const isExpired = (dateString) => {
  if (!dateString) return false;
  const expiry = parseLocalDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return expiry < today;
};

export const isExpiringSoon = (dateString, thresholdDays = 30) => {
  if (!dateString) return false;
  if (isExpired(dateString)) return false; // Already expired, not "expiring soon"

  const expiry = parseLocalDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays <= thresholdDays;
};

export const getExpiryStatus = (dateString) => {
  if (!dateString) return 'Pending';
  if (isExpired(dateString)) return 'Expired';
  if (isExpiringSoon(dateString)) return 'Expiring Soon';
  return 'Valid';
};
