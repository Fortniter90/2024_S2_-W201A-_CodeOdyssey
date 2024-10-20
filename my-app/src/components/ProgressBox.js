import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./ProgressBox.css";
import { fetchCourses } from "../utils/dataFetching";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";

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
        <Section title={"MY PROGRESS"} emptyMessage={"You have No Courses"} onEmptyClick={navigateTo('./course')}>
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

// Section component to render a titled section with content or an empty state
const Section = ({ title, children, emptyMessage, onEmptyClick }) => (
    <div className='progress-container'>
      <h2 className='progress-title roboto-bold'>{title}</h2>

        {children.length > 0 ? children : (
            <div className='progress progress-empty' onClick={onEmptyClick}>
            <h3 className='fira-code'>{emptyMessage}</h3>
            
            <div className='empty-align'>
                <p className='roboto-medium'>Start a new journey today!</p>
                <FaPlus className='faplus' />
            </div>
        </div>
      )}
    </div>
  );

export default ProgressBox;