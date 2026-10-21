import axios from 'axios';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5001/api').replace(/\/+$/, '');

const galleryAPI = axios.create({
  baseURL: `${API_BASE_URL}/gallery`,
  timeout: 30000,
});

galleryAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const galleryService = {
  getImages: async () => {
    const response = await galleryAPI.get('/');
    return response.data;
  },

  uploadImages: async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    const response = await galleryAPI.post('/', formData);
    return response.data;
  },

  deleteImage: async (imageId) => {
    const response = await galleryAPI.delete(`/${imageId}`);
    return response.data;
  },
};

export default galleryService;