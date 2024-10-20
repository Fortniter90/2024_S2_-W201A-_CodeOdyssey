import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchCourses } from "../utils/dataFetching";
import Section from "./Section";
import { useEffect, useState } from "react";

const PastTestsCourse = ({ onSelectCourse }) => {
    const { usersCourses, isAuthenticated } = useAuth();
    const navigate = useNavigate(); // Hook to navigate between different pages

    // State variables storing data
    const [courseDetails, setCourseDetails] = useState([]);

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

    return (
        <Section emptyMessage={"You have No Courses"} onEmptyClick={navigateTo('./course')} outerContainer={false} >
            {Object.keys(usersCourses).map(courseId => {
                const courseData = courseDetails.find(course => course.id === courseId) || {};
                
                return (
                    <div 
                        className="progress-item"
                        key={courseId}
                        style={{ backgroundImage: `linear-gradient(var(--${courseData.color}-light), var(--${courseData.color}-medium), var(--${courseData.color}-dark))` }}
                        onClick={onSelectCourse}
                    >
                        <h3 className='fira-code'>{courseData.title || 'Unknown Course'}</h3>
                        
                    </div>
                );
            })}
        </Section>
    );
}

export default PastTestsCourse;