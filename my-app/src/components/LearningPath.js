import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import './LearningPath.css';

// Main LearningPath component
const LearningPath = ({ courseId = "XiDFQFOkRXhBtoeYFwcA" }) => {
    const [levels, setLevels] = useState([]);
    const [selectedLesson, setSelectedLesson] = useState(null);

    // Fetch lessons from Firestore based on courseId
    useEffect(() => {
        const fetchLessons = async () => {
            const lessonsCollection = collection(db, `courses/${courseId}/lessons`);
            const lessonsQuery = query(lessonsCollection, orderBy('number'));
            const lessonSnapshot = await getDocs(lessonsQuery);
            const lessonList = lessonSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setLevels(lessonList);

            if (lessonList.length > 0) {
                setSelectedLesson(lessonList[0]);
            }
        };
        fetchLessons();
    }, [courseId]);

    if (!levels) return <div>Loading...</div>;

    // Function to handle clicking on a level
    const handleLevelClick = (id) => {
        const selected = levels.find((level) => level.id === id); // Find the selected level
        setSelectedLesson(selected);
    };

    return (
        <div className='overall-box'>
            {/* Displaying the list of levels */}
            <LessonMenu 
                levels={levels} 
                handleLevelClick={handleLevelClick} 
                selectedLevel={selectedLesson ? selectedLesson.id : null} 
            />

            {/* Displaying the information for the selected level */}
            {selectedLesson && (
                <LessonPreview lesson={selectedLesson} />
            )}
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
                                <span className={`number-circle incomplete`}>{level.number}</span>
                                
                                {/* Displaying a line between lessons */}
                                {index < levels.length - 1 && (
                                    <div className={`line incomplete-incomplete`}/>
                                )}
                            </div>
                            <span className={`incomplete-name`}>{level.title}</span>
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
        <div className={`lesson-preview edge-incomplete`}>
            <div className='lesson-header'>
                {/* Display the lesson ID and status */}
                <h2 className={`tag-incomplete roboto-bold`}>Lesson {lesson.number}</h2>
                <p className='roboto-bold'>INCOMPLETE</p>
            </div>

            {/* Display the lesson name and description */}
            <div className='lesson-contents roboto-regular'>
                <h1 className={`title-incomplete fira-code`}>{lesson.title}</h1>
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