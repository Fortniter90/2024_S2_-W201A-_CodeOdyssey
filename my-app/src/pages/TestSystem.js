import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import './TestSystem.css';
import HintSystem from '../components/HintSystem';
import { useAuth } from '../context/AuthContext';
import CompilerComponent from '../components/SubmitCode';
import CodeEditor from '../components/CodeEditor';
import TTS from '../components/TTS';

const TestSystem = ({ courseId, lessonId }) => {
  const { usersId } = useAuth();  // Get the user ID from the Auth context
  const [tests, setTests] = useState(null);
  const [currentTestIndex, setCurrentTestIndex] = useState(0); // Track current test index
  const [userAnswers, setUserAnswers] = useState([]); // Track user input for all tests
  const [showAnswer, setShowAnswer] = useState(false); // Show correct answer toggle
  const [isCorrect, setIsCorrect] = useState(null); // Track if user's answer is correct
  const [code, setCode] = useState(''); // State to hold the code
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const testsCollection = collection(db, `courses/${courseId}/lessons/${lessonId}/tests`);
        const testsQuery = query(testsCollection, orderBy('number'));
        const testSnapshot = await getDocs(testsQuery);

        const testList = testSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
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

  const handleCheckAnswer = () => {
    if (userAnswers[currentTestIndex].trim() === currentTest.answer.trim()) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleShowAnswer = () => setShowAnswer(true);

  const handleNextTest = () => {
    setCurrentTestIndex((prev) => (prev + 1) % tests.length);
    setIsCorrect(null);
    setShowAnswer(false);
  };

  const handlePreviousTest = () => {
    setCurrentTestIndex((prev) => (prev - 1 + tests.length) % tests.length);
    setIsCorrect(null);
    setShowAnswer(false);
  };

  const handleUserInputChange = (e) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentTestIndex] = e.target.value;
    setUserAnswers(updatedAnswers);
  };

  const handleQuit = () => {
    if (window.confirm('Are you sure you want to quit the test? All progress will be lost!')) {
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
          userAnswer: userAnswers[i],
        };

        await addDoc(collection(db, `users/${usersId}/answers`), answerData);
      }

      alert('Answers saved successfully!');
    } catch (error) {
      console.error('Error saving answers:', error);
      alert('Failed to save answers. Please try again.');
    }

    navigate(`/course/${courseId}`);
  };

  if (!tests) return <div>Loading...</div>;

  if (tests.length === 0) return <div>No tests available.</div>;

  return (
    <div className="test-system">
      <div className="header">
        <button className="quit-button" onClick={handleQuit}>&#x2190; Go Back</button>
      </div>

      <div className="hint-tts-container">
        <HintSystem hint={currentTest.hint} testId={currentTest.number} />
        <TTS text={currentTest.question} />
      </div>

      <h2>{currentTest.number}. {currentTest.question}</h2>

      <CodeEditor onCodeChange={setCode} />
      <CompilerComponent code={code} />

      <div className="buttons">
        <button onClick={handleShowAnswer}>Show Answer</button>
        {currentTestIndex !== 0 && <button onClick={handlePreviousTest}>Previous Test</button>}
        {currentTestIndex === tests.length - 1 ?
          <button onClick={saveAnswers}>Save and Finish</button> :
          <button onClick={handleNextTest}>Next Test</button>
        }
      </div>

      {isCorrect !== null && (
        <div className="result">
          {isCorrect ? <p>Correct!</p> : <p>Incorrect. Please Try Again!</p>}
        </div>
      )}

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
