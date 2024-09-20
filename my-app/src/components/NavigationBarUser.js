// Importing the CSS file for the styling component.
import "./NavigationBarUser.css";
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

//Import the profile icon from the react-icons library.
import { CgProfile } from "react-icons/cg";

//Defining the NavigationBarUser copmponent.
const NavigationBarUser = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toDashboard = () => {
    navigate('/');
  }

  const toCourses = () => {
    navigate('/course');
  }

  const toRecourses = () => {
    navigate('/resources');
  }

  const toProfile = () => {
    navigate('/profile');
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
    //Main navigation bar container.
    <div className="navbar">
        {/*Left side of the nav bar containing the navigation links*/}
      <div className="navbar-left">
        <ul className="nav-links">
            {/*List item for the Dashoard link*/}
          <li className="nav-item">
            <span onClick={() => toDashboard()}>DASHBOARD</span>
          </li>
          {/* List item for the courses link with a dropdown icon*/}
          <li className="nav-item">
            <span onClick={toggleDropdown}>
              COURSES <span onClick={() => toCourses()} className="dropdown-icon">&#x25BC;</span>
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
          {/* List item for resources link */}
          <li className="nav-item">
            <span onClick={() => toRecourses()}>RESOURCES</span>
          </li>
        </ul>
      </div>
      {/*Right side of the nav bar containing the profile icon*/}
      <div className="navbar-right" onClick={() => toProfile()}>
        {/*Profile icon, will change colour on hover*/}
        <CgProfile className="profile-icon" />
      </div>
    </div>
  );
};

//Exporting the NavigationBaruser component to be used in other parts of the app.
export default NavigationBarUser;
