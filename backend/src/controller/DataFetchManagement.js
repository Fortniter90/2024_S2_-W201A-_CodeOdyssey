import admin from '../config/Firebase.js';
const db = admin.firestore(); // Get Firestore instance from adminconst db = admin.firestore(); // Get Firestore instance from admin

// Fetch all courses
export const fetchCourses = async () => {
  try {
    const coursesSnapshot = await db.collection('courses').get(); // Reference to the courses collection
    const coursesList = coursesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return coursesList;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

// Fetch all lessons based on course ID
export const fetchLessons = async (courseId) => {
  console.log("fetching lessons");
  try {
    const lessonsSnapshot = await db.collection(`courses/${courseId}/lessons`).orderBy('number').get();
    const lessonList = lessonsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(lessonList);
    return lessonList;
  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }
};

// Fetch all tests based on course ID and lesson ID
export const fetchTests = async (courseId, lessonId) => {
  try {
    const testsSnapshot = await db.collection(`courses/${courseId}/lessons/${lessonId}/tests`).orderBy('number').get();
    const testList = testsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return testList;
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};

// Fetch specific user answer by userId and answerId
export const fetchUserAnswer = async (userId, answerId) => {
  try {
    const answerDoc = await db.doc(`users/${userId}/answers/${answerId}`).get();

    if (answerDoc.exists) {
      return answerDoc.data();
    } else {
      return null;
    }

  } catch (error) {
    throw error;
  }
};

// Fetch specific user course information by userId and courseId
export const fetchUserCourseProgress = async (userId, courseId) => {
  try {
    console.log("fetching progress");
    const userSnapshot = await db.doc(`users/${userId}`).get();

    if (userSnapshot.exists) {
      const userCoursesData = userSnapshot.data().courses;
      const courseData = userCoursesData[courseId];
      if (courseData) {
        return courseData;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
};

// Fetch all admin user accounts
export const fetchAdminUsers = async () => {
  try {
    const querySnapshot = await db.collection('users').where('admin', '==', true).get();

    const adminUsers = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const userId = doc.id;
      const userRecord = await admin.auth().getUser(userId); // Fetch the user object that contains the email

      return {
        id: userId,
        email: userRecord.email, // Access the email from the user object
        ...doc.data(),            // Include other fields from the Firestore document
      };
    }));

    return adminUsers;
  } catch (error) {
    console.error('Error loading admins:', error);
    throw new Error('Failed to fetch admin users');
  }
};

// Fetch all users
export const fetchAllUsers = async () => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const usersList = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return usersList;
  } catch (error) {
    console.error("Error fetching users: ", error);
    return [];
  }
};
// Fetch user answer data
export const fetchUserAnswers = async (usersId) => {
  try {
    const answersSnapshot = await db.collection(`users/${usersId}/answers`).get();
    const answers = answersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (answers.length > 0) {
      const firstAnswer = answers[0];

      const allTests = await fetchTests(firstAnswer.courseId, firstAnswer.lessonId);
      const allLessons = await fetchLessons(firstAnswer.courseId);

      return { answers, allTests, allLessons };
    }

    return { answers, allTests: [], allLessons: [] };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data.");
  }
};

