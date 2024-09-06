import "./LessonPreview.css";

const LessonPreview = ({ lesson }) => {
    
    // Testing button presses
    const beginLessonClick = () => {
        console.log("Begin lesson");
    };

    const practiceExercisesClick = () => {
        console.log("Practice exercises");
    };

    return (
        <div className="lesson-preview">
            <p className="lesson-status roboto-bold">{lesson.status.toUpperCase()}</p>

            <div className="lesson-header">
                <h2 className={`lesson-tag tag-${lesson.status} roboto-bold`}>Lesson {lesson.id}</h2>
                <h1 className={`lesson-title title-${lesson.status} fira-code`}>{lesson.name}</h1>
            </div>

            <p className="lesson-contents roboto-regular">
                {lesson.description}
            </p>

            <div className="lesson-buttons">
                <button className="button solid-button roboto-bold" onClick={() => console.log("Begin lesson")}>
                    BEGIN LESSON
                </button>
                <button className="button outline-button roboto-bold" onClick={() => console.log("Practice exercises")}>
                    PRACTICE EXERCISES
                </button>
            </div>
        </div>
    );
};

export default LessonPreview;