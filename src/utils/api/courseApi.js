import apiClient from './apiClient';
import { COURSES } from './apiEndpoints';

export const courseAPI = {
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
};
