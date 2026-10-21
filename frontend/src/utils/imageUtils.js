// Utility functions for image handling

/**
 * Constructs a proper image URL for team member profile images
 * @param {string} profileImagePath - The profileImage path from the database
 * @param {boolean} addCacheBuster - Whether to add cache busting parameter
 * @returns {string} - Complete image URL
 */
export const getTeamMemberImageUrl = (profileImagePath, addCacheBuster = false) => {
  if (!profileImagePath) {
    return "/image/muz1.jpg";
  }
  
  // Handle different types of image paths
  if (/^https?:\/\//i.test(profileImagePath)) {
    // Already a full URL
    return profileImagePath;
  }
  
  if (profileImagePath.startsWith('/uploads/')) {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
    const backendOrigin = apiUrl.replace(/\/api\/?$/, '');
    const imageUrl = `${backendOrigin}${profileImagePath}`;
    
    // Add cache buster to force refresh if needed
    if (addCacheBuster) {
      return `${imageUrl}?t=${Date.now()}`;
    }
    
    return imageUrl;
  }
  
  if (profileImagePath.startsWith('/image/')) {
    // Local public folder image
    return profileImagePath;
  }
  
  // Fallback to local image
  return "/image/muz1.jpg";
};

/**
 * Handles image loading errors by setting a fallback image
 * @param {Event} event - The error event from the img element
 */
export const handleImageError = (event) => {
  console.error('❌ Team member image failed to load:', event.target.src);
  
  // Try different fallback images in sequence
  const fallbackImages = [
    '/image/muz1.jpg',
    '/image/muz2.jpg',
    '/image/muz3.jpg',
    '/image/blf_logo.png'
  ];
  
  // Get current fallback attempt or start with first
  const currentSrc = event.target.src;
  let nextFallbackIndex = 0;
  
  fallbackImages.forEach((fallback, index) => {
    if (currentSrc.includes(fallback.replace('/image/', ''))) {
      nextFallbackIndex = (index + 1) % fallbackImages.length;
    }
  });
  
  event.target.src = fallbackImages[nextFallbackIndex];
  
  // Prevent infinite error loop
  if (nextFallbackIndex === 0 && currentSrc.includes('muz1.jpg')) {
    event.target.onerror = null;
  }
};

/**
 * Logs successful image loads for debugging
 * @param {string} memberName - Name of the team member
 */
export const handleImageLoad = (memberName) => {
  console.log(`Image loaded successfully for ${memberName}`);
};