import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const propertyAPI = axios.create({
  baseURL: `${API_URL}/properties`,
  headers: { Accept: 'application/json' }
});

propertyAPI.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

propertyAPI.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const propertyService = {
  getProperties: async (params = {}) =>
    (await propertyAPI.get('/', { params })).data,

  getPropertyById: async id =>
    (await propertyAPI.get(`/${id}`)).data,

  searchProperties: async searchData =>
    (await propertyAPI.post('/search', searchData)).data,

  expressInterest: async (propertyId, message = '') =>
    (await propertyAPI.post(`/${propertyId}/interest`, { message })).data,

  createProperty: async propertyData =>
    (await propertyAPI.post('/', propertyData)).data,

  updateProperty: async (id, propertyData) =>
    (await propertyAPI.put(`/${id}`, propertyData)).data,

  deleteProperty: async id =>
    (await propertyAPI.delete(`/${id}`)).data,

  getUserProperties: async () =>
    (await propertyAPI.get('/user/my-properties')).data,

  getAllProperties: async (filters = {}) =>
    (await propertyAPI.get('/', { params: filters })).data,

  getPropertyAnalytics: async id =>
    (await propertyAPI.get(`/${id}/analytics`)).data,

  uploadImages: async (propertyId, images) => {
    const formData = new FormData();
    images.forEach(image => formData.append('images', image));
    return (await propertyAPI.post(`/${propertyId}/images`, formData)).data;
  },

  deleteImage: async (propertyId, imageId) =>
    (await propertyAPI.delete(`/${propertyId}/images/${imageId}`)).data,

  getPropertyStats: async () =>
    (await propertyAPI.get('/statistics')).data
};

export default propertyService;
