import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import './TestSystem.css';
import HintSystem from '../components/HintSystem';
import { useAuth } from '../context/AuthContext';
import CompilerComponent from '../components/SubmitCode';
import CodeEditor from '../components/CodeEditor';

const TestSystem = ({ courseId, lessonId }) => {
  const { usersId } = useAuth();
  const [tests, setTests] = useState(null);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const testsCollection = collection(db, `courses/${courseId}/lessons/${lessonId}/tests`);
        const testsQuery = query(testsCollection, orderBy('number'));
        const testSnapshot = await getDocs(testsQuery);

        const testList = testSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setTests(testList);
        setUserAnswers(Array(testList.length).fill(''));
      } catch (error) {
        console.error('Error fetching tests:', error);
        setTests([]);
      }
    };

    fetchTest();
  }, [courseId, lessonId]);

  const currentTest = tests ? tests[currentTestIndex] : null;

  const handleShowAnswer = () => setShowAnswer(true);

  const handleNextTest = () => {
    setCurrentTestIndex((prevIndex) => Math.min(prevIndex + 1, tests.length - 1));
    setShowAnswer(false);
  };

  const handlePreviousTest = () => {
    setCurrentTestIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    setShowAnswer(false);
  };

  const handleUserInputChange = useCallback((newCode) => {
    setUserAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentTestIndex] = newCode;
      return updatedAnswers;
    });
  }, [currentTestIndex]);

  const handleQuit = () => {
    if (window.confirm("Are you sure you want to quit the test? All progress will be lost!")) {
      navigate(`/course/${courseId}`);
    }
  };

  const saveAnswers = async () => {
    try {
      if (!usersId) {
        alert('User ID is not available. Please log in.');
        return;
      }

      for (let i = 0; i < tests.length; i++) {
        const answerData = {
          courseId,
          lessonId,
          testId: tests[i].id,
          userAnswer: userAnswers[i]
        };

        await addDoc(collection(db, `users/${usersId}/answers`), answerData);
      }

      alert('Answers saved successfully!');
      navigate(`/course/${courseId}`);
    } catch (error) {
      console.error('Error saving answers:', error);
      alert('Failed to save answers. Please try again.');
    }
  };

  if (!tests) return <div>Loading...</div>;
  if (tests.length === 0) return <div>No tests available.</div>;

  return (
    <div className="test-system">
      <div className="header">
        <button className="quit-button" onClick={handleQuit}>&#x2190; Go Back</button>
      </div>

      <HintSystem hint={currentTest.hint} testId={currentTest.number} />

      <h2>{currentTest.number}. {currentTest.question}</h2>

      <CodeEditor onCodeChange={handleUserInputChange} code={userAnswers[currentTestIndex] || ''} />
      <CompilerComponent code={userAnswers[currentTestIndex] || ''} answer={currentTest.requiredOutput} />

      <div className="buttons">
        <button onClick={handleShowAnswer}>Show Answer</button>
        {currentTestIndex !== 0 && <button onClick={handlePreviousTest}>Previous Test</button>}
        {currentTestIndex === tests.length - 1 ?
          <button onClick={saveAnswers}>Save and Finish</button> :
          <button onClick={handleNextTest}>Next Test</button>
        }
      </div>

      {showAnswer && (
        <div className="answer">
          <h3>Correct Answer:</h3>
          <pre>{currentTest.answer}</pre>
        </div>
      )}
    </div>
  );
};

export default TestSystem;

