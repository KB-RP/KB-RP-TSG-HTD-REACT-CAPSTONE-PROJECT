import apiClient from './apiClient';
import { COURSES } from './apiEndpoints';

export const courseAPI = {


      createCourse: async (courseData) => {
    const response = await api.post('/api/courses', courseData);
    return response.data;
  },
  updateCourse: async (id, courseData) => {
    const response = await api.put(`/api/courses/${id}`, courseData);
    return response.data;
  },
  
    getCourses: async () => {
        try {
            const response = await apiClient.get(COURSES.getCourse);
            if (response.data) {
                return response.data;
            }
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getCourseById: async (id) => {
        try {
            const response = await apiClient.get(`${COURSES.getCourse}/${id}`);
            if (response.data) {
                return response.data;
            }
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },


    enrollInCourse: async (payload) => {
        try {
            const response = await apiClient.post(COURSES.enrollInCourse, payload);
            if (response.data) {
                return response.data;
            }
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getEnrolledCourse: async (id) => {
        try {
            const response = await apiClient.get(`${COURSES.enrollInCourse}?userId=${id}&_expand=course`);
            if (response.data) {
                return response.data;
            }
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};
