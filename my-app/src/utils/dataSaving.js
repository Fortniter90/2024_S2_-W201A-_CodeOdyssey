import { addDoc, collection, doc, getDoc, getFirestore, increment, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../config/firebase";
import axios from 'axios';
const backendUrl = 'http://localhost:8080';

// Function to save a new course
export const saveCourse = async (courseData) => {
  try {
    const response = await axios.post(`${backendUrl}/save/courses`, courseData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error saving course: ${error.response?.data?.error || error.message}`);
  }
};

// Function to update an existing course
export const updateCourse = async (courseId, updatedCourseData) => {
  try {
    const response = await axios.put(`${backendUrl}/save/courses/${courseId}`, updatedCourseData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error updating course: ${error.response?.data?.error || error.message}`);
  }
};

// Function to save a new lesson
export const saveLesson = async (courseId, lessonData) => {
  try {
    console.log(lessonData);
    const response = await axios.post(`${backendUrl}/save/courses/${courseId}/lessons`, lessonData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error saving lesson: ${error.response?.data?.error || error.message}`);
  }
};

// Function to update an existing lesson
export const updateLesson = async (courseId, lessonId, lessonData) => {
  try {
    const response = await axios.put(`${backendUrl}/save/courses/${courseId}/lessons/${lessonId}`, lessonData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error updating lesson: ${error.response?.data?.error || error.message}`);
  }
};

// Function to save a new test
export const saveTest = async (courseId, lessonId, testData) => {
  try {
    const response = await axios.post(`${backendUrl}/save/courses/${courseId}/lessons/${lessonId}/tests`, testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error saving test: ${error.response?.data?.error || error.message}`);
  }
};

// Function to update an existing test
export const updateTest = async (courseId, lessonId, testId, testData) => {
  try {
    const response = await axios.put(`${backendUrl}/save/courses/${courseId}/lessons/${lessonId}/tests/${testId}`, testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error updating test: ${error.response?.data?.error || error.message}`);
  }
};

// Function to update user lessons
export const updateUserLessons = async (userId, levels, lesson, courseId) => {
  try {
    const response = await axios.put(`${backendUrl}/save/users/${userId}/lessons`, { levels, lesson, courseId }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error updating user lessons: ${error.response?.data?.error || error.message}`);
  }
};

// Function to update user course data
export const updateUserCourseData = async (userId, courseId) => {
  try {
    const response = await axios.put(`${backendUrl}/save/users/${userId}/courses/${courseId}`, {}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error updating user course data: ${error.response?.data?.error || error.message}`);
  }
};

// Function to save user answers
export const saveUserAnswers = async (userId, courseId, lessonId, tests, userAnswers) => {
  try {
    const response = await axios.post(`${backendUrl}/save/users/${userId}/answers`, { courseId, lessonId, tests, userAnswers }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error saving user answers: ${error.response?.data?.error || error.message}`);
  }
};


export const updateUserProfilePicture = async (userId, imageFile) => {
  try {
    console.log("Starting updateUserData...");
    console.log("Received userId:", userId);

    if (!imageFile) {
      throw new Error("No image file provided.");
    }

    // Ensure the imageFile is a Blob or File object, not a string
    console.log("Image file found, preparing to upload:", imageFile);
    const storage = getStorage();
    const storageRef = ref(storage, `profile_pictures/${userId}`); // Use userId for uniqueness

    // Upload the blob or file
    const snapshot = await uploadBytes(storageRef, imageFile);
    console.log("Image uploaded successfully:", snapshot);

    // Get the download URL
    const profilePicture = await getDownloadURL(storageRef);
    console.log("Download URL for profile picture:", profilePicture);

    // Update profile picture in the backend
    const response = await axios.put(`${backendUrl}/auth/updateprofilepicture/${userId}`, { profilePicture }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("Profile picture updated successfully:", response.data);
  } catch (error) {
    throw new Error(`Error updating profile picture: ${error.response?.data?.error || error.message}`);
  }
};

// Function to update username
export const updateUsername = async (userId, name) => {
  try {
    await axios.put(`${backendUrl}/auth/updateusername/${userId}`, { name }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    throw new Error(`Error updating username: ${error.response?.data?.error || error.message}`);
  }
};

export const setAdminStatus = async (userId, isAdmin) => {
  try {
    await axios.put(`${backendUrl}/auth/users/${userId}/admin`, {
      isAdmin: isAdmin
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    throw new Error('Error updating admin status:', error.response?.data?.error || error.message);
  }
};


export const submitFeedback = async (userId, userEmail, feedback) => {
  try {
    await axios.post(`${backendUrl} / save / feedback / ${userId}`, {
      userEmail: userEmail,
      feedback: feedback
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    throw new Error('Error saving feedback:', error.response?.data?.error || error.message);
  }
};
