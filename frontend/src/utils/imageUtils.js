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
  
  // Very simple - just add backend URL to the path
  return `http://localhost:5000${profileImagePath}`;
};

/**
 * Handles image loading errors by setting a fallback image
 * @param {Event} event - The error event from the img element
 */
export const handleImageError = (event) => {
  console.error('Image failed to load:', event.target.src);
  event.target.src = "/image/muz1.jpg";
};

/**
 * Logs successful image loads for debugging
 * @param {string} memberName - Name of the team member
 */
export const handleImageLoad = (memberName) => {
  console.log(`Image loaded successfully for ${memberName}`);
};