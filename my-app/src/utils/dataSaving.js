import { addDoc, collection, doc, getDoc, getFirestore, increment, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../config/firebase";



// Function to add a new course
export const saveCourse = async (courseData) => {
  try {
    const newCourseRef = collection(db, 'courses');
    await addDoc(newCourseRef, courseData);

  } catch (error) {
    console.error('Error saving course:', error);
    throw error;
  }
};

// Function to update a prexisting course
export const updateCourse = async (courseId, updatedCourseData) => {
  try {
    const courseRef = doc(db, `courses/${courseId}`);
    await updateDoc(courseRef, updatedCourseData);

  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

// Function to add a new lesson
export const saveLesson = async (courseId, lessonData) => {
  try {
    const newLessonRef = collection(db, `courses/${courseId}/lessons`);
    await addDoc(newLessonRef, lessonData);

    // Increment the lessonCount in the course document
    const courseRef = doc(db, `courses/${courseId}`);
    await updateDoc(courseRef, {
      lessonCount: increment(1), // Increment lessonCount by 1
    });
      
  } catch (error) {
    console.error('Error saving lesson:', error);
    throw error;
  }
};

// Function to update a prexisting lesson
export const updateLesson = async (courseId, lessonId, lessonData) => {
  try {
    const lessonRef = doc(db, `courses/${courseId}/lessons/${lessonId}`);
    await updateDoc(lessonRef, lessonData);

  } catch (error) {
    console.error('Error updating lesson:', error);
    throw error;
  }
};

// Function to add a new test
export const saveTest = async (courseId, lessonId, testData) => {
  try {
    const newTestRef = collection(db, `courses/${courseId}/lessons/${lessonId}/tests`);
    await addDoc(newTestRef, testData);

    // Increment the testCount in the course document and lesson document
    const courseRef = doc(db, `courses/${courseId}`);
    await updateDoc(courseRef, {
      testCount: increment(1), // Increment testCount by 1
    });
    const lessonRef = doc(db, `courses/${courseId}/lessons/${lessonId}`);
    await updateDoc(lessonRef, {
      testCount: increment(1), // Increment testCount by 1
    });
      
  } catch (error) {
    console.error('Error saving lesson:', error);
    throw error;
  }
};

// Function to update a prexisting test
export const updateTest = async (courseId, lessonId, testId, testData) => {
  try {
    const testRef = doc(db, `courses/${courseId}/lessons/${lessonId}/tests/${testId}`);
    await updateDoc(testRef, testData);

  } catch (error) {
    console.error('Error updating lesson:', error);
    throw error;
  }
};

// Function to update the users lesson list
export const updateUserLessons = async (userId, levels, lesson, courseId) => {
  try {
    const completedLessons = levels
      .filter(level => level.number <= lesson.number)
      .map(level => level.id);

    const currentLessonIndex = levels.findIndex(level => level.id === lesson.id);

    const nextLesson = levels[currentLessonIndex + 1];

    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      [`courses.${courseId}.completedLessons`]: completedLessons,
      [`courses.${courseId}.currentLesson`]: nextLesson ? nextLesson.id : null 
    });
    
  } catch (error) {
    console.error("Error updating current lesson:", error);
  }
};

export const updateUserCourseData = async (userId, courseId) => {
  try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
          const userData = userSnap.data();
          const userCourses = userData.courses || {};

          if (!userCourses[courseId]) {
              // Add a new entry to the user's courses map if it doesn't exist
              await updateDoc(userRef, {
                  [`courses.${courseId}`]: {
                      currentLesson: '', // Empty string for currentLesson
                      completedLessons: [] // Empty array for completedLessons
                  }
              });
          }
      } else {
          console.error('User not found');
      }
  } catch (error) {
      console.error('Error updating user course data:', error);
  }
};

// Function to save answers to Firestore
export const saveUserAnswers = async (usersId, courseId, lessonId, tests, userAnswers) => {
  if (!usersId) {
      throw new Error('User ID is not available. Please log in.');
  }

  console.log('Saving answers for user:', usersId);

  try {
      for (let i = 0; i < tests.length; i++) {
          const answerData = {
              courseId,
              lessonId,
              testId: tests[i].id,
              userAnswer: userAnswers[i],
          };

          console.log('Saving answer data:', answerData);

          // Automatically generate a unique ID when adding a new answer document
          const docRef = await addDoc(collection(db, `users/${usersId}/answers`), answerData);
          console.log('Document written with ID: ', docRef.id);
      }

      return true; // Indicate success
  } catch (error) {
      console.error('Error saving answers:', error);
      throw new Error('Failed to save answers. Please try again.'); // Propagate error
  }
};

// Function to update user data
export const updateUserData = async (userId, userData) => {
    try {
        const { username, imageFile, currentProfilePicture } = userData;

        let profilePicture = currentProfilePicture;

        if (imageFile) {
            const storage = getStorage();
            const storageRef = ref(storage, `profile_pictures/${imageFile.name}`);
            const snapshot = await uploadBytes(storageRef, imageFile);
            console.log("Image uploaded successfully:", snapshot);
            profilePicture = await getDownloadURL(storageRef);
        }

        const db = getFirestore();
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            username: username,
            profilePicture: profilePicture
        });

        console.log("User data updated successfully.");

    } catch (error) {
        console.error("Error updating user data:", error);
    }
};