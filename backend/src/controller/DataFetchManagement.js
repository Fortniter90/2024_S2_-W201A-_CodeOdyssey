import admin from '../config/Firebase.js';
const db = admin.firestore(); // Get Firestore instance

// Fetch all courses
export const fetchCourses = async () => {
  try {
    const coursesSnapshot = await db.collection('courses').get(); // Fetch all course documents
    const coursesList = coursesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return coursesList; // Return array of courses
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

// Fetch lessons for a specific course ID
export const fetchLessons = async (courseId) => {
  try {
    const lessonsSnapshot = await db.collection(`courses/${courseId}/lessons`).orderBy('number').get(); // Fetch lessons ordered by 'number'
    const lessonList = lessonsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return lessonList; // Return array of lessons
  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }
};

// Fetch tests for a specific course and lesson
export const fetchTests = async (courseId, lessonId) => {
  try {
    const testsSnapshot = await db.collection(`courses/${courseId}/lessons/${lessonId}/tests`).orderBy('number').get(); // Fetch tests ordered by 'number'
    const testList = testsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return testList; // Return array of tests
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};

// Fetch specific user answer by userId and answerId
export const fetchUserAnswer = async (userId, answerId) => {
  try {
    const answerDoc = await db.doc(`users/${userId}/answers/${answerId}`).get(); // Get specific answer doc
    if (answerDoc.exists) {
      return answerDoc.data(); // Return answer data if exists
    } else {
      return null; // Return null if no document found
    }
  } catch (error) {
    throw error;
  }
};

// Fetch course progress for a specific user and course
export const fetchUserCourseProgress = async (userId, courseId) => {
  try {
    const userSnapshot = await db.doc(`users/${userId}`).get(); // Get user document
    if (userSnapshot.exists) {
      const userCoursesData = userSnapshot.data().courses; // Extract user's course progress
      const courseData = userCoursesData[courseId];
      return courseData || null; // Return specific course data or null
    } else {
      return null; // Return null if no user found
    }
  } catch (error) {
    throw error;
  }
};

// Fetch all admin users
export const fetchAdminUsers = async () => {
  try {
    const querySnapshot = await db.collection('users').where('isAdmin', '==', true).get(); // Query admins
    const adminUsers = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const userId = doc.id;
      const userRecord = await admin.auth().getUser(userId); // Fetch user details from Firebase Auth
      return {
        id: userId,
        name: userRecord.displayName,
        email: userRecord.email,
        ...doc.data(), // Include Firestore data
      };
    }));
    return adminUsers; // Return array of admin users
  } catch (error) {
    console.error('Error loading admins:', error);
    throw new Error('Failed to fetch admin users');
  }
};

// Fetch all users
export const fetchAllUsers = async () => {
  try {
    const usersSnapshot = await db.collection('users').get(); // Fetch all users
    const usersList = await Promise.all(usersSnapshot.docs.map(async (doc) => {
      const userId = doc.id;
      const userRecord = await admin.auth().getUser(userId); // Fetch user details from Firebase Auth
      return {
        id: doc.id,
        name: userRecord.displayName,
        email: userRecord.email,
        ...doc.data() // Include Firestore data
      };
    }));
    return usersList; // Return array of users
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
};

// Fetch user answers and related lessons/tests
export const fetchUserAnswers = async (usersId) => {
  try {
    const answersSnapshot = await db.collection(`users/${usersId}/answers`).get(); // Fetch user's answers
    const answers = answersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (answers.length > 0) {
      const firstAnswer = answers[0];
      const allTests = await fetchTests(firstAnswer.courseId, firstAnswer.lessonId); // Fetch tests related to first answer
      const allLessons = await fetchLessons(firstAnswer.courseId); // Fetch lessons for the course
      return { answers, allTests, allLessons }; // Return combined data
    }

    return { answers, allTests: [], allLessons: [] }; // Return empty if no answers
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data.");
  }
};

// Fetch feedback collection
export const fetchFeedback = async () => {
  try {
    const feedbackSnapshot = await db.collection(`feedback`).get(); // Fetch feedback documents
    const feedback = feedbackSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return feedback; // Return array of feedback
  } catch (error) {
    console.error('Error fetching feedback:', error);
    throw new Error('Failed to fetch feedback');
  }
}

