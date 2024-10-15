import "./NavigationBarHome.css";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCourses } from "../utils/DataFetching";

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
    const loadCourses = async () => {
      try {
        const courseList = await fetchCourses(); // Await the fetchCourses call
        setCourses(courseList);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false); // Ensure loading state is updated
      }
    };

    loadCourses(); // Call the asynchronous function
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
                {loading ? (
                  <li className="dropdown-item">Loading...</li>
                ) : courses.length > 0 ? (
                  courses.map(course => (
                    <li
                      key={course.id}
                      className="dropdown-item"
                      onClick={() => handleCourseSelect(course.id)}
                    >
                      {course.title}
                    </li>
                  ))
                ) : (
                  <li className="dropdown-item">No courses available</li>
                )}
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

