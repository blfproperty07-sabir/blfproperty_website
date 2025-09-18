// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    CHANGE_PASSWORD: '/auth/change-password',
  },
  PROPERTIES: {
    LIST: '/properties',
    CREATE: '/properties',
    DETAIL: '/properties/:id',
    UPDATE: '/properties/:id',
    DELETE: '/properties/:id',
    SEARCH: '/properties/search',
    MY_PROPERTIES: '/properties/my-properties',
    INTEREST: '/properties/:id/interest',
    ANALYTICS: '/properties/:id/analytics',
    IMAGES: '/properties/:id/images',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    PROPERTIES: '/admin/properties',
    APPROVE_PROPERTY: '/admin/properties/:id/approve',
    REJECT_PROPERTY: '/admin/properties/:id/reject',
    USERS: '/admin/users',
    CREATE_ADMIN: '/admin/users/admin',
    TEAM: '/admin/team',
    INQUIRIES: '/admin/inquiries',
    STATS: '/admin/stats',
    ANALYTICS: '/admin/analytics/:type',
    SETTINGS: '/admin/settings',
  },
  TEAM: {
    LIST: '/team',
    ACTIVE: '/team/active',
    CREATE: '/team',
    DETAIL: '/team/:id',
    UPDATE: '/team/:id',
    DELETE: '/team/:id',
    TOGGLE_STATUS: '/team/:id/toggle-status',
    STATISTICS: '/team/statistics',
  },
  CONTACT: {
    SUBMIT: '/contact',
    LIST: '/contact',
  },
};

// Property types
export const PROPERTY_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'house', label: 'Independent House' },
  { value: 'villa', label: 'Villa' },
  { value: 'plot', label: 'Plot/Land' },
  { value: 'commercial', label: 'Commercial Space' },
  { value: 'office', label: 'Office Space' },
  { value: 'shop', label: 'Shop/Showroom' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'pg', label: 'PG/Hostel' },
  { value: 'other', label: 'Other' },
];

// Property status
export const PROPERTY_STATUS = [
  { value: 'pending', label: 'Pending Approval' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'sold', label: 'Sold' },
  { value: 'rented', label: 'Rented' },
  { value: 'inactive', label: 'Inactive' },
];

// User roles
export const USER_ROLES = [
  { value: 'buyer', label: 'Buyer' },
  { value: 'seller', label: 'Seller' },
  { value: 'admin', label: 'Admin' },
];

// Furnished status
export const FURNISHED_STATUS = [
  { value: 'furnished', label: 'Fully Furnished' },
  { value: 'semi-furnished', label: 'Semi Furnished' },
  { value: 'unfurnished', label: 'Unfurnished' },
];

// Facing directions
export const FACING_DIRECTIONS = [
  { value: 'north', label: 'North' },
  { value: 'south', label: 'South' },
  { value: 'east', label: 'East' },
  { value: 'west', label: 'West' },
  { value: 'north-east', label: 'North-East' },
  { value: 'north-west', label: 'North-West' },
  { value: 'south-east', label: 'South-East' },
  { value: 'south-west', label: 'South-West' },
];

// Bedrooms options
export const BEDROOM_OPTIONS = [
  { value: '1', label: '1 BHK' },
  { value: '2', label: '2 BHK' },
  { value: '3', label: '3 BHK' },
  { value: '4', label: '4 BHK' },
  { value: '5', label: '5+ BHK' },
];

// Age of property
export const PROPERTY_AGE = [
  { value: '0-1', label: 'Under Construction' },
  { value: '1-3', label: '1-3 Years' },
  { value: '3-5', label: '3-5 Years' },
  { value: '5-10', label: '5-10 Years' },
  { value: '10+', label: '10+ Years' },
];

// Parking options
export const PARKING_OPTIONS = [
  { value: 'none', label: 'No Parking' },
  { value: '1', label: '1 Parking' },
  { value: '2', label: '2 Parking' },
  { value: '3', label: '3+ Parking' },
];

// Listing types
export const LISTING_TYPES = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
  { value: 'pg', label: 'PG/Hostel' },
];

// Team member positions
export const TEAM_POSITIONS = [
  { value: 'ceo', label: 'CEO' },
  { value: 'manager', label: 'Manager' },
  { value: 'senior-consultant', label: 'Senior Consultant' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'sales-executive', label: 'Sales Executive' },
  { value: 'marketing-executive', label: 'Marketing Executive' },
  { value: 'admin', label: 'Admin' },
  { value: 'other', label: 'Other' },
];

// Team departments
export const TEAM_DEPARTMENTS = [
  { value: 'management', label: 'Management' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'customer-service', label: 'Customer Service' },
  { value: 'administration', label: 'Administration' },
  { value: 'finance', label: 'Finance' },
  { value: 'legal', label: 'Legal' },
  { value: 'other', label: 'Other' },
];

// Sort options
export const SORT_OPTIONS = [
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'createdAt-asc', label: 'Oldest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'area-asc', label: 'Area: Small to Large' },
  { value: 'area-desc', label: 'Area: Large to Small' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
];

// Image file types
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  PROPERTY_IMAGE: 5 * 1024 * 1024, // 5MB
  TEAM_IMAGE: 2 * 1024 * 1024, // 2MB
  PROFILE_IMAGE: 1 * 1024 * 1024, // 1MB
};

// Pagination defaults
export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  LIMIT: 12,
  ADMIN_LIMIT: 20,
};

// Color scheme (based on 99acres.com)
export const BRAND_COLORS = {
  PRIMARY: '#ff6b35',
  SECONDARY: '#2563eb',
  ACCENT: '#f59e0b',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  GRAY: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

// Loading states
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  SEARCH_HISTORY: 'searchHistory',
  FAVORITES: 'favorites',
};

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL: 'Please enter a valid email address',
  PHONE: 'Please enter a valid phone number',
  PASSWORD: 'Password must be at least 6 characters long',
  CONFIRM_PASSWORD: 'Passwords do not match',
  MIN_LENGTH: (min) => `Must be at least ${min} characters long`,
  MAX_LENGTH: (max) => `Must be no more than ${max} characters long`,
  INVALID_FORMAT: 'Invalid format',
  POSITIVE_NUMBER: 'Must be a positive number',
  VALID_URL: 'Please enter a valid URL',
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Logged in successfully',
  LOGOUT: 'Logged out successfully',
  REGISTER: 'Account created successfully',
  UPDATE: 'Updated successfully',
  DELETE: 'Deleted successfully',
  CREATE: 'Created successfully',
  SAVE: 'Saved successfully',
  SUBMIT: 'Submitted successfully',
  COPY: 'Copied to clipboard',
  UPLOAD: 'Uploaded successfully',
};

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION: 'Please check your input and try again.',
  FILE_SIZE: 'File size is too large.',
  FILE_TYPE: 'File type is not supported.',
  UPLOAD_FAILED: 'File upload failed.',
  DELETE_FAILED: 'Delete operation failed.',
  UPDATE_FAILED: 'Update operation failed.',
  CREATE_FAILED: 'Create operation failed.',
};

// Map configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: [28.6139, 77.2090], // Delhi coordinates
  DEFAULT_ZOOM: 10,
  MARKER_ICON_URL: '/images/marker-icon.png',
};