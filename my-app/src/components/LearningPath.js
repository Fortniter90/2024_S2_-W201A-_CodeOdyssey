import { useState, useEffect } from 'react';
import { fetchLessons, fetchUserCourseProgress } from '../utils/dataFetching';
import './LearningPath.css';

// Main LearningPath component
const LearningPath = ({ courseId = "WhWBHUFHy6M3eOHSxKfd", }) => {
    const [levels, setLevels] = useState([]);                   // State to hold lesson levels
    const [selectedLesson, setSelectedLesson] = useState(null); // State for currently selected lesson

    // Hardcoded userId for testing
    const userId = "lRBv2UvYYYPipLGH97p6W0L6DB62";

    // Fetch lessons and user progress when component mounts or the courseId/userId changes
    useEffect(() => {
        const fetchLessonsAndProgress = async () => {
            try {
                // Fetch lessons from Firestore
                const lessonData = await fetchLessons(courseId);
                const lessonList = Object.entries(lessonData).map(([id, data]) => ({ id, ...data }));

                // Fetch user progress for the specific course
                const userProgress = await fetchUserCourseProgress(userId, courseId);
                const progressData = userProgress || { completedLessons: [], latestLesson: '' };

                // Mark lessons as completed or current based on user progress
                const updatedLessons = lessonList.map((lesson) => ({
                    ...lesson,
                    isCompleted: progressData.completedLessons.includes(lesson.id),
                    isCurrent: progressData.latestLevel === lesson.id
                }));

                setLevels(updatedLessons); // Update levels state with fetched lessons

                // Set the latest lesson as selected by default
                const currentLesson = updatedLessons.find(lesson => lesson.isCurrent) || updatedLessons[0];
                setSelectedLesson(currentLesson);

            } catch (error) {
                console.error("Error fetching lessons and progress:", error);
            }
        };

        fetchLessonsAndProgress();
    }, [courseId, userId]);

    // Show loading message if no levels are loaded yet
    if (!levels.length) return <div>Loading...</div>;

    // Handle lesson selecction when a level is clicked
    const handleLevelClick = (id) => {
        const selected = levels.find(level => level.id === id);
        setSelectedLesson(selected);
    };

    return (
        <div className='overall-box'>
            {/* Display the list of levels */}
            <LessonMenu 
                levels={levels} 
                handleLevelClick={handleLevelClick} 
                selectedLevel={selectedLesson ? selectedLesson.id : null} 
            />

            {/* Display information for the selected lesson */}
            {selectedLesson && <LessonPreview lesson={selectedLesson} />}
        </div>
    );
};

// LessonMenu component to display the list of levels/lessons
const LessonMenu = ({ levels, handleLevelClick, selectedLevel }) => {
    return (
        <div className='learning-path'>
            <div className='path-header'>
                <h2 className='roboto-bold'>Learning Path</h2>
            </div>

            {/* List of lessons */}
            <div className='levels-list roboto-medium'>
                {levels.map((level, index) => (
                    <div key={level.id} className='level-box-wrapper'>
                        <div className={`level-box ${selectedLevel === level.id ? 'selected' : ''}`} onClick={() => handleLevelClick(level.id)}>
                            <div className='line-align'>
                                <span className={`number-circle ${level.isCompleted ? 'complete' : level.isCurrent ? 'current' : 'incomplete'}`}>{level.number}</span>
                                
                                {/* Displaying a line between lessons */}
                                {index < levels.length - 1 && (
                                    <div className={`line ${level.isCompleted ? 'complete' : 'incomplete'}-${level.isCompleted ? 'complete' : level.isCurrent ? 'current' : 'incomplete'}`}/>
                                )}
                            </div>
                            <span className={`${level.isCompleted ? 'complete' : level.isCurrent ? 'current' : 'incomplete'}-name`}>{level.title}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// LessonPreview component to show details of the selected lesson
const LessonPreview = ({ lesson }) => {
    return (
        <div className={`lesson-preview edge-${lesson.isCompleted ? 'complete' : lesson.isCurrent ? 'current' : 'incomplete'}`}>
            <div className='lesson-header'>
                {/* Display the lesson ID and status */}
                <h2 className={`tag-${lesson.isCompleted ? 'complete' : lesson.isCurrent ? 'current' : 'incomplete'} roboto-bold`}>Lesson {lesson.number}</h2>
                <p className='roboto-bold'>INCOMPLETE</p>
            </div>

            {/* Display the lesson name and description */}
            <div className='lesson-contents roboto-regular'>
                <h1 className={`title-${lesson.isCompleted ? 'complete' : lesson.isCurrent ? 'current' : 'incomplete'} fira-code`}>{lesson.title}</h1>
                <p>{lesson.description}</p>
            </div>

            {/* Buttons for beginning the lesson or practicing exercises */}
            <div className='lesson-buttons'>
                <button className='button solid-button roboto-bold' onClick={() => console.log("Begin lesson")}>
                    BEGIN LESSON
                </button>
                <button className='button outline-button roboto-bold' onClick={() => console.log("Practice exercises")}>
                    PRACTICE EXERCISES
                </button>
            </div>
        </div>
    );
};

export default LearningPath;