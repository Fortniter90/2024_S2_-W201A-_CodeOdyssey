import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const TestTemplate = () => {
  const { courseId, lessonId, testId } = useParams();
  const [test, setTests] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      const testDoc = doc(db, `courses/${courseId}/lessons/${lessonId}/tests`, testId);
      const testSnapshot = await getDoc(testDoc);
      setTests(testSnapshot.data());
    };
    
    fetchTest();
  }, [courseId, lessonId, testId]);

  if (!test) return <div>Loading...</div>;

  return (
    <div>
        <Link to={`/course/${courseId}`}>Back</Link>

        <h1>{test.title}</h1>
        <p>{test.content}</p>
    </div>
  );
};

export default TestTemplate;