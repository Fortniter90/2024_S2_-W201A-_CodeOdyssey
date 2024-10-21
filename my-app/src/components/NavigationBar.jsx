import { useNavigate } from 'react-router-dom';
import { FaCircleUser } from "react-icons/fa6"; 
import React from 'react';
import Button from "./Button.jsx";
import "./NavigationBar.css";

// NavigationBar for course navigation
const NavigationBar = () => {
    const navigate = useNavigate(); // State handling navigation

    // Function to handle navigating to the homepage/dashboard
    const goToHome = () => {
      navigate('/');
    }
  
    // Function to handle navigating to the courses page
    const goToCourses = () => {
      navigate('/course');
    }
  
    // Function to handle navigating to the resources page
    const goToResources = () => {
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

    // Function to handle navigating to the sign-up page
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
                        <span>HOME</span>
                    </li>

                    {/* Link to courses */}
                    <li className="nav-item" onClick={goToCourses}>
                        <span>COURSES</span>
                    </li>

                    {/* Link to resources page */}
                    <li className="nav-item" onClick={goToResources}>
                        <span>RESOURCES</span>
                    </li>

                    {/* Link to about us page */}
                    <li className="nav-item" onClick={goToAboutUs}>
                        <span>ABOUT US</span>
                    </li>
                </ul>
            </div>

            {/* Right side of the navbar containing login/sign up buttons or profile icon */}
            <div className='navbar-right'>
                {/* Display the profile icon */}
                <FaCircleUser className='profile-icon' onClick={goToProfile} />
                {/* Display the login and sign-up buttons */}
                <Button text={"LOGIN"} outline={true} action={goToLogin} color="var(--purple-accent)" backgroundColor="var(--background-dark)" />
                <Button text={"SIGN UP"} action={goToSignUp} color="var(--purple-accent)" backgroundColor="var(--background-dark)" />      
            </div>
        </div>
    );
};

export default NavigationBar;
