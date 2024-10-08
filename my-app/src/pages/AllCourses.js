import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import NavigationBarUser from '../components/NavigationBarUser';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import "./AllCourses.css";
import Button from '../components/Button';

const AllCourses = () => {
  const { isAuthenticated, usersId } = useAuth(); // Extracting user info
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch all courses from Firestore
        const coursesCollection = collection(db, 'courses');
        const courseSnapshot = await getDocs(coursesCollection);
        const courseList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        setCourses(courseList); // Set the courses state with fetched courses
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false); // Set loading to false after data fetch
      }
    };

    fetchCourses();
  }, []);

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