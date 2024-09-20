import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import './LessonTemplate.css';
import Button from '../components/Button';
import NavigationBarUser from '../components/NavigationBarUser';

const LessonTemplate = () => {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [tests, setTests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLesson = async () => {
      const lessonDoc = doc(db, `courses/${courseId}/lessons`, lessonId);
      const lessonSnapshot = await getDoc(lessonDoc);
      setLesson(lessonSnapshot.data());
    };
    
    fetchLesson();
  }, [courseId, lessonId]);
  
  useEffect(() => {
    const fetchTests = async () => {
        const lessonsCollection = collection(db, `courses/${courseId}/lessons/${lessonId}/tests`);
        const lessonSnapshot = await getDocs(lessonsCollection);
        const lessonList = lessonSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTests(lessonList);
    };
    fetchTests();
  }, [courseId, lessonId]);

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