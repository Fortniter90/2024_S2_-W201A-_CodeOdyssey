import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./ProgressBox.css";
import { fetchCourses } from "../utils/dataFetching";
import { useNavigate } from "react-router-dom";
import Section from "./Section";

const ProgressBox = () => {
    // Destructure values from the authentiction context
    const { isAuthenticated, usersCourses } = useAuth();

    // State variables storing data
    const [courseDetails, setCourseDetails] = useState([]);

    const navigate = useNavigate(); // Hook to navigate between different pages

    // Fetch course and lesson data whenever authentication status or user course changes
    useEffect(() => {
        const fetchData = async () => {
            // If not authenticated, do not attempt to fetch data
            if (!isAuthenticated) return;

            try {
                // Fetch course data
                const fetchedCourses = await fetchCourses();
                setCourseDetails(fetchedCourses);
                
            } catch (err) {
                // If an error occurs, set error state
                console.log(err);
            }
        };

        // Call the fetchData function
        fetchData();

    }, [isAuthenticated]);

    const navigateTo = (path) => () => navigate(path);
    const goToCourse = (courseId) => () => navigate(`/course/${courseId}`);

    return (
        <Section title={"MY PROGRESS"} emptyMessage={"You have No Courses"} onEmptyClick={navigateTo('/course')}>
            {Object.keys(usersCourses).map(courseId => {
                const courseData = courseDetails.find(course => course.id === courseId) || {};
                const count = Array.isArray(usersCourses.completedLessons) ? usersCourses.completedLessons.length : 0; // Get the length of the array, default to 0 if not an array
            
                return (
                    <div 
                        className="progress-item"
                        key={courseId}
                        style={{ backgroundImage: `linear-gradient(var(--${courseData.color}-light), var(--${courseData.color}-medium), var(--${courseData.color}-dark))` }}
                        onClick={goToCourse(courseId)}
                    >
                        <h3 className='fira-code'>{courseData.title || 'Unknown Course'}</h3>
                        
                        <div className="progress-item-box">
                            <span className="roboto-bold">
                                Completed {count + 1}/{courseData.testCount}
                            </span>

                            <div className="progress-bar">
                                <div
                                    className="progress-bar-completion"
                                    style={{
                                        width: courseData.testCount
                                            ? `${(count + 1)/courseData.testCount * 100}%`
                                            : "0%",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </Section>
    );
};

export default ProgressBox;