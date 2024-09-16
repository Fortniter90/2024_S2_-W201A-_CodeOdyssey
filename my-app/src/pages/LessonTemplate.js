import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const LessonTemplate = () => {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [tests, setTests] = useState([]);

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


  if (!lesson) return <div>Loading...</div>;

  return (
    <div>
        <Link to={`/course/${courseId}`}>Back</Link>

      <h1>Showing Lesson: {lesson.title}</h1>
      <p><strong>Lesson Number:</strong> {lesson.number}</p>
      <p><strong>Description:</strong> {lesson.description}</p>

      <h2>Tests for {lesson.title}</h2>
      
      <ul>
        {tests.map((test) => (
          <li key={test.id}>
            <Link to={`/course/${courseId}/lesson/${lessonId}/test/${test.id}`}>
                <p>{test.id}</p>
              <h3>{test.title}</h3>
              <p><strong>Content:</strong> {test.content}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LessonTemplate;