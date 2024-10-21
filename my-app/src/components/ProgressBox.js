import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./ProgressBox.css";
import { fetchCourses, fetchUserCourseProgress } from "../utils/dataFetching"; // Ensure fetchUserCourseProgress is imported
import { useNavigate } from "react-router-dom";
import Section from "./Section";

const ProgressBox = () => {
    // Destructure values from the authentication context
    const { isAuthenticated, currentUser, usersCourses } = useAuth();

    // State variables storing course details and progress data
    const [courseDetails, setCourseDetails] = useState([]);
    const [courseProgress, setCourseProgress] = useState({}); // To store user's course progress

    const navigate = useNavigate(); // Hook to navigate between different pages

    // Fetch course data when authentication status changes
    useEffect(() => {
        const fetchData = async () => {
            // If not authenticated, do not attempt to fetch data
            if (!isAuthenticated) return;

            try {
                // Fetch course data
                const fetchedCourses = await fetchCourses();
                setCourseDetails(fetchedCourses);

                // Fetch progress for each course
                const progressData = await Promise.all(
                    fetchedCourses.map(course =>
                        fetchUserCourseProgress(currentUser.uid, course.id) // Fetch progress for each course
                    )
                );

                // Map the progress data to a structure for easy access
                const progressMap = {};
                fetchedCourses.forEach((course, index) => {
                    progressMap[course.id] = progressData[index]; // Assuming it returns { completedLessons: [], testCount: x }
                });

                setCourseProgress(progressMap); // Set the state with the progress data

            } catch (err) {
                // If an error occurs, log it
                console.log(err);
            }
        };

        // Call the fetchData function
        fetchData();

    }, [isAuthenticated, usersCourses.uid]); // Include usersCourses.uid as dependency

    const navigateTo = (path) => () => navigate(path);
    const goToCourse = (courseId) => () => navigate(`/course/${courseId}`);

    return (
        <Section title={"MY PROGRESS"} emptyMessage={"You have No Courses"} onEmptyClick={navigateTo('/course')}>
            {Object.keys(usersCourses).length === 0 ? (
                <div>No courses found.</div>
            ) : (
                Object.keys(usersCourses).map(courseId => {
                    const courseData = courseDetails.find(course => course.id === courseId) || {};
                    const completedLessons = usersCourses[courseId]?.completedLessons || []; // Fetch completed lessons for the course
                    const count = Array.isArray(completedLessons) ? completedLessons.length : 0; // Get the length of the array

                    const lessonCount = courseData.lessonCount || 0; // Total number of lessons in the course

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
                                    Completed {count}/{lessonCount}
                                </span>

                                <div className="progress-bar">
                                    <div
                                        className="progress-bar-completion"
                                        style={{
                                            width: lessonCount ? `${(count / lessonCount) * 100}%` : "0%", // Calculate percentage
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </Section>
    );
};

export default ProgressBox;
