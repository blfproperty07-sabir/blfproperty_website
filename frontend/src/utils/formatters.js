// Format currency in Indian Rupees
export const formatCurrency = (amount) => {
  if (!amount) return '₹0';
  
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return '₹0';
  
  // Format in Indian number system (lakhs, crores)
  if (numAmount >= 10000000) {
    return `₹${(numAmount / 10000000).toFixed(2)} Cr`;
  } else if (numAmount >= 100000) {
    return `₹${(numAmount / 100000).toFixed(2)} L`;
  } else if (numAmount >= 1000) {
    return `₹${(numAmount / 1000).toFixed(0)}K`;
  }
  
  return `₹${numAmount.toLocaleString('en-IN')}`;
};

// Format area
export const formatArea = (area, unit = 'sqft') => {
  if (!area) return '0 sqft';
  
  const numArea = parseFloat(area);
  if (isNaN(numArea)) return '0 sqft';
  
  return `${numArea.toLocaleString('en-IN')} ${unit}`;
};

// Format date
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  };
  
  return new Date(date).toLocaleDateString('en-IN', defaultOptions);
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const target = new Date(date);
  const diffInMs = now - target;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  if (diffInMonths < 12) return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength).trim() + '...';
};

// Generate slug from title
export const generateSlug = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Format phone number
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Indian phone number format
  if (cleaned.length === 10) {
    return `+91 ${cleaned.substring(0, 5)} ${cleaned.substring(5)}`;
  }
  
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.substring(2, 7)} ${cleaned.substring(7)}`;
  }
  
  return phone;
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number
export const isValidPhone = (phone) => {
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

// Convert file size to human readable format
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Calculate price per square foot
export const calculatePricePerSqft = (price, area) => {
  if (!price || !area) return 0;
  
  const numPrice = parseFloat(price);
  const numArea = parseFloat(area);
  
  if (isNaN(numPrice) || isNaN(numArea) || numArea === 0) return 0;
  
  return Math.round(numPrice / numArea);
};

// Property type mapping
export const getPropertyTypeLabel = (type) => {
  const typeMap = {
    'apartment': 'Apartment',
    'house': 'Independent House',
    'villa': 'Villa',
    'plot': 'Plot/Land',
    'commercial': 'Commercial Space',
    'office': 'Office Space',
    'shop': 'Shop/Showroom',
    'warehouse': 'Warehouse',
    'pg': 'PG/Hostel',
    'other': 'Other'
  };
  
  return typeMap[type] || type;
};

// Property status mapping
export const getPropertyStatusLabel = (status) => {
  const statusMap = {
    'pending': 'Pending Approval',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'sold': 'Sold',
    'rented': 'Rented',
    'inactive': 'Inactive'
  };
  
  return statusMap[status] || status;
};

// Get status color class
export const getStatusColorClass = (status) => {
  const colorMap = {
    'pending': 'text-yellow-600 bg-yellow-100',
    'approved': 'text-green-600 bg-green-100',
    'rejected': 'text-red-600 bg-red-100',
    'sold': 'text-blue-600 bg-blue-100',
    'rented': 'text-purple-600 bg-purple-100',
    'inactive': 'text-gray-600 bg-gray-100'
  };
  
  return colorMap[status] || 'text-gray-600 bg-gray-100';
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (fallbackErr) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};