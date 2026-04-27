import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('edufund_current_user');
  if (user) {
    const parsedUser = JSON.parse(user);
    if (parsedUser.token) {
      config.headers.Authorization = `Bearer ${parsedUser.token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for unified error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

export const authService = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  register: (userData: any) => api.post('/auth/register', userData),
};

export const scholarshipService = {
  getAll: () => api.get('/scholarships'),
  getById: (id: string) => api.get(`/scholarships/${id}`),
  create: (data: any) => api.post('/scholarships', data),
  update: (id: string, data: any) => api.put(`/scholarships/${id}`, data),
  delete: (id: string) => api.delete(`/scholarships/${id}`),
};

export const applicationService = {
  getAll: () => api.get('/applications'),
  getByStudentId: (studentId: string) => api.get(`/applications/student/${studentId}`),
  create: (data: any) => api.post('/applications', data),
  updateStatus: (id: string, status: string) => api.patch(`/applications/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/applications/${id}`),
};

export default api;
