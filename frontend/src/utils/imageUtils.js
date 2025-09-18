// Utility functions for image handling

/**
 * Constructs a proper image URL for team member profile images
 * @param {string} profileImagePath - The profileImage path from the database
 * @param {boolean} addCacheBuster - Whether to add cache busting parameter
 * @returns {string} - Complete image URL
 */
export const getTeamMemberImageUrl = (profileImagePath, addCacheBuster = true) => {
  console.log('🖼️ getTeamMemberImageUrl called with:', profileImagePath);
  console.log('🖼️ Type of profileImagePath:', typeof profileImagePath);
  console.log('🖼️ Is empty?', !profileImagePath || profileImagePath.trim() === '');
  
  if (!profileImagePath || profileImagePath.trim() === '') {
    console.log('🔄 No profileImagePath provided, using default fallback');
    return "/image/muz1.jpg"; // Default fallback image
  }

  // Ensure the path starts with /uploads/team
  let imagePath;
  if (profileImagePath.startsWith('/uploads/team/')) {
    imagePath = profileImagePath;
  } else if (profileImagePath.startsWith('/uploads/')) {
    imagePath = profileImagePath;
  } else {
    // If just the filename is provided, add the full path
    imagePath = `/uploads/team/${profileImagePath}`;
  }

  // Build the complete URL - Direct serve from backend static files
  const baseUrl = 'http://localhost:5000'; // Backend static file server
  let imageUrl = `${baseUrl}${imagePath}`;
  
  // Add cache buster if requested
  if (addCacheBuster) {
    imageUrl += `?v=${Date.now()}`;
  }

  // Enhanced logging for debugging
  console.log('🖼️ === IMAGE URL DEBUG ===');
  console.log('🖼️ Original profileImagePath:', profileImagePath);
  console.log('🖼️ Processed imagePath:', imagePath);
  console.log('🖼️ Base URL:', baseUrl);
  console.log('🖼️ Final imageUrl:', imageUrl);
  console.log('🖼️ ========================');

  return imageUrl;
};

/**
 * Handles image loading errors by setting a fallback image
 * @param {Event} event - The error event from the img element
 */
export const handleImageError = (event) => {
  console.error('❌ === IMAGE LOADING ERROR ===');
  console.error('❌ Failed to load image:', event.target.src);
  console.error('❌ Original src attribute:', event.target.getAttribute('src'));
  console.error('❌ Error details:', event);
  console.error('❌ Setting fallback image: /image/muz1.jpg');
  console.error('❌ ===========================');
  
  // Only set fallback if not already set to prevent infinite loop
  if (!event.target.src.includes('/image/muz1.jpg')) {
    event.target.src = "/image/muz1.jpg";
  }
};

/**
 * Logs successful image loads for debugging
 * @param {string} memberName - Name of the team member
 */
export const handleImageLoad = (memberName) => {
  console.log(`✅ Successfully loaded image for ${memberName}`);
};