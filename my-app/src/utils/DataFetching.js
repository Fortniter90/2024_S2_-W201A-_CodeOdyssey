import { db } from "../config/firebase";
import { collection, getDocs, doc, getDoc, query, orderBy, where, updateDoc } from "firebase/firestore";

// Fetch all courses 
export const fetchCourses = async () => {
  try {
    const coursesCollection = collection(db, 'courses'); // Reference to the courses collection
    const coursesSnapshot = await getDocs(coursesCollection); // Fetch all documents in the collection

    // Map through the documents and include their IDs
    const coursesList = coursesSnapshot.docs.map(doc => ({
      id: doc.id, // Get the document ID
      ...doc.data(), // Spread the document data
    }));

    return coursesList; // Return the list of courses
  } catch (error) {
    console.error("Error fetching courses:", error); // Handle any errors
    throw error;
  }
};

// Fetch all lessons based on course ID
export const fetchLessons = async (courseId) => {
  if (!courseId) return;

  try {
    const lessonsCollection = query(collection(db, `courses/${courseId}/lessons`), orderBy('number'));
    const lessonSnapshot = await getDocs(lessonsCollection);

    // Map through the documents and include their IDs
    const lessonList = lessonSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return lessonList;
  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }
};

// Fetch all tests based on course ID and lesson ID
export const fetchTests = async (courseId, lessonId) => {
  if (!courseId || !lessonId) return;

  try {
    const testsCollection = query(collection(db, `courses/${courseId}/lessons/${lessonId}/tests`), orderBy('number'));
    const testSnapshot = await getDocs(testsCollection);

    // Map through the documents and include their IDs
    const testList = testSnapshot.docs.map(doc => ({
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

// Fetch all admin user accounts
export const loadAdmins = async () => {
  try {
    const usersQuery = query(collection(db, 'users'), where('admin', '==', true));
    const querySnapshot = await getDocs(usersQuery);
    const adminUsers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return adminUsers;
  } catch (error) {
    console.error('Error loading admins:', error);
  }
};

export const fetchUserEmailByUID = async (uid) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('User email:', userData.email);
      return userData.email;
    } else {
      console.log('No such user found!');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

// Function to fetch all users
export const fetchAllUsers = async () => {
  try {
    const usersCollection = collection(db, 'users'); // Adjust 'users' to your Firestore collection name
    const usersSnapshot = await getDocs(usersCollection);
    const usersList = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() // Assuming your user data is stored directly in the document
    }));
    return usersList;
  } catch (error) {
    console.error("Error fetching users: ", error);
    return []; // Return an empty array on error
  }
};

export const setAdminStatus = async (userId, isAdmin) => {
  // Implement the logic to update the user's admin status in Firestore
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { admin: isAdmin });
};

export const fetchUserAnswerData = async (usersId) => {
  try {
    // Fetch all answers for the user
    const answersCollection = collection(db, `users/${usersId}/answers`);
    const answersSnapshot = await getDocs(answersCollection);

    // Map over the documents to create an array of answer data
    const answers = answersSnapshot.docs.map(doc => ({
      id: doc.id, // Store the document ID
      ...doc.data(), // Spread the answer data
    }));

    if (answers.length > 0) {
      const firstAnswer = answers[0];

      // Fetch all tests for the course and lesson
      const allTests = await fetchTests(firstAnswer.courseId, firstAnswer.lessonId);
      const allLessons = await fetchLessons(firstAnswer.courseId);

      return { answers, allTests, allLessons }; // Return fetched data
    }

    return { answers, allTests: [], allLessons: [] }; // Return empty if no answers found
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error fetching data."); // Throw error to be handled in the component
  }
};
