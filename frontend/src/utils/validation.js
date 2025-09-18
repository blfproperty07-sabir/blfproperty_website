import { ALLOWED_IMAGE_TYPES, FILE_SIZE_LIMITS } from './constants';

// Form validation helpers
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined && value !== '';
};

export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateNumber = (value, min = 0, max = Infinity) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

export const validatePositiveNumber = (value) => {
  return validateNumber(value, 0.01);
};

// File validation helpers
export const validateImageFile = (file, maxSize = FILE_SIZE_LIMITS.PROPERTY_IMAGE) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file selected');
    return errors;
  }
  
  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    errors.push('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
  }
  
  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    errors.push(`File size too large. Maximum size is ${maxSizeMB}MB.`);
  }
  
  return errors;
};

export const validateMultipleImageFiles = (files, maxFiles = 10, maxSize = FILE_SIZE_LIMITS.PROPERTY_IMAGE) => {
  const errors = [];
  
  if (!files || files.length === 0) {
    errors.push('No files selected');
    return errors;
  }
  
  if (files.length > maxFiles) {
    errors.push(`Too many files. Maximum ${maxFiles} files allowed.`);
    return errors;
  }
  
  for (let i = 0; i < files.length; i++) {
    const fileErrors = validateImageFile(files[i], maxSize);
    if (fileErrors.length > 0) {
      errors.push(`File ${i + 1}: ${fileErrors.join(', ')}`);
    }
  }
  
  return errors;
};

// Property form validation
export const validatePropertyForm = (formData) => {
  const errors = {};
  
  // Required fields
  if (!validateRequired(formData.title)) {
    errors.title = 'Property title is required';
  }
  
  if (!validateRequired(formData.description)) {
    errors.description = 'Property description is required';
  }
  
  if (!validateRequired(formData.type)) {
    errors.type = 'Property type is required';
  }
  
  if (!validateRequired(formData.listingType)) {
    errors.listingType = 'Listing type is required';
  }
  
  if (!validatePositiveNumber(formData.price)) {
    errors.price = 'Valid price is required';
  }
  
  if (!validatePositiveNumber(formData.area)) {
    errors.area = 'Valid area is required';
  }
  
  // Location fields
  if (!validateRequired(formData.location?.address)) {
    errors.address = 'Address is required';
  }
  
  if (!validateRequired(formData.location?.city)) {
    errors.city = 'City is required';
  }
  
  if (!validateRequired(formData.location?.state)) {
    errors.state = 'State is required';
  }
  
  if (!validateRequired(formData.location?.pincode)) {
    errors.pincode = 'Pincode is required';
  } else if (!/^\d{6}$/.test(formData.location.pincode)) {
    errors.pincode = 'Pincode must be 6 digits';
  }
  
  // Contact validation
  if (!validateRequired(formData.contact?.name)) {
    errors.contactName = 'Contact name is required';
  }
  
  if (!validatePhone(formData.contact?.phone)) {
    errors.contactPhone = 'Valid phone number is required';
  }
  
  if (formData.contact?.email && !validateEmail(formData.contact.email)) {
    errors.contactEmail = 'Valid email address is required';
  }
  
  return errors;
};

// User registration form validation
export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  if (!validateRequired(formData.name)) {
    errors.name = 'Name is required';
  }
  
  if (!validateEmail(formData.email)) {
    errors.email = 'Valid email address is required';
  }
  
  if (!validatePhone(formData.phone)) {
    errors.phone = 'Valid phone number is required';
  }
  
  if (!validatePassword(formData.password)) {
    errors.password = 'Password must be at least 6 characters long';
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  if (!validateRequired(formData.role)) {
    errors.role = 'Role is required';
  }
  
  return errors;
};

// Login form validation
export const validateLoginForm = (formData) => {
  const errors = {};
  
  if (!validateEmail(formData.email)) {
    errors.email = 'Valid email address is required';
  }
  
  if (!validateRequired(formData.password)) {
    errors.password = 'Password is required';
  }
  
  return errors;
};

// Team member form validation
export const validateTeamMemberForm = (formData) => {
  const errors = {};
  
  if (!validateRequired(formData.name)) {
    errors.name = 'Name is required';
  }
  
  if (!validateRequired(formData.position)) {
    errors.position = 'Position is required';
  }
  
  if (!validateRequired(formData.department)) {
    errors.department = 'Department is required';
  }
  
  if (formData.email && !validateEmail(formData.email)) {
    errors.email = 'Valid email address is required';
  }
  
  if (formData.phone && !validatePhone(formData.phone)) {
    errors.phone = 'Valid phone number is required';
  }
  
  if (formData.linkedin && !validateUrl(formData.linkedin)) {
    errors.linkedin = 'Valid LinkedIn URL is required';
  }
  
  return errors;
};

// Contact form validation
export const validateContactForm = (formData) => {
  const errors = {};
  
  if (!validateRequired(formData.name)) {
    errors.name = 'Name is required';
  }
  
  if (!validateEmail(formData.email)) {
    errors.email = 'Valid email address is required';
  }
  
  if (!validatePhone(formData.phone)) {
    errors.phone = 'Valid phone number is required';
  }
  
  if (!validateRequired(formData.subject)) {
    errors.subject = 'Subject is required';
  }
  
  if (!validateRequired(formData.message)) {
    errors.message = 'Message is required';
  }
  
  return errors;
};

// Search form validation
export const validateSearchForm = (formData) => {
  const errors = {};
  
  // At least one search criteria should be provided
  const hasSearchCriteria = (
    validateRequired(formData.location) ||
    validateRequired(formData.type) ||
    validateRequired(formData.minPrice) ||
    validateRequired(formData.maxPrice) ||
    validateRequired(formData.bedrooms)
  );
  
  if (!hasSearchCriteria) {
    errors.general = 'Please provide at least one search criteria';
  }
  
  // Price range validation
  if (formData.minPrice && formData.maxPrice) {
    const min = parseFloat(formData.minPrice);
    const max = parseFloat(formData.maxPrice);
    
    if (!isNaN(min) && !isNaN(max) && min >= max) {
      errors.priceRange = 'Minimum price should be less than maximum price';
    }
  }
  
  return errors;
};

// Password change form validation
export const validatePasswordChangeForm = (formData) => {
  const errors = {};
  
  if (!validateRequired(formData.currentPassword)) {
    errors.currentPassword = 'Current password is required';
  }
  
  if (!validatePassword(formData.newPassword)) {
    errors.newPassword = 'New password must be at least 6 characters long';
  }
  
  if (formData.newPassword !== formData.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }
  
  if (formData.currentPassword === formData.newPassword) {
    errors.newPassword = 'New password must be different from current password';
  }
  
  return errors;
};

// Generic form validation helper
export const hasFormErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

// Get first error message
export const getFirstError = (errors) => {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : null;
};

// Clean form data (remove empty strings, null values)
export const cleanFormData = (data) => {
  const cleaned = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (value !== null && value !== undefined && value !== '') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const cleanedNested = cleanFormData(value);
        if (Object.keys(cleanedNested).length > 0) {
          cleaned[key] = cleanedNested;
        }
      } else {
        cleaned[key] = value;
      }
    }
  }
  
  return cleaned;
};