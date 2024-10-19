import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./ProgressBox.css";
import { fetchUserCourseProgress } from "../utils/dataFetching";

const ProgressBox = () => {
    // Destructure values from the authentiction context
    const { isAuthenticated } = useAuth();

    const [userCourses, setUserCourses] = useState([]);

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

    return (
        <div className="progress-box">
            <div className="progress-tab">
                <span className="tab-text">PROGRESS</span>
            </div>
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
        </div>
    );
};

export default ProgressBox;