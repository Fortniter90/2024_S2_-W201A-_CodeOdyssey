import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchCourses } from "../utils/dataFetching";
import { FaChevronDown, FaChevronUp, FaCircleUser } from "react-icons/fa6"; 
import Button from "./Button";
import "./NavigationBar.css";

// NavigationBar for course navigation
const NavigationBar = () => {
    
    const { isAuthenticated } = useAuth();      // Check if user is logged in
    const [courses, setCourses] = useState([]); // State handling course data
    const navigate = useNavigate();             // State handling navigation

    // Load courses component on mount
    useEffect(() => {
        loadCourses();
    }, []);

    // Function to load all courses
    const loadCourses = async () => {
        try {
        const courseList = await fetchCourses();  // Fetch list of courses
        setCourses(Object.values(courseList));    // Update the state with fetched courses

        } catch (error) {
        console.error('Error loading courses:', error); // Log any errors during data fetching
        }
    };

    // Function to handle navigating to the homepage/dashboard
    const goToHome = () => {
      navigate('/');
    }
  
    // Function to handle navigating to the courses page
    const goToCourses = () => {
      navigate('/course');
    }

    // Function to handle navigating to a selected course
    const handleCourseSelect = (courseId) => {
        navigate(`/course/${courseId}`);
    };
  
    // Function to handle navigating to the resources page
    const goToRecourses = () => {
      navigate('/resources');
    }
  
    // Function to handle navigating to the about us page
    const goToAboutUs = () => {
      navigate('/about');
    }
  
    // Function to handle navigating to the profile
    const goToProfile = () => {
      navigate('/profile');
    }

    // Function to handle navigating to the login page
    const goToLogin = () => {
        navigate('/login');
    };

    // Function to handle navigating to the sign up page
    const goToSignUp = () => {
        navigate('/signup');
    };

    return (
        <div className="navbar roboto-regular">
            {/* Left side of the navbar containing the navigation links */}
            <div className="navbar-left">
                <ul className="nav-links">


                    {/* Link to homepage/dashboard */}
                    <li className="nav-item" onClick={goToHome}>
                        <span>{isAuthenticated ? 'DASHBOARD' : 'HOME'}</span>
                    </li>

                    {/* Link to courses */}
                    <li className="nav-item">
                        <div onClick={goToCourses}>
                            <span>COURSES</span>
                            <span className="dropdown-icon">
                                <FaChevronDown className="chevron-down" />
                                <FaChevronUp className="chevron-up" />
                            </span>
                        </div>


                        {/* Course dropdown menu */}
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

                    {/* Link to resources page */}
                    <li className="nav-item" onClick={goToRecourses}>
                        <span>RESOURCES</span>
                    </li>

                    {/* Link to about us page */}
                    <li className="nav-item" onClick={goToAboutUs}>
                        <span>ABOUT US</span>
                    </li>

                </ul>
            </div>

            {/* Right side of the navbar containing login/sign up buttons or profile icon */}
            {isAuthenticated ? (
                <div className='navbar-right'>
                    {/* If the user is logged in, display the profile icon */}
                    <FaCircleUser className='profile-icon' onClick={goToProfile} />
                </div>
            ) : (
                <div className='navbar-right'>
                    {/* If the user is not logged in, display the login/sign up buttons */}
                    <Button text={"LOGIN"} outline={true} action={goToLogin} color="var(--purple-accent)" backgroundColor="var(--background-dark)" />
                    <Button text={"SIGN UP"} action={goToSignUp} color="var(--purple-accent)" backgroundColor="var(--background-dark)" />      
                </div>
            )}
        </div>
    );
};

export default NavigationBar;