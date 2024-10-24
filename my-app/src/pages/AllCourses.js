import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCourses } from '../utils/dataFetching';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import Feedback from '../components/Feedback';
import Button from '../components/Button';
import "./AllCourses.css";

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  // Load courses component on mount
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const courseList = await fetchCourses();  // Fetch list of courses
        setCourses(Object.values(courseList));    // Update the state with the fetched courses
        setLoading(false);

      } catch (error) {
        console.error('Error loading courses:', error); // Log any errors during data fetching
      }
    };

    loadCourses();
  }, []);

  if (loading) {
    return <div>Loading course information...</div>;
  }

  // Function to navigate to the selected course
  const goToCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  }

  return (
    <div>
      <NavigationBar />

      <div className='allcourses-container'>
        <h1 className='fira-code'>Discover Languages</h1>

        <div className='allcourses-content'>
          {courses.map(course => (
            <div className='course-block' key={course.id} style={{ backgroundImage: `linear-gradient(var(--${course.color}-light), var(--${course.color}-medium), var(--${course.color}-dark))` }}>

                <div className='course-block-header'>
                  <h2 className='fira-code'>{course.title}</h2>
                  <p className='roboto-bold'>{course.lessonCount} {course.lessonCount === 1 ? 'Lesson' : 'Lessons'} </p>
                </div>

                <Button text={"VIEW COURSE"} action={() => goToCourse(course.id)}
                  color={`var(--${course.color}-light)`}
                  backgroundColor={`var(--${course.color}-dark)`}
                  hoverColor={`var(--${course.color}-medium)`}
                />
            </div>
          ))}
        </div>
      </div>

      <Feedback />
      <Footer />
    </div>
  );
};

export default AllCourses;