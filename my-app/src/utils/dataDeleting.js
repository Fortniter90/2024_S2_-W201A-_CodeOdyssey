import axios from 'axios';
const backendUrl = 'http://localhost:8080';

// Function to delete a course
export const deleteCourse = async (courseId) => {
  try {
    console.log("womp womp");
    const response = await axios.delete(`${backendUrl}/delete/courses/${courseId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error deleting course: ${error.response?.data?.message || error.message}`);
  }
};

// Function to delete a lesson
export const deleteLesson = async (courseId, lessonId) => {
  try {
    const response = await axios.delete(`${backendUrl}/delete/courses/${courseId}/lessons/${lessonId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error deleting lesson: ${error.response?.data?.message || error.message}`);
  }
};

// Function to delete a test
export const deleteTest = async (courseId, lessonId, testId) => {
  try {
    const response = await axios.delete(`${backendUrl}/delete/courses/${courseId}/lessons/${lessonId}/tests/${testId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Error deleting test: ${error.response?.data?.message || error.message}`);
  }
};

