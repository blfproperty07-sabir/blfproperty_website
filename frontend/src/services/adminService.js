import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const adminAPI = axios.create({
  baseURL: `${API_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
adminAPI.interceptors.request.use(
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
adminAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const adminService = {
  // Dashboard data
  getDashboardData: async () => {
    const response = await adminAPI.get('/dashboard');
    return response.data;
  },

  // Property management
  getAllProperties: async (params = {}) => {
    console.log('AdminService: Fetching properties with params:', params);
    const response = await adminAPI.get('/properties', { params });
    console.log('AdminService: Properties response:', response.data);
    return response.data;
  },

  approveProperty: async (propertyId) => {
    const response = await adminAPI.patch(`/properties/${propertyId}/approve`);
    return response.data;
  },

  rejectProperty: async (propertyId, reason = '') => {
    const response = await adminAPI.patch(`/properties/${propertyId}/reject`, { reason });
    return response.data;
  },

  deleteProperty: async (propertyId) => {
    const response = await adminAPI.delete(`/properties/${propertyId}`);
    return response.data;
  },

  createRentalProperty: async (propertyData) => {
    const response = await adminAPI.post('/properties', propertyData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // User management
  getAllUsers: async (params = {}) => {
    const response = await adminAPI.get('/users', { params });
    return response.data;
  },

  createAdmin: async (userData) => {
    const response = await adminAPI.post('/users/admin', userData);
    return response.data;
  },

  updateUser: async (userId, userData) => {
    const response = await adminAPI.put(`/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await adminAPI.delete(`/users/${userId}`);
    return response.data;
  },

  toggleUserStatus: async (userId) => {
    const response = await adminAPI.patch(`/users/${userId}/toggle-status`);
    return response.data;
  },

  // Team management
  getAllTeamMembers: async () => {
    const response = await adminAPI.get('/team');
    return response.data;
  },

  createTeamMember: async (teamData) => {
    const response = await adminAPI.post('/team', teamData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateTeamMember: async (memberId, teamData) => {
    const response = await adminAPI.put(`/team/${memberId}`, teamData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteTeamMember: async (memberId) => {
    const response = await adminAPI.delete(`/team/${memberId}`);
    return response.data;
  },

  toggleTeamMemberStatus: async (memberId) => {
    const response = await adminAPI.patch(`/team/${memberId}/toggle-status`);
    return response.data;
  },

  // Inquiry management
  getAllInquiries: async (params = {}) => {
    const response = await adminAPI.get('/inquiries', { params });
    return response.data;
  },

  updateInquiry: async (inquiryId, data) => {
    const response = await adminAPI.put(`/inquiries/${inquiryId}`, data);
    return response.data;
  },

  updateInquiryStatus: async (inquiryId, status, response = null) => {
    const data = { status };
    if (response) {
      data.response = response;
    }
    const apiResponse = await adminAPI.patch(`/inquiries/${inquiryId}/status`, data);
    return apiResponse.data;
  },

  deleteInquiry: async (inquiryId) => {
    const response = await adminAPI.delete(`/inquiries/${inquiryId}`);
    return response.data;
  },

  // System statistics
  getSystemStats: async () => {
    const response = await adminAPI.get('/stats');
    return response.data;
  },

  // Analytics
  getAnalytics: async (type, period = '30d') => {
    const response = await adminAPI.get(`/analytics/${type}`, {
      params: { period }
    });
    return response.data;
  },

  // Settings
  getSettings: async () => {
    const response = await adminAPI.get('/settings');
    return response.data;
  },

  updateSettings: async (settings) => {
    const response = await adminAPI.put('/settings', settings);
    return response.data;
  },

  // Backup and restore
  createBackup: async () => {
    const response = await adminAPI.post('/backup');
    return response.data;
  },

  getBackups: async () => {
    const response = await adminAPI.get('/backups');
    return response.data;
  },

  restoreBackup: async (backupId) => {
    const response = await adminAPI.post(`/backup/${backupId}/restore`);
    return response.data;
  },
};

export default adminService;