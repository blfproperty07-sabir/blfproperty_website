import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
  timeout: 10000,
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/auth/refresh-token`,
            { refreshToken }
          );

          const authPayload = response.data?.data || response.data;
          const { token, refreshToken: newRefreshToken } = authPayload;
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);

          API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          originalRequest.headers['Authorization'] = `Bearer ${token}`;

          return API(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const authService = {
  setAuthToken: (token) => {
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common['Authorization'];
    }
  },
  login: (credentials) => API.post('/auth/login', credentials),
  googleLogin: (credential) => API.post('/auth/google', { credential }),
  register: (userData) => API.post('/auth/register', userData),
  logout: () => API.post('/auth/logout'),
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (userData) => API.put('/auth/profile', userData),
  changePassword: (passwordData) => API.put('/auth/change-password', passwordData),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => API.post('/auth/reset-password', { token, newPassword }),
  refreshToken: (refreshToken) => API.post('/auth/refresh-token', { refreshToken }),
};

export default authService;
export { API };

