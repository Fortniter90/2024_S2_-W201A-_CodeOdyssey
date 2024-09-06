import { useState } from "react";
import "./LearningPath.css";

const LearningPath = () => {

    // Hard coding levels to test display -- replace later
    const levels = [
        { id: 1, name: "Printing to the Console", status: "complete" },
        { id: 2, name: "Basic Syntax and Variables", status: "complete" },
        { id: 3, name: "If-Else Statements", status: "current" },
        { id: 4, name: "For and While Loops", status: "incomplete" },
        { id: 5, name: "Functions", status: "incomplete" },
    ];

    const [selectedLevel, setSelectedLevel] = useState(null);

    // Handles opening level information page (for testing purposes)
    const handleLevelClick = (id) => {
        setSelectedLevel(id);
        console.log(`Opens level ${id}`);
    };

    return (
        <div className="learning-path">
            <div className="path-header">
                <h2 className="path-title roboto-bold">Learning Path</h2>
                {/* insert code for wavy line here */}
            </div>

            <div className="levels-list roboto-medium">
                {levels.map((level, index) => (
                    <div key={level.id} className="level-box-wrapper">
                        <div className={`level-box ${selectedLevel === level.id ? 'selected' : ''}`} onClick={() => handleLevelClick(level.id)}>
                            <span className={`number-circle ${level.status}`}>{level.id}</span>
                            <span className={`${level.status}-name`}>{level.name}</span>
                        </div>

                        {index < levels.length - 1 && (
                            <div className={`line ${level.status}-${levels[index + 1].status}`}/>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LearningPath;