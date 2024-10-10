import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './TestSystem.css';
import HintSystem from '../components/HintSystem';
import { useAuth } from '../context/AuthContext';
import CompilerComponent from '../components/SubmitCode';
import CodeEditor from '../components/CodeEditor';
import { saveUserAnswers } from '../utils/DataSaving';
import { fetchTests } from '../utils/DataFetching';

const TestSystem = ({ courseId, lessonId }) => {
  const { usersId } = useAuth();  // Get the user ID from the Auth context
  const [tests, setTests] = useState(null);
  const [currentTestIndex, setCurrentTestIndex] = useState(0); // Track current test index
  const [userAnswers, setUserAnswers] = useState([]); // Track user input for all tests
  const [showAnswer, setShowAnswer] = useState(false); // Show correct answer toggle
  const [isCorrect, setIsCorrect] = useState(null); // Track if user's answer is correct
  const [code, setCode] = useState(''); // State to hold the code
  const navigate = useNavigate();

  
  // Load tests component on mount
  useEffect(() => {
    loadTests();
  }, [courseId, lessonId]);

  // Fetch all of the tests for the lesson
  const loadTests = async () => {
    try {
      const testList = await fetchTests(courseId, lessonId);
      setTests(Object.values(testList));

    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const currentTest = tests ? tests[currentTestIndex] : null;

  const handleCheckAnswer = () => {
    if (userAnswers[currentTestIndex].trim() === currentTest.answer.trim()) {
      setIsCorrect(true); // Correct answer
    } else {
      setIsCorrect(false); // Incorrect answer
    }
  };
  // Toggle showing the correct answer
  const handleShowAnswer = () => setShowAnswer(true);

  // Moves to the next test, cycling through the list
  const handleNextTest = () => {
    setCurrentTestIndex((prev) => (prev + 1) % tests.length);
    setIsCorrect(null);
    setShowAnswer(false);
  };

  // Moves to the previous test
  const handlePreviousTest = () => {
    setCurrentTestIndex((prev) => (prev - 1 + tests.length) % tests.length);
    setIsCorrect(null);
    setShowAnswer(false);
  };

  // Updates the users anser for the test
  const handleUserInputChange = (e) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[currentTestIndex] = e.target.value;
    setUserAnswers(updatedAnswers);
  };

  // Quits the test and navigates back to course page
  const handleQuit = () => {
    if (window.confirm("Are you sure you want to quit the test? All progress will be lost!")) {
      navigate(`/course/${courseId}`);
    }
  };

  // Function to save answers to Firestore
  const saveAnswers = async () => {
    try {
      const success = await saveUserAnswers(usersId, courseId, lessonId, tests, userAnswers);
      if (success) {
          alert('Answers saved successfully!');
          navigate(`/course/${courseId}`); // Navigate after saving
      }
    } catch (error) {
        alert(error.message); // Show error message
    }
  };

  if (!tests) return <div>Loading...</div>;

  if (tests.length === 0) return <div>No tests avaliable.</div>;

  return (
    <div className="test-system">
      <div className="header">
        <button className="quit-button" onClick={handleQuit}>&#x2190; Go Back</button>
      </div>


      <HintSystem hint={currentTest.hint} testId={currentTest.number} />

      <h2>{currentTest.number}. {currentTest.question}</h2>

      <CodeEditor onCodeChange={setCode} /> {/* Update code in state */}
      <CompilerComponent code={code} /> {/* Submit the current code */}

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
