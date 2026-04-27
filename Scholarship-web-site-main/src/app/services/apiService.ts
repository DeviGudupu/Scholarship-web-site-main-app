import axios from 'axios';

const API_BASE_URL = '/api';

// Create a professional Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically add Auth Token to every request
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

// Interceptor to handle errors globally and make them readable
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMessage = 'Something went wrong';
    
    if (error.response) {
      // The server responded with a status code outside the 2xx range
      const data = error.response.data;
      if (typeof data === 'string') {
        errorMessage = data;
      } else if (data && data.message) {
        errorMessage = data.message;
      } else {
        errorMessage = JSON.stringify(data);
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'Server is not responding. Please check if the backend is running.';
    } else {
      // Something happened in setting up the request
      errorMessage = error.message;
    }

    console.error('API Error:', errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

// Modular service objects
export const authService = {
  login: (credentials: any) => api.post('/auth/login', credentials),
  sendOtp: (email: string) => api.post('/auth/send-otp', { email }),
  register: (userData: any) => api.post('/auth/register', userData),
};

export const scholarshipService = {
  getAll: () => api.get<any[]>('/scholarships'),
  getById: (id: string) => api.get(`/scholarships/${id}`),
  create: (data: any) => api.post('/scholarships', data),
  update: (id: string, data: any) => api.put(`/scholarships/${id}`, data),
  delete: (id: string) => api.delete(`/scholarships/${id}`),
};

export const applicationService = {
  getAll: () => api.get<any[]>('/applications'),
  getByStudentId: (studentId: string) => api.get<any[]>(`/applications/student/${studentId}`),
  create: (data: any) => api.post('/applications', data),
  updateStatus: (id: string, status: string) => 
    api.patch(`/applications/${id}/status`, status, {
      headers: { 'Content-Type': 'application/json' }
    }),
  delete: (id: string) => api.delete(`/applications/${id}`),
};

export default api;
