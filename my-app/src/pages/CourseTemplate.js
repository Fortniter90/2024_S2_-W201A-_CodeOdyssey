import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import NavigationBarUser from '../components/NavigationBarUser';
import CourseHeadings from '../components/CourseHeadings';
import LearningPath from '../components/LearningPath';
import { useAuth } from '../context/AuthContext';
import "./CourseTemplate.css";  
import { fetchCourses, fetchLessons } from '../utils/DataFetching';
import { updateUserCourseData } from '../utils/DataSaving';

const CourseTemplate = () => {
  const { currentuser, isAuthenticated, usersId, usersName, usersCourses } = useAuth(); // Extracting user info
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

    // Fetch course data and update user course data
    useEffect(() => {
      const fetchCourse = async () => {
          try {
              const courseList = await fetchCourses(); // Fetch all courses if needed
              const courseData = courseList.find(c => c.id === courseId); // Find the specific course
              
              if (courseData) {
                  setCourse(courseData);

                  // Update user course data
                  await updateUserCourseData(usersId, courseId);
              } else {
                  console.error('Course not found');
              }
          } catch (error) {
              console.error('Error fetching course:', error);
          }
      };

      fetchCourse();
  }, [courseId, usersId]); // Dependencies

  // Fetch lessons for the course
  useEffect(() => {
      const fetchCourseLessons = async () => {
          try {
              const lessonList = await fetchLessons(courseId); // Fetch lessons using the function
              setLessons(lessonList); // Update state with the lessons
          } catch (error) {
              console.error('Error fetching lessons:', error);
          }
      };

      fetchCourseLessons();
  }, [courseId]); // Fetch lessons whenever courseId changes

  if (!course) {
    return <div>Loading course information...</div>;
  }

  return (
    <div>
      <NavigationBarUser />

      <div className='course-content'>
        <CourseHeadings name={course.title} description={course.description} backgroundColor={course.color} />
        <LearningPath courseId={course.id} userId={usersId} />
      </div>
    </div>
  );
};

export default CourseTemplate;
