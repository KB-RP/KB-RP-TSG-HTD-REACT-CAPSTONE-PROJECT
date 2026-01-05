import apiClient from './apiClient';
import { AUTH } from './apiEndpoints';

export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post(AUTH.LOGIN, credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post(AUTH.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: async () => {
    try {
      await apiClient.post(AUTH.LOGOUT);
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      // Always remove token and redirect, even if API call fails
      localStorage.removeItem('token');
    }
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get(AUTH.PROFILE);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add more authentication related methods as needed
};
