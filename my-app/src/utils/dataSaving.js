import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";



// Function to add a new course to firestore
export const saveCourse = async (courseData) => {
  try {
    const newCourseRef = await addDoc(collection(db, 'courses'), courseData);
    return newCourseRef;
  } catch (error) {
    console.error('Error saving course:', error);
    throw error;
  }
};