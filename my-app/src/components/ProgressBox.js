import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./ProgressBox.css";
import { fetchUserCourseProgress } from "../utils/dataFetching";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";

const ProgressBox = () => {
    // Destructure values from the authentiction context
    const { isAuthenticated } = useAuth();

    const [userCourses, setUserCourses] = useState([]);

    const navigate = useNavigate(); // Hook to navigate between different pages

    // Fetch course and lesson data whenever authentication status or user course changes
    useEffect(() => {
        const fetchData = async () => {
        // If not authenticated, do not attempt to fetch data
        if (!isAuthenticated) return;

        try {
            // Fetch course data
            const fetchedCourses = await fetchUserCourseProgress();
            setUserCourses(fetchedCourses);
        } catch (err) {
            // If an error occurs, set error state
            console.log(err);
        }
        };

        // Call the fetchData function
        fetchData();

        console.log('User Courses: ', userCourses);
    }, [isAuthenticated]);

    const navigateTo = (path) => () => navigate(path);

    return (
        <Section title={"MY PROGRESS"} emptyMessage={"You have no Courses"} onEmptyClick={navigateTo('/course')}>
            <div className="progress-content">
                {Object.keys(userCourses).map((course) => (
                    <div className="progress-item" key={course.id}>
                        <div
                            className="progress-item-box"
                            style={{ backgroundColor: course.color }} 
                        >
                            <span className="progress-text">{course.title}</span>
                            <div className="progress-completed">
                                <span className="progress-status">
                                    Completed {course.completedLessons}/{course.testCount}
                                </span>
                            </div>
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{
                                        width: course.testCount
                                            ? `${(course.completedLessons / course.testCount) * 100}%`
                                            : "0%",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

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