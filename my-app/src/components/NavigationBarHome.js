import "./NavigationBarHome.css";
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Link, useNavigate } from 'react-router-dom';

const NavigationBarHome = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const goToLogin = () => {
    navigate('/login');
  }

  const goToSignUp = () => {
    navigate('/signup');
  }

  // Function to handle course selection and navigation
  const handleCourseSelect = (courseId) => {
      navigate(`/course/${courseId}`);
  };

  useEffect(() => {
      const fetchCourses = async () => {
          try {
              const coursesCollection = collection(db, 'courses');
              const courseSnapshot = await getDocs(coursesCollection);
              const courseList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              setCourses(courseList);
          } catch (error) {
              console.error('Error fetching courses:', error);
          } finally {
              setLoading(false);
          }
      };

      fetchCourses();
  }, []);

  return (
    <div className="navbar">
      <div className="navbar-left">
        <ul className="nav-links">
        <li className="nav-item">
            <Link to="/" className="nav-link">
              <span>HOME</span>
            </Link>
          </li>
          <li className="nav-item">
            <span onClick={toggleDropdown}>
              COURSES <span className="dropdown-icon">&#x25BC;</span>
            </span>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                {courses.map(course => (
                    <li
                        key={course.id}
                        className="dropdown-item"
                        onClick={() => handleCourseSelect(course.id)}
                    >
                        {course.title}
                    </li>
                ))}
              </ul>
            )}
          </li>
          <li className="nav-item">
            <Link to="/resources" className="nav-link">
              <span>RESOURCES</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">
              <span>ABOUT US</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <button className="login-btn" onClick={goToLogin}>LOGIN</button>
        <button className="signup-btn" onClick={goToSignUp}>SIGN UP</button>
      </div>
    </div>
  );
};

export default NavigationBarHome;