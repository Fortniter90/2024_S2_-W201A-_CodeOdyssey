import { useState, useEffect } from 'react';
import { fetchLessons, fetchUserCourseProgress } from '../utils/DataFetching';
import './LearningPath.css';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Main LearningPath component
const LearningPath = ({ courseId, userId }) => {
  const [levels, setLevels] = useState([]);                   // State to hold lesson levels
  const [selectedLesson, setSelectedLesson] = useState(null); // State for currently selected lesson

  // Fetch lessons and user progress when component mounts or the courseId/userId changes
  useEffect(() => {
    const fetchLessonsAndProgress = async () => {
      try {
        // Fetch lessons from Firestore
        const lessonData = await fetchLessons(courseId);
        const lessonList = Object.entries(lessonData).map(([id, data]) => ({ id, ...data }));

        // Fetch user progress for the specific course
        const userProgress = await fetchUserCourseProgress(userId, courseId);
        const progressData = userProgress || { completedLessons: [], currentLesson: '' };

        // Ensure completedLessons is an array
        const completedLessons = progressData.completedLessons || [];

        // Mark lessons as completed or current based on user progress
        const updatedLessons = lessonList.map((lesson) => ({
          ...lesson,
          isCompleted: completedLessons.includes(lesson.id),
          isCurrent: progressData.currentLesson === lesson.id
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

  // Handle lesson selection when a level is clicked
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
      {selectedLesson && <LessonPreview levels={levels} courseId={courseId} userId={userId} lesson={selectedLesson} />}
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
                  <div className={`line ${level.isCompleted ? 'complete' : 'incomplete'}-${level.isCompleted ? 'complete' : level.isCurrent ? 'current' : 'incomplete'}`} />
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
const LessonPreview = ({ levels, courseId, userId, lesson }) => {
  const navigate = useNavigate();

  const toTests = () => {
    navigate(`/course/${courseId}/lesson/${lesson.id}/test`);
  }

  const beginLesson = async () => {
    try {
      // Update the user's current lesson and completed lessons in Firestore
      const userRef = doc(db, 'users', userId);

      // Create a list of completed lessons
      const completedLessons = levels
        .filter(level => level.number <= lesson.number) // Include current and previous levels
        .map(level => level.id);

      // Find the index of the current lesson
      const currentLessonIndex = levels.findIndex(level => level.id === lesson.id);

      // Determine the next lesson
      const nextLesson = levels[currentLessonIndex + 1];

      // Update the user's course data
      await updateDoc(userRef, {
        [`courses.${courseId}.completedLessons`]: completedLessons,
        [`courses.${courseId}.currentLesson`]: nextLesson ? nextLesson.id : null // Set to next lesson ID or null if it doesn't exist
      });

      // Navigate to the lesson page
      navigate(`/course/${courseId}/lesson/${lesson.id}`);
    } catch (error) {
      console.error("Error updating current lesson:", error);
    }
  }

  return (
    <div className={`lesson-preview edge-${lesson.isCompleted ? 'complete' : lesson.isCurrent ? 'current' : 'incomplete'}`}>
      <div className='lesson-header'>
        <h2 className={`tag-${lesson.isCompleted ? 'complete' : lesson.isCurrent ? 'current' : 'incomplete'} roboto-bold`}>Lesson {lesson.number}</h2>
        <p className='roboto-bold'>INCOMPLETE</p>
      </div>

      <div className='lesson-contents roboto-regular'>
        <h1 className={`title-${lesson.isCompleted ? 'complete' : lesson.isCurrent ? 'current' : 'incomplete'} fira-code`}>{lesson.title}</h1>
        <p>{lesson.description}</p>
      </div>

      <div className='lesson-buttons'>
        <button className='button solid-button roboto-bold' onClick={beginLesson}>
          BEGIN LESSON
        </button>
        <button className='button outline-button roboto-bold' onClick={toTests}>
          PRACTICE TESTS
        </button>
      </div>
    </div>
  );
};

export default LearningPath;
