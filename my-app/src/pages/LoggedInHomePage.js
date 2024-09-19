import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchCourses, fetchLessons } from "../utils/dataFetching.js";
import SignOutComponent from "../components/SignOut";
import { useNavigate } from 'react-router-dom';
import "./LoggedInHomePage.css";

// Predefined gradients
const gradients = {
    green: 'linear-gradient(var(--python-light), var(--python-medium), var(--python-dark))',
    orange: 'linear-gradient(var(--java-light), var(--java-medium), var(--java-dark))',
    blue: 'linear-gradient(var(--c-light), var(--c-medium), var(--c-dark))'
};

// HomePage for when the user is logged in
const LoggedInHomePage = () => {
    const { currentuser, isAuthenticated, usersName, usersCourses } = useAuth();    // Extracting user info
    const [courseDetails, setCourseDetails] = useState({});                         // State to hold course details
    const [lessonDetails, setLessonDetails] = useState({});                         // State to hold
    const [loading, setLoading] = useState(true);                                   // State to manage loading status
    const [error, setError] = useState(null);                                       // State to manage error messages
    const navigate = useNavigate(); // Hook for navigation

    // Fetch courses and lessons on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isAuthenticated) {
                    // Fetch all courses
                    const fetchedCourses = await fetchCourses();
                    setCourseDetails(fetchedCourses);

                    // Fetch lessons for each course
                    const lessonPromises = Object.keys(usersCourses).map(async (courseId) => {
                        if (fetchedCourses[courseId]) {
                            const fetchedLessons = await fetchLessons(courseId);
                            return { [courseId]: fetchedLessons };
                        }
                        return null;
                    });

                    // Fetch lesson details
                    const lessonResults = await Promise.all(lessonPromises);
                    const allLessons = lessonResults.reduce((acc, lessons) => {
                        if (lessons) {
                            return { ...acc, ...lessons };
                        }
                        return acc;
                    }, {});

                    setLessonDetails(allLessons);
                }
            } catch (error) {
                setError(error);
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [usersCourses, isAuthenticated]);

    // Redirecting if the user is not authenticated
    if (!isAuthenticated) {
        return <p>Redirecting to homepage...</p>;
    }

    // Show loading message while fetching data
    if (loading) {
        return <p>Loading...</p>;
    }

    // Display error message if data loading fails
    if (error) {
        return <p>Error loading data: {error.message}</p>;
    }

    // Function to navigate to the selected course
    const goToCourse = (courseId) => {
        console.log("Going to course that was clicked", courseId);
    }

    // Function to navigate to the selected lesson
    const goToLesson = (courseId, lessonId) => {
        console.log("Going to lesson that was clicked", courseId, lessonId);
    }

    return (
        <div className='home-page'>
            <SignOutComponent/>

            <div className='home-page-content'>
                <h1 className='fira-code'>Welcome, {usersName || 'User'}</h1>

                {/* Recent levels section */}
                <div className='recent-levels-container'>
                    <h2 className='recent-levels-title roboto-bold'>RECENT LEVELS</h2>

                    {Object.keys(usersCourses || {}).map((courseId) => {
                        const course = usersCourses[courseId];
                        const courseData = courseDetails[courseId] || {};
                        const latestLessonId = course.latestLevel;
                        const latestLesson = lessonDetails[courseId]?.[latestLessonId] || {};
                        const completedLessonNames = course.completedLessons
                            .map(lessonId => lessonDetails[courseId]?.[lessonId]?.title || 'Unknown Lesson')
                            .join(', ');

                        return (
                            <div className='recent-levels' style={{backgroundImage: gradients[courseData.backgroundColor] || gradients.blue}} key={courseId} onClick={(e) => goToLesson(courseId, latestLessonId)}>
                                <p className='roboto-medium'>{courseData.title || 'Unknown Course'}</p>
                                <h3 className='fira-code'>{latestLesson.title || 'Unknown Lesson'}</h3>
                            </div>
                        );
                    })}
                </div>

                {/* Your courses section */}
                <div className='recent-levels-container'>
                    <h2 className='recent-levels-title roboto-bold'>YOUR COURSES</h2>

                    {Object.keys(usersCourses || {}).map((courseId) => {
                        const courseData = courseDetails[courseId] || {};

                        return (
                            <div className='recent-levels' style={{backgroundImage: gradients[courseData.backgroundColor] || gradients.blue}} key={courseId} onClick={(e) => goToCourse(courseId)}>
                                <h3 className='fira-code'>{courseData.title || 'Unknown Course'}</h3>
                            </div>
                        );
                    })}
                </div>
            </div>
            
        </div>
    );
};

export default LoggedInHomePage;