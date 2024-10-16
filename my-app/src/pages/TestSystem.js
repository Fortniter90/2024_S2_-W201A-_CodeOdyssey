import { useState, useEffect, useCallback } from 'react';
import { fetchCourses } from '../utils/DataFetching';
import { useNavigate } from 'react-router-dom';
import './TestSystem.css';
import HintSystem from '../components/HintSystem';
import { useAuth } from '../context/AuthContext';
import CompilerComponent from '../components/SubmitCode';
import CodeEditor from '../components/CodeEditor';
import { saveUserAnswers } from '../utils/DataSaving';
import { fetchTests } from '../utils/DataFetching';
import TTS from '../components/TTS';

const TestSystem = ({ courseId, lessonId }) => {
  const { usersId } = useAuth();
  const [tests, setTests] = useState(null);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [language, setLanguage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        // Fetch all courses from Firestore
        const coursesCollection = await fetchCourses();
        setLanguage(coursesCollection[courseId].language);
      } catch (error) {
        console.error('Error fetching course language:', error);
      }
    };

    fetchLanguage();
  }, [courseId]); // Add courseId as a dependency


  
  // Load tests component on mount
  useEffect(() => {
    loadTests();
  }, [courseId, lessonId]);

  // Fetch all of the tests for the lesson
  const loadTests = async () => {
    try {
      const testList = await fetchTests(courseId, lessonId);
      setTests(Object.values(testList));
      setUserAnswers(Array(Object.keys(testList).length).fill(''));
    } catch (error) {
      console.error('Error loading courses:', error);
      setTests([]);
    }
  };

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
    if (window.confirm('Are you sure you want to quit the test? All progress will be lost!')) {
      navigate(`/course/${courseId}`);
    }
  };

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

      <CodeEditor onCodeChange={handleUserInputChange} code={userAnswers[currentTestIndex] || ''} />
      <CompilerComponent code={userAnswers[currentTestIndex] || ''} answer={currentTest.requiredOutput} language={language} />
      <HintSystem hint={currentTest.hint} testId={currentTest.number} />

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

