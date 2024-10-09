import { db } from "../config/firebase";
import { collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";

// Fetch all courses 
export const fetchCourses = async () => {
  try {
    const coursesCollection = collection(db, 'courses');
    const coursesSnapshot = await getDocs(coursesCollection);
    const coursesData = {};
    coursesSnapshot.forEach((doc) => {
      coursesData[doc.id] = doc.data();
    });
    return coursesData;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

// Fetch all lessons based on course ID
export const fetchLessons = async (courseId) => {
  try {
    const lessonsCollection = collection(db, `courses/${courseId}/lessons`);
    const lessonsQuery = query(lessonsCollection, orderBy('number'));
    const lessonsSnapshot = await getDocs(lessonsQuery);
    const lessonsData = {};
    lessonsSnapshot.forEach((doc) => {
      lessonsData[doc.id] = doc.data();
    });
    return lessonsData;
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw error;
  }
};

// Fetch all tests based on course ID and lesson ID
export const fetchTests = async (courseId, lessonId) => {
  try {
    const testsCollection = collection(db, `courses/${courseId}/lessons/${lessonId}/tests`);
    const testsQuery = query(testsCollection, orderBy('number'));
    const testsSnapshot = await getDocs(testsQuery);
    const testsData = {};
    testsSnapshot.forEach((doc) => {
      testsData[doc.id] = doc.data();
    });
    return testsData;
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};

// Fetch specific user answer by userId and answerId
export const fetchUserAnswer = async (userId, answerId) => {
  try {
    const answerRef = doc(db, `users/${userId}/answers/${answerId}`);
    const answerDoc = await getDoc(answerRef);

    if (answerDoc.exists()) {
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
    const userDocRef = doc(db, `users/${userId}`);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
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
