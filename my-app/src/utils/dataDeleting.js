import { deleteDoc, doc, increment, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Function to delete a course
export const deleteCourse = async (courseId) => {
  try {
    const courseRef = doc(db, 'courses', courseId);
    await deleteDoc(courseRef);
    
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// Function to delete a lesson
export const deleteLesson = async (courseId, lessonId) => {
  try {
    const lessonRef = doc(db, `courses/${courseId}/lessons/${lessonId}`);
    await deleteDoc(lessonRef);

    // Derement the lessonCount in the course document
    const courseRef = doc(db, `courses/${courseId}`);
    await updateDoc(courseRef, {
      lessonCount: increment(-1), // Decrement lessonCount by 1
    });
      
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
};

// Function to delete a test
export const deleteTest = async (courseId, lessonId, testId) => {
  try {
    const testRef = doc(db, `courses/${courseId}/lessons/${lessonId}/tests/${testId}`);
    await deleteDoc(testRef);

    // Derement the lessonCount in the course document and lesson document
    const courseRef = doc(db, `courses/${courseId}`);
    await updateDoc(courseRef, {
      testCount: increment(1), // Decrement testCount by 1
    });
    const lessonRef = doc(db, `courses/${courseId}/lessons/${lessonId}`);
    await updateDoc(lessonRef, {
      testCount: increment(1), // Decrement testCount by 1
    });
      
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
};