import { FaPlus } from "react-icons/fa6";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchLessons } from "../utils/dataFetching";
import Section  from "./Section";

const PastTestsLessons = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate(); // Hook to navigate between different pages

    // State variables
    const [allLessons, setAllLessons] = useState([]);
    
    // Fetch lessons data whenever authentication status changes
    useEffect(() => {
        const fetchLessonsData = async () => {
            if (!isAuthenticated) return;

            try {
                const fetchedLessons = await fetchLessons();
                setAllLessons(fetchedLessons); 
            } catch (err) {
                console.log(err);
            }
        };

        fetchLessonsData();
    }, [isAuthenticated]);

    const navigateTo = (path) => () => navigate(path);

    return (
        <Section emptyMessage={"You have No Lessons"} onEmptyClick={navigateTo('/course')} outerContainer={false}>
            {allLessons.length > 0 ? (
                allLessons.map((lesson) => (
                    <div className="lesson-item" key={lesson.id}>
                        <h3 className='fira-code'>{lesson.title || 'Unknown Lesson'}</h3>
                        {/* Add any additional details or buttons as necessary */}
                    </div>
                ))
            ) : (
                <div className='progress progress-empty' onClick={navigateTo('./course')}>
                    <h3 className='fira-code'>You have No Lessons</h3>
                    <div className='empty-align'>
                        <p className='roboto-medium'>Start a new journey today!</p>
                        <FaPlus className='faplus' />
                    </div>
                </div>
            )}
        </Section>
    );
}

export default PastTestsLessons;
