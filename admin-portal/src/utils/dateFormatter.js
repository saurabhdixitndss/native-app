/**
 * Parse date string in DD/MM/YYYY HH:mm:ss format
 * @param {string} dateString - Date string in DD/MM/YYYY HH:mm:ss format
 * @returns {Date|null} - Parsed Date object or null if invalid
 */
export const parseDateString = (dateString) => {
  try {
    if (!dateString) return null;
    
    // Parse DD/MM/YYYY HH:mm:ss format
    const parts = dateString.split(' ');
    const dateParts = parts[0].split('/');
    const timeParts = parts[1]?.split(':') || ['0', '0', '0'];
    
    // Create date object (month is 0-indexed in JS)
    const date = new Date(
      parseInt(dateParts[2]), // year
      parseInt(dateParts[1]) - 1, // month (0-indexed)
      parseInt(dateParts[0]), // day
      parseInt(timeParts[0]), // hour
      parseInt(timeParts[1]), // minute
      parseInt(timeParts[2]) // second
    );
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return null;
    }
    
    return date;
  } catch (e) {
    console.error('Error parsing date:', e);
    return null;
  }
};

/**
 * Format date string to localized format
 * @param {string} dateString - Date string in DD/MM/YYYY HH:mm:ss format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  const date = parseDateString(dateString);
  
  if (!date) {
    return dateString || 'Invalid Date';
  }
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  
  return date.toLocaleDateString('en-US', defaultOptions);
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {string} dateString - Date string in DD/MM/YYYY HH:mm:ss format
 * @returns {string} - Relative time string
 */
export const formatRelativeTime = (dateString) => {
  const date = parseDateString(dateString);
  
  if (!date) {
    return 'Unknown';
  }
  
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(dateString, { year: 'numeric', month: 'short', day: 'numeric' });
};

/**
 * Check if date string is valid
 * @param {string} dateString - Date string to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidDateString = (dateString) => {
  const date = parseDateString(dateString);
  return date !== null;
};
