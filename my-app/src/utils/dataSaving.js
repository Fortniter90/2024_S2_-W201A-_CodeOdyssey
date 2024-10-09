import { addDoc, collection, doc, increment, updateDoc } from "firebase/firestore";
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