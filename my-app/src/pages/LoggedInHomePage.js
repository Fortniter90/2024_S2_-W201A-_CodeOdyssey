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

const LoggedInHomePage = () => {
    const { currentuser, isAuthenticated, usersName, usersCourses } = useAuth();
    const [courseDetails, setCourseDetails] = useState({});
    const [lessonDetails, setLessonDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (isAuthenticated) {
                    console.log("Fetching courses..."); // Debug log
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

    if (!isAuthenticated) {
        return <p>Redirecting to homepage...</p>;
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading data: {error.message}</p>;
    }

    const goToCourse = (courseId) => {
        console.log("Going to course that was clicked", courseId);
    }

    const goToLesson = (courseId, lessonId) => {
        console.log("Going to lesson that was clicked", courseId, lessonId);
    }

    return (
        <div className='home-page'>
            <SignOutComponent/>

            <div className='home-page-content'>
                <h1 className='fira-code'>Welcome, {usersName || 'User'}</h1>

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