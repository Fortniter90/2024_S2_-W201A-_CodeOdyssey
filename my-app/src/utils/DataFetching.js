import axios from 'axios';
const backendUrl = 'http://localhost:8080'; // Your backend URL

// Fetch all courses
export const fetchCourses = async () => {
  try {
    const response = await axios.get(`${backendUrl}/course`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

// Fetch all users
export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${backendUrl}/users`);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Fetch lessons based on course ID
export const fetchLessons = async (courseId) => {
  try {
    const response = await axios.get(`${backendUrl}/${courseId}/lessons`);
    return response.data;
  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }
};

// Fetch tests based on course ID and lesson ID
export const fetchTests = async (courseId, lessonId) => {
  try {
    const response = await axios.get(`${backendUrl}/${courseId}/lessons/${lessonId}/tests`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tests:', error);
    throw error;
  }
};

// Fetch user course progress
export const fetchUserCourseProgress = async (userId, courseId) => {
  try {
    const response = await axios.get(`${backendUrl}/users/${userId}/courses/${courseId}/progress`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user course progress:', error);
    throw error;
  }
};

// Fetch all admin users
export const fetchAdminUsers = async () => {
  try {
    const response = await axios.get(`${backendUrl}/users/admin`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin users:', error);
    throw error;
  }
};

// Fetch user answers
export const fetchUsersAnswers = async (userId) => {
  try {
    const response = await axios.get(`${backendUrl}/users/${userId}/answers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user answers:', error);
    throw error;
  }
};

