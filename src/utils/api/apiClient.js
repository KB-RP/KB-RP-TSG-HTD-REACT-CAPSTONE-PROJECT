import axios from 'axios';

// Get base URL from environment variable with fallback
const API_URL = 'http://localhost:8000';

export const redirectToSignIn = () => {
  if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') return;
  if (typeof window === 'undefined') return;
  window.location.assign('/signIn');
};

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
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

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      localStorage.removeItem('token');
      redirectToSignIn();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
