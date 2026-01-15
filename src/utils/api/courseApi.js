import apiClient from './apiClient';
import { COURSES } from './apiEndpoints';

export const courseAPI = {
    createCourse: async (courseData) => {
        const response = await apiClient.post(COURSES.createCourse, courseData);
        return response.data;
    },
    updateCourse: async (id, courseData) => {
        const response = await apiClient.put(`${COURSES.createCourse}/${id}`, courseData);
        return response.data;
    },
    updateStudentCount: async (id, studentCount) => {
        try {
            const response = await apiClient.patch(
                `${COURSES.createCourse}/${id}`,
                { students: studentCount }
            );
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    deleteCourse: async (id) => {
        const response = await apiClient.delete(`${COURSES.createCourse}/${id}`);
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
