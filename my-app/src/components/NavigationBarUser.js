// Importing the CSS file for the styling component.
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaCircleUser } from "react-icons/fa6";
import "./NavigationBar.css";
import { fetchCourses } from '../utils/dataFetching';


//Defining the NavigationBarUser copmponent.
const NavigationBarUser = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();



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

  const goToDashboard = () => {
    navigate('/');
  }

  const goToCourses = () => {
    navigate('/course');
  }

  const goToRecourses = () => {
    navigate('/resources');
  }

  const goToAboutUs = () => {
    navigate('/about');
  }

  const toProfile = () => {
    navigate('/profile');
  }

  // Function to handle course selection and navigation
  const handleCourseSelect = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    //Main navigation bar container.
    <div className="navbar roboto-regular">
      {/*Left side of the nav bar containing the navigation links*/}
      <div className="navbar-left">
        <ul className="nav-links">

          <li className="nav-item" onClick={goToDashboard}>
            <span>DASHBOARD</span>
          </li>

          <li className="nav-item">
            <div onClick={goToCourses}>
              <span>COURSES</span>
              <span className="dropdown-icon"><FaChevronDown className="chevron-down" />
                <FaChevronUp className="chevron-up" /></span>
            </div>


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

          <li className="nav-item" onClick={goToRecourses}>
            <span>RESOURCES</span>
          </li>

          <li className="nav-item" onClick={goToAboutUs}>
            <span>ABOUT US</span>
          </li>

        </ul>
      </div>


      {/*Right side of the nav bar containing the profile icon*/}
      <div className="navbar-right" onClick={() => toProfile()}>
        {/*Profile icon, will change colour on hover*/}
        <FaCircleUser className="profile-icon" />
      </div>
    </div>
  );
};

//Exporting the NavigationBaruser component to be used in other parts of the app.
export default NavigationBarUser;
