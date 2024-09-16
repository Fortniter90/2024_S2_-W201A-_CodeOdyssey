import { useState } from 'react';
import './LearningPath.css';

// Main LearningPath component
const LearningPath = () => {

    // Hard coding levels to test display -- replace later
    const levels = [
        { id: 1, name: "Printing to the Console", status: "complete", description: "Text for lesson 1" },
        { id: 2, name: "Basic Syntax and Variables", status: "complete", description: "Text for lesson 2" },
        { id: 3, name: "If-Else Statements", status: "current", description: "Text for lesson 3" },
        { id: 4, name: "For and While Loops", status: "incomplete", description: "Text for lesson 4" },
        { id: 5, name: "Functions", status: "incomplete", description: "Text for lesson 5" },
        { id: 6, name: "Lots and Lots and Lots and Lots of Text", status: "incomplete", description: "Text for lesson 5" },
        { id: 7, name: "Functions", status: "incomplete", description: "Text for lesson 5" },
        { id: 8, name: "Functions", status: "incomplete", description: "Text for lesson 5" },
        { id: 9, name: "Functions", status: "incomplete", description: "Text for lesson 5" },
        { id: 10, name: "Functions", status: "incomplete", description: "Text for lesson 5" },
        { id: 11, name: "Functions", status: "incomplete", description: "Text for lesson 5" },
        { id: 12, name: "Functions", status: "incomplete", description: "Text for lesson 5" },
        { id: 13, name: "Functions", status: "incomplete", description: "Text for lesson 5" },
        { id: 14, name: "Functions", status: "incomplete", description: "Text for lesson 5" },
        { id: 15, name: "Functions", status: "incomplete", description: "Text for lesson 5" },
    ];

    // Find the first lesson marked as 'current' or defauly to first lesson
    const initialLesson = levels.find(level => level.status === 'current') || levels[0];
    const [selectedLesson, setSelectedLesson] = useState(initialLesson);

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
                                <span className={`number-circle ${level.status}`}>{level.id}</span>
                                
                                {/* Displaying a line between lessons */}
                                {index < levels.length - 1 && (
                                    <div className={`line ${level.status}-${levels[index + 1].status}`}/>
                                )}
                            </div>
                            <span className={`${level.status}-name`}>{level.name}</span>
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
        <div className={`lesson-preview edge-${lesson.status}`}>
            <div className='lesson-header'>
                {/* Display the lesson ID and status */}
                <h2 className={`tag-${lesson.status} roboto-bold`}>Lesson {lesson.id}</h2>
                <p className='roboto-bold'>{lesson.status.toUpperCase()}</p>
            </div>

            {/* Display the lesson name and description */}
            <div className='lesson-contents roboto-regular'>
                <h1 className={`title-${lesson.status} fira-code`}>{lesson.name}</h1>
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