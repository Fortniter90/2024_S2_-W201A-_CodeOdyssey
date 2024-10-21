import admin from '../config/Firebase.js';
const db = admin.firestore(); // Get Firestore instance from adminconst db = admin.firestore(); // Get Firestore instance from admin

// Function to delete a course
export const deleteCourse = async (courseId) => {
  try {
    const courseRef = db.doc(`courses/${courseId}`);
    await courseRef.delete();
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Function to delete a lesson
export const deleteLesson = async (courseId, lessonId) => {
  try {
    const lessonRef = db.doc(`courses/${courseId}/lessons/${lessonId}`);
    await lessonRef.delete();

    // Decrement the lessonCount in the course document
    const courseRef = db.doc(`courses/${courseId}`);
    await courseRef.update({
      lessonCount: admin.firestore.FieldValue.increment(-1), // Decrement lessonCount by 1
    });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
};

// Function to delete a test
export const deleteTest = async (courseId, lessonId, testId) => {
  try {
    const testRef = db.doc(`courses/${courseId}/lessons/${lessonId}/tests/${testId}`);
    await testRef.delete();

    // Decrement the testCount in both the course and lesson documents
    const courseRef = db.doc(`courses/${courseId}`);
    await courseRef.update({
      testCount: admin.firestore.FieldValue.increment(-1), // Decrement testCount by 1
    });

    const lessonRef = db.doc(`courses/${courseId}/lessons/${lessonId}`);
    await lessonRef.update({
      testCount: admin.firestore.FieldValue.increment(-1), // Decrement testCount by 1
    });
  } catch (error) {
    console.error('Error deleting test:', error);
    throw error;
  }
};