const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
const backendOrigin = apiUrl.replace(/\/api\/?$/, '');

export const getPropertyImageUrl = (image) => {
  const imagePath = typeof image === 'string' ? image : image?.url;

  if (!imagePath) {
    return '';
  }

  if (/^(https?:|data:|blob:)/i.test(imagePath)) {
    return imagePath;
  }

  const normalizedPath = imagePath.replace(/\\/g, '/');

  if (/^\/?uploads\//i.test(normalizedPath)) {
    return `${backendOrigin}/${normalizedPath.replace(/^\/+/, '')}`;
  }

  return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
};
