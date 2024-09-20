import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchCourses, fetchLessons } from "../utils/dataFetching.js";
import SignOutComponent from "../components/SignOut";
import { Link, useNavigate } from 'react-router-dom';
import NavigationBarUser from "../components/NavigationBarUser.js";
import CharacterInformation from "../components/CharacterInformation.js";
import DeleteUser from "../components/DeleteUser.js";
import "./LoggedInHomePage.css";

// Predefined gradients
const gradients = {
    green: 'linear-gradient(var(--python-light), var(--python-medium), var(--python-dark))',
    orange: 'linear-gradient(var(--java-light), var(--java-medium), var(--java-dark))',
    blue: 'linear-gradient(var(--c-light), var(--c-medium), var(--c-dark))'
};

// HomePage for when the user is logged in
const LoggedInHomePage = () => {
    const { currentuser, isAuthenticated, usersId, usersName, usersCourses } = useAuth();    // Extracting user info
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
                    console.log("Fetching courses...");
    
                    // Fetch all courses
                    const fetchedCourses = await fetchCourses();
                    console.log("Fetched courses:", fetchedCourses);
                    setCourseDetails(fetchedCourses);
    
                    // Fetch lessons for each course
                    const lessonPromises = Object.keys(usersCourses).map(async (courseId) => {
                        console.log(`Fetching lessons for courseId: ${courseId}`);
                        if (fetchedCourses[courseId]) {
                            const fetchedLessons = await fetchLessons(courseId);
                            console.log(`Fetched lessons for courseId ${courseId}:`, fetchedLessons);
                            return { [courseId]: fetchedLessons };
                        }
                        console.warn(`CourseId ${courseId} not found in fetchedCourses.`);
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
    
                    console.log("All fetched lessons:", allLessons);
                    setLessonDetails(allLessons);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error);
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
        navigate(`/course/${courseId}`);
    }

    // Function to navigate to the selected lesson
    const goToLesson = (courseId, lessonId) => {
        navigate(`/course/${courseId}/lesson/${lessonId}`);
    }

    const goToPastTests = () => {
        navigate(`/pasttests`);
    }

    const goToDeveloperDashboard = () => {
        navigate(`/developerdashboard`);
    }

    return (
        <div className='home-page'>
            <NavigationBarUser />
            <SignOutComponent/>
            
            <button onClick={() => goToPastTests()}>Review Past Tests</button>
            <button onClick={() => goToDeveloperDashboard()}>See Developer Dashboard</button>

            <div className='home-page-content'>
                <h1 className='fira-code'>Welcome, {usersName || 'User'}</h1>

                {/* Recent levels section */}
                <div className='recent-levels-container'>
                    <h2 className='recent-levels-title roboto-bold'>RECENT LEVELS</h2>

                    {Object.keys(usersCourses || {}).map((courseId) => {
                        const course = usersCourses[courseId];
                        const courseData = courseDetails[courseId] || {};
                        const latestLessonId = course.currentLesson;
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
            
            <CharacterInformation />
            <DeleteUser />
        </div>
    );
};

export default LoggedInHomePage;