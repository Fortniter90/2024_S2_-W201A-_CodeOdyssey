import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CourseHeadings from '../components/CourseHeadings';
import LearningPath from '../components/LearningPath';
import { useAuth } from '../context/AuthContext';
import "./CourseTemplate.css";
import { fetchCourses, fetchLessons } from '../utils/dataFetching';
import { updateUserCourseData, updateUserLessons } from '../utils/dataSaving';
import NavigationBar from '../components/NavigationBar';

const CourseTemplate = () => {
  const { currentUser } = useAuth(); // Extracting user info
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);

  // Fetch course data and update user course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseList = await fetchCourses(); // Fetch all courses if needed
        const courseData = courseList.find(c => c.id === courseId); // Find the specific course

        if (courseData) {
          setCourse(courseData);

          // Update user course data
          await updateUserCourseData(currentUser.uid, courseId);

        } else {
          console.error('Course not found');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    fetchCourse();
  }, [courseId]); // Dependenciess

  if (!course) {
    return <div>Loading course information...</div>;
  }

  return (
    <div>
      <NavigationBar />

      <div className='course-content'>
        <CourseHeadings course={course} />
        <LearningPath courseId={course.id} userId={currentUser.uid} />
      </div>
    </div>
  );
};

export default CourseTemplate;