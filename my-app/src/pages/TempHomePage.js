import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const TempHomePage = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
    try {
      const coursesCollection = collection(db, 'courses');
      const courseSnapshot = await getDocs(coursesCollection);
      const courseList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(courseList);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

    fetchCourses();
  }, []);

    return (
        <div>
            <h1>This is a tempory home page for testing.</h1>

            <Link to={'/developerdashboard'}>Link to developer dashboard to manage courses, lessons, and tests</Link>
            
            <h3>Courses</h3>
            <ul>
                {courses.map((course) => (
                <li key={course.id}>
                    <Link to={`/course/${course.id}`}>{course.title}</Link>
                </li>
                ))}
            </ul>
        </div>
    );
};

export default TempHomePage;