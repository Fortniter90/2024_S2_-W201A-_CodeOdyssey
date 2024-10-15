import axios from 'axios';
const backendUrl = 'http://localhost:8080';

// Function to save a new course
export const saveCourse = async (courseData) => {
  try {
    const response = await axios.post(`${backendUrl}/save/courses`, courseData);
    return response.data;
  } catch (error) {
    throw new Error(`Error saving course: ${error.response?.data?.error || error.message}`);
  }
};

// Function to update an existing course
export const updateCourse = async (courseId, updatedCourseData) => {
  try {
    const response = await axios.put(`${backendUrl}/courses/${courseId}`, updatedCourseData);
    return response.data;
  } catch (error) {
    throw new Error(`Error updating course: ${error.response?.data?.error || error.message}`);
  }
};

// Function to save a new lesson
export const saveLesson = async (courseId, lessonData) => {
  try {
    const response = await axios.post(`${backendUrl}/save/courses/${courseId}/lessons`, lessonData);
    return response.data;
  } catch (error) {
    throw new Error(`Error saving lesson: ${error.response?.data?.error || error.message}`);
  }
};

// Function to update an existing lesson
export const updateLesson = async (courseId, lessonId, lessonData) => {
  try {
    const response = await axios.put(`${backendUrl}/save/courses/${courseId}/lessons/${lessonId}`, lessonData);
    return response.data;
  } catch (error) {
    throw new Error(`Error updating lesson: ${error.response?.data?.error || error.message}`);
  }
};

// Function to save a new test
export const saveTest = async (courseId, lessonId, testData) => {
  try {
    const response = await axios.post(`${backendUrl}/save/courses/${courseId}/lessons/${lessonId}/tests`, testData);
    return response.data;
  } catch (error) {
    throw new Error(`Error saving test: ${error.response?.data?.error || error.message}`);
  }
};

// Function to update an existing test
export const updateTest = async (courseId, lessonId, testId, testData) => {
  try {
    const response = await axios.put(`${backendUrl}/save/courses/${courseId}/lessons/${lessonId}/tests/${testId}`, testData);
    return response.data;
  } catch (error) {
    throw new Error(`Error updating test: ${error.response?.data?.error || error.message}`);
  }
};

// Function to update user lessons
export const updateUserLessons = async (userId, levels, lesson, courseId) => {
  try {
    const response = await axios.put(`${backendUrl}/save/users/${userId}/lessons`, { levels, lesson, courseId });
    return response.data;
  } catch (error) {
    throw new Error(`Error updating user lessons: ${error.response?.data?.error || error.message}`);
  }
};

// Function to update user course data
export const updateUserCourseData = async (userId, courseId) => {
  try {
    const response = await axios.put(`${backendUrl}/save/users/${userId}/courses/${courseId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error updating user course data: ${error.response?.data?.error || error.message}`);
  }
};

// Function to save user answers
export const saveUserAnswers = async (userId, courseId, lessonId, tests, userAnswers) => {
  try {
    const response = await axios.post(`${backendUrl}/save/users/${userId}/answers`, { courseId, lessonId, tests, userAnswers });
    return response.data;
  } catch (error) {
    throw new Error(`Error saving user answers: ${error.response?.data?.error || error.message}`);
  }
};

