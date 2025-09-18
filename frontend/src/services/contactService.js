import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance for contact API
const contactAPI = axios.create({
  baseURL: `${API_URL}/contact`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const contactService = {
  // Submit contact form
  submitContactForm: async (formData) => {
    console.log('ContactService: Submitting contact form with data:', formData);
    const response = await contactAPI.post('/submit', formData);
    console.log('ContactService: Contact form response:', response.data);
    return response.data;
  },

  // Get contact submission status
  getContactStatus: async (contactId) => {
    const response = await contactAPI.get(`/status/${contactId}`);
    return response.data;
  },

  // Get inquiry types for dropdown
  getInquiryTypes: async () => {
    const response = await contactAPI.get('/types');
    return response.data;
  },
};

export default contactService;