import "./NavigationBarHome.css";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";  // Import both icons
import Button from "./Button";
import { fetchCourses } from "../utils/DataFetching";

const NavigationBarHome = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  const goToSignUp = () => {
    navigate('/signup');
  };

  // Function to handle course selection and navigation
  const handleCourseSelect = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  // Load courses component on mount
  useEffect(() => {
    loadCourses();
  }, []);

  // Load all courses
  const loadCourses = async () => {
    try {
      const courseList = await fetchCourses();  // Fetch list of courses
      setCourses(Object.values(courseList));    // Update the state with fetched courses
    } catch (error) {
      console.error('Error loading courses:', error); // Log any errors during data fetching
    }
  };

  return (
    <div className="navbar roboto-regular">
      <div className="navbar-left">
        <ul className="nav-links">

          <li className="nav-item">
            <Link to="/" className="nav-link">
              <span>HOME</span>
            </Link>
          </li>

          <li className="nav-item">
            <span>
              COURSES <span className="dropdown-icon"><FaChevronDown className="chevron-down" /><FaChevronUp className="chevron-up" /></span>
            </span>

            {/* Dropdown menu */}
            <ul className="dropdown-menu">
              {courses.map(course => (
                <li
                  key={course.id}
                  onClick={() => handleCourseSelect(course.id)}
                >
                  {course.title}
                </li>
              ))}
            </ul>
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

      {/* Navigation buttons to login and sign up */}
      <div className="navbar-right">
        <Button text={"LOGIN"} outline={true} action={goToLogin} color="var(--purple-accent)" backgroundColor="var(--background-dark)" />
        <Button text={"SIGN UP"} action={goToSignUp} color="var(--purple-accent)" backgroundColor="var(--background-dark)" />
      </div>
    </div>
  );
};

export default NavigationBarHome;
