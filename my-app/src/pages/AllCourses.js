import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import NavigationBarUser from '../components/NavigationBarUser';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AllCourses = () => {
  const { isAuthenticated, usersId } = useAuth(); // Extracting user info
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <NavigationBarUser />
      <div>
        <h1>Course List</h1>
        <ul>
          {courses.map(course => (
            <li key={course.id}>
              <Link to={`/courses/${course.id}`}>{course.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AllCourses;