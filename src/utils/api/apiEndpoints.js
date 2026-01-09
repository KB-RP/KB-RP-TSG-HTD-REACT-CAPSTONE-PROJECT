const API_BASE = 'http://localhost:8000';

export const AUTH = {
  LOGIN: `${API_BASE}/login`,
  REGISTER: `${API_BASE}/register`,
  LOGOUT: `${API_BASE}auth/logout`,
  REFRESH_TOKEN: `${API_BASE}auth/refresh-token`,
  PROFILE: `${API_BASE}auth/me`,
};

// Add more endpoint groups as needed
export const USERS = {
  BASE: `${API_BASE}users`,
  // Add more user-related endpoints here
};

// Example of how to add more API endpoints
export const COURSES = {
  getCourse: `${API_BASE}/courses`,
  enrollInCourse : `${API_BASE}/enrollments`,
  createCourse: `${API_BASE}/courses`,
  editCourse: `${API_BASE}/courses`,
  // Add more course-related endpoints here
};
