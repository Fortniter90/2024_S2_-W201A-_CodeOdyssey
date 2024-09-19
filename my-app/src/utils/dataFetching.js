import { db } from "../config/firebase";
import { collection, getDocs } from "firebase/firestore";

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
        const lessonsSnapshot = await getDocs(lessonsCollection);
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
        const testsSnapshot = await getDocs(testsCollection);
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