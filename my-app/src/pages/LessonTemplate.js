import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import './LessonTemplate.css';
import Button from '../components/Button';
import NavigationBarUser from '../components/NavigationBarUser';
import { fetchLessons, fetchTests } from '../utils/DataFetching';

const LessonTemplate = () => {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  // Fetch lessons and tests when the component mounts
  useEffect(() => {
    loadLessons();
    loadTests();
  }, [courseId, lessonId]);

  // Fetch all lessons for the course
  const loadLessons = async () => {
    try {
      const lessonList = await fetchLessons(courseId);   // Fetch list of lessons
      setLesson(Object.values(lessonList));                      // Update the state with the fetched lessons

    } catch (error) {
      console.error('Error loading lessons:', error); // Log any errors during data fetching
    }
  };
  
  // Fetch all of the tests for the lesson
  const loadTests = async () => {
    try {
      const testList = await fetchTests(courseId, lessonId);
      setTests(Object.values(testList));

    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const goToTests = () => {
    navigate(`/course/${courseId}/lesson/${lessonId}/test`);
  };

  if (!lesson) return <div>Loading...</div>;

  return (
    <div>
      <NavigationBarUser />

      <Link to={`/course/${courseId}`} className='go-back-link roboto-medium'>
        <FaArrowLeftLong />
        Go Back
      </Link>

      <div className='lesson-header'>
        {/* Display the lesson ID and status */}
        <h2 className={`tag tag-blue roboto-bold`}>Lesson {lesson.number}</h2>
        <h1 className={`title fira-code`}>{lesson.title}</h1>
      </div>
      
      {lesson.content.map((item, index) => (
        <div key={index} className='lesson-content roboto-regular'>
          {item.type === 'text' && <p>{item.content}</p>}
                  {item.type === 'code' && (
                      <div>
                          <h3>Code Example:</h3>
                          <pre>{item.input}</pre>
                          <h4>Output:</h4>
                          <pre>{item.output}</pre>
                      </div>
                  )}
        </div>
      ))}

      <Button text={'GO TO TESTS'} action={goToTests}></Button>
    </div>
  );
};

export default LessonTemplate;