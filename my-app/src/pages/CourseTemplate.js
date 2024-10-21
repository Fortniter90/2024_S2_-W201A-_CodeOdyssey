import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CourseHeadings from '../components/CourseHeadings';
import LearningPath from '../components/LearningPath';
import { useAuth } from '../context/AuthContext';
import "./CourseTemplate.css";
import { fetchCourses, fetchLessons } from '../utils/dataFetching';
import { updateUserCourseData } from '../utils/dataSaving';
import NavigationBar from '../components/NavigationBar';

const CourseTemplate = () => {
  const { currentUser } = useAuth(); // Extracting user info
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
          await updateUserCourseData(currentUser.uid, courseId);
        } else {
          console.error('Course not found');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    fetchCourse();
  }, [courseId]); // Dependencies

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
      <NavigationBar />

      <div className='course-content'>
        <CourseHeadings title={course.title} information={course.description} color={course.color} />
        <LearningPath courseId={course.id} userId={currentUser.uid} />
      </div>
    </div>
  );
};

export default CourseTemplate;