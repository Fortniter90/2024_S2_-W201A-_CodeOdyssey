import React, { useState, useEffect } from 'react';
import NavigationBarUser from '../components/NavigationBarUser';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import "./AllCourses.css";
import Button from '../components/Button';
import { fetchCourses } from '../utils/DataFetching';

const AllCourses = () => {
  const { isAuthenticated, usersId } = useAuth(); // Extracting user info
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  // Load courses component on mount
  useEffect(() => {
    loadCourses();
  }, []);

  // Load all of the courses
  const loadCourses = async () => {
    try {
      const courseList = await fetchCourses();  // Fetch list of courses
      setCourses(Object.values(courseList));    // Update the state with the fetched courses

    } catch (error) {
      console.error('Error loading courses:', error); // Log any errors during data fetching
    }
  };

  if (loading) {
    return <div>Loading course information...</div>;
  }

  // Function to navigate to the selected course
  const goToCourse = (courseId) => {
    navigate(`/course/${courseId}`);
  }

  return (
    <div className='allcourses'>
      <NavigationBarUser />

      <div className='allcourses-container'>
        <h1 className='fira-code'>Discover Languages</h1>
        
        
        <div className='allcourses-content'>
          {courses.map(course => (
            <div key={course.id} className='course-block'>
              <h2>{course.title}</h2>

              <Button text={"VIEW COURSE"} />
            </div>
          ))} 

        </div>
      </div>
    </div>
  );
};

export default AllCourses;