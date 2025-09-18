import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance for team operations
const teamAPI = axios.create({
  baseURL: `${API_URL}/team`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests (for authenticated routes)
teamAPI.interceptors.request.use(
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
teamAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const teamService = {
  // Get all team members (public)
  getAllTeamMembers: async (params = {}) => {
    const response = await teamAPI.get('/', { params });
    return response.data;
  },

  // Get all team members for About page (public - shows all active members)
  getTeamMembersForAbout: async () => {
    const response = await teamAPI.get('/about');
    return response.data;
  },

  // Get active team members only (public)
  getActiveTeamMembers: async () => {
    const response = await teamAPI.get('/active');
    return response.data;
  },

  // Get team member by ID (public)
  getTeamMemberById: async (id) => {
    const response = await teamAPI.get(`/${id}`);
    return response.data;
  },

  // Create team member (admin only)
  createTeamMember: async (teamData) => {
    const response = await teamAPI.post('/', teamData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Update team member (admin only)
  updateTeamMember: async (id, teamData) => {
    const response = await teamAPI.put(`/${id}`, teamData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete team member (admin only)
  deleteTeamMember: async (id) => {
    const response = await teamAPI.delete(`/${id}`);
    return response.data;
  },

  // Toggle team member status (admin only)
  toggleStatus: async (id) => {
    const response = await teamAPI.patch(`/${id}/toggle-status`);
    return response.data;
  },

  // Upload team member image
  uploadImage: async (id, imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await teamAPI.post(`/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete team member image
  deleteImage: async (id) => {
    const response = await teamAPI.delete(`/${id}/image`);
    return response.data;
  },

  // Get team statistics (admin only)
  getTeamStats: async () => {
    const response = await teamAPI.get('/statistics');
    return response.data;
  },

  // Get team members by department (public)
  getByDepartment: async (department) => {
    const response = await teamAPI.get(`/department/${department}`);
    return response.data;
  },

  // Search team members (public)
  searchTeamMembers: async (query) => {
    const response = await teamAPI.get('/search', {
      params: { q: query }
    });
    return response.data;
  },
};

export default teamService;