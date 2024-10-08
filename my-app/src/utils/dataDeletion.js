import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Function to delete a course from Firestore
export const deleteCourse = async (courseId) => {
    try {
      const courseRef = doc(db, 'courses', courseId);
  
      // Delete the course document
      await deleteDoc(courseRef);
  
      console.log(`Course ${courseId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };