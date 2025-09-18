import axios from 'axios';

// Create axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

console.log('AuthService: API baseURL configured as:', API.defaults.baseURL);
console.log('AuthService: Environment REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    console.log('AuthService: Making request to:', config.url);
    console.log('AuthService: Request method:', config.method);
    console.log('AuthService: Request data:', config.data);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('AuthService: Added auth token to request');
    } else {
      console.log('AuthService: No auth token found');
    }
    return config;
  },
  (error) => {
    console.error('AuthService: Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
API.interceptors.response.use(
  (response) => {
    console.log('AuthService: Successful response:', response.status, response.data);
    return response;
  },
  async (error) => {
    console.error('AuthService: Response error:', error);
    console.error('AuthService: Error response:', error.response);
    console.error('AuthService: Error message:', error.message);
    console.error('AuthService: Error code:', error.code);
    
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/auth/refresh-token`,
            { refreshToken }
          );

          const { token, refreshToken: newRefreshToken } = response.data.data;
          
          localStorage.setItem('token', token);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          originalRequest.headers['Authorization'] = `Bearer ${token}`;

          return API(originalRequest);
        }
      } catch (refreshError) {
        console.error('AuthService: Refresh token failed:', refreshError);
        // Refresh failed, logout user
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
  // Set auth token in headers
  setAuthToken: (token) => {
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common['Authorization'];
    }
  },

  // Auth endpoints
  login: (credentials) => {
    console.log('AuthService: Making login request to:', `${API.defaults.baseURL}/auth/login`);
    return API.post('/auth/login', credentials);
  },
  register: (userData) => {
    console.log('AuthService: Making register request to:', `${API.defaults.baseURL}/auth/register`);
    console.log('AuthService: Register data:', userData);
    return API.post('/auth/register', userData);
  },
  logout: () => API.post('/auth/logout'),
  
  // Profile endpoints
  getProfile: () => API.get('/auth/profile'),
  updateProfile: (userData) => API.put('/auth/profile', userData),
  changePassword: (passwordData) => API.put('/auth/change-password', passwordData),
  
  // Password reset
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => API.post('/auth/reset-password', { token, newPassword }),
  
  // Token refresh
  refreshToken: (refreshToken) => API.post('/auth/refresh-token', { refreshToken }),
};

export default authService;
export { API };