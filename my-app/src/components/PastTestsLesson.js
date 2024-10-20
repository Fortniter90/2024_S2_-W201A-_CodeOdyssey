import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Section  from "./Section";

const PastTestsLessons = ({ selectedCourse, lessonsData, onSelectLesson }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate(); // Hook to navigate between different pages

    // State variables
    //const lessons = lessonsData.filter(lesson => lesson.id === selectedCourse.id);
   
    if (!isAuthenticated) return;

    const navigateTo = (path) => () => navigate(path);

    return (
        <Section emptyMessage={"You have No Lessons"} onEmptyClick={navigateTo('/course')} outerContainer={false}>
            {lessonsData.map((lesson) => {
                return (
                    <div 
                        className="progress-item"
                        key={lesson.di}
                        style={{ backgroundImage: `linear-gradient(var(--orange-light), var(--orange-medium), var(--orange-dark))` }}
                        onClick={onSelectLesson}
                    >
                        <h3 className='fira-code'>{lesson.title || 'Unknown Course'}</h3>
                    </div>
                )
            })}
        </Section>
    );
}

export default PastTestsLessons;
