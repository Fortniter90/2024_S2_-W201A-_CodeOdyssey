import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import NavigationBarUser from '../components/NavigationBarUser';
import CourseHeadings from '../components/CourseHeadings';
import LearningPath from '../components/LearningPath';
import { useAuth } from '../context/AuthContext';
import "./CourseTemplate.css";
import Footer from '../components/Footer';

const CourseTemplate = () => {
  const { currentuser, isAuthenticated, usersId, usersName, usersCourses } = useAuth(); // Extracting user info
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      const courseRef = doc(db, 'courses', courseId);
      const courseSnap = await getDoc(courseRef);

      if (courseSnap.exists()) {
        setCourse({ id: courseSnap.id, ...courseSnap.data() });
        await updateUserCourseData(courseId);
      } else {
        console.error('Course not found');
      }
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const fetchLessons = async () => {
      if (courseId) {
        const lessonsCollection = collection(db, `courses/${courseId}/lessons`);
        const lessonSnapshot = await getDocs(lessonsCollection);
        const lessonList = lessonSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLessons(lessonList);
      }
    };

    fetchLessons();
  }, [courseId]);

  // Function to update user course data in Firestore
  const updateUserCourseData = async (courseId) => {
    try {
      const userRef = doc(db, 'users', usersId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const userCourses = userData.courses || {};

        if (!userCourses[courseId]) {
          // Add a new entry to the user's courses map if it doesn't exist
          await updateDoc(userRef, {
            [`courses.${courseId}`]: {
              currentLesson: '', // Empty string for currentLesson
              completedLessons: [] // Empty array for completedLesson
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

  if (!course) {
    return <div>Loading course information...</div>;
  }

  return (
    <div>
      <NavigationBarUser />

      <div className='course-content'>
        <CourseHeadings name={course.title} description={course.information} backgroundColor={course.backgroundColor} />
        <LearningPath courseId={course.id} userId={usersId} />
      </div>
    </div>
  );
};

export default CourseTemplate;
