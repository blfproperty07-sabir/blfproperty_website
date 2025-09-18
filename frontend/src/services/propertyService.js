import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const propertyAPI = axios.create({
  baseURL: `${API_URL}/properties`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
propertyAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
propertyAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const propertyService = {
  // Get all properties (public)
  getProperties: async (params = {}) => {
    const response = await propertyAPI.get('/', { params });
    return response.data;
  },

  // Get property by ID (public)
  getPropertyById: async (id) => {
    const response = await propertyAPI.get(`/${id}`);
    return response.data;
  },

  // Search properties (public)
  searchProperties: async (searchData) => {
    const response = await propertyAPI.post('/search', searchData);
    return response.data;
  },

  // Express interest in property (authenticated)
  expressInterest: async (propertyId, message = '') => {
    const response = await propertyAPI.post(`/${propertyId}/interest`, { message });
    return response.data;
  },

  // Create property (authenticated - seller/admin)
  createProperty: async (propertyData) => {
    const response = await propertyAPI.post('/', propertyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update property (authenticated - owner/admin)
  updateProperty: async (id, propertyData) => {
    const response = await propertyAPI.put(`/${id}`, propertyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete property (authenticated - owner/admin)
  deleteProperty: async (id) => {
    const response = await propertyAPI.delete(`/${id}`);
    return response.data;
  },

  // Get user's properties (authenticated)
  getUserProperties: async () => {
    const response = await propertyAPI.get('/user/my-properties');
    return response.data;
  },

  // Get all properties (including status filter for internal use)
  getAllProperties: async (filters = {}) => {
    const response = await propertyAPI.get('/', { params: filters });
    return response.data;
  },

  // Get property analytics (authenticated - owner/admin)
  getPropertyAnalytics: async (id) => {
    const response = await propertyAPI.get(`/${id}/analytics`);
    return response.data;
  },

  // Upload property images
  uploadImages: async (propertyId, images) => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append('images', image);
    });

    const response = await propertyAPI.post(`/${propertyId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete property image
  deleteImage: async (propertyId, imageId) => {
    const response = await propertyAPI.delete(`/${propertyId}/images/${imageId}`);
    return response.data;
  },

  // Get property statistics
  getPropertyStats: async () => {
    const response = await propertyAPI.get('/statistics');
    return response.data;
  },
};

export default propertyService;