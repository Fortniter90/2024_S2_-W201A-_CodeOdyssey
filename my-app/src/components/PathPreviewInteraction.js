// this class is just to test the interaction between the two components, in the final version this will be replaced with the course template
import { useState } from "react";
import LearningPath from "./LearningPath";
import LessonPreview from "./LessonPreview";
import "./PathPreviewInteraction.css"

const PathPreviewInteraction = () => {

    // Hard coding levels to test display -- replace later
    const levels = [
        { id: 1, name: "Printing to the Console", status: "complete", description: "Text for lesson 1" },
        { id: 2, name: "Basic Syntax and Variables", status: "complete", description: "Text for lesson 2" },
        { id: 3, name: "If-Else Statements", status: "current", description: "Text for lesson 3" },
        { id: 4, name: "For and While Loops", status: "incomplete", description: "Text for lesson 4" },
        { id: 5, name: "Functions", status: "incomplete", description: "Text for lesson 5" },
    ];

    const initialLesson = levels.find(level => level.status === 'current') || levels[0];
    const [selectedLesson, setSelectedLesson] = useState(initialLesson);

    // Handles opening level information page (for testing purposes)
    const handleLevelClick = (id) => {
        const selected = levels.find((level) => level.id === id);
        setSelectedLesson(selected);
        console.log(`Opens level ${id}`);
    };

    return (
        <div className="path-preview-container">
            {/* Always show the LearningPath on the left side */}
            <div className="learning">
                <LearningPath 
                    levels={levels} 
                    handleLevelClick={handleLevelClick} 
                    selectedLevel={selectedLesson ? selectedLesson.id : null} 
                />
            </div>

            {/* Dynamically show LessonPreview on the right side */}
            <div className="lesson">
                {selectedLesson && (
                    <LessonPreview lesson={selectedLesson} />
                )}
            </div>
        </div>
    );
};

export default PathPreviewInteraction;