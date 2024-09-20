import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import './TestSystem.css';

const TestSystem = ({ courseId="WhWBHUFHy6M3eOHSxKfd", lessonId="vMDGQYKRWM8qdh5je5U2" }) => {
  const [tests, setTests] = useState(null);
  const [currentTestIndex, setCurrentTestIndex] = useState(0); // Track current test index
  const [userAnswer, setUserAnswers] = useState(''); // Track user input
  const [showAnswer, setShowAnswer] = useState(false); // Show correct answer toggle
  const [isCorrect, setIsCorrect] = useState(null); // Track if user's answer is correct

  useEffect(() => {
    //useEffect to fetch tests whenever courseID or lessonID changes
    const fetchTest = async () => {
      try {
        //Define the collection path for the tests based on the courseID and lessonID
        const testsCollection = collection(db, `courses/${courseId}/lessons/${lessonId}/tests`);
        //Fetch documents from the specified tests collection
        const testSnapshot = await getDocs(testsCollection);
        //Map the fetched documents to an array of test data
        const testList = testSnapshot.docs.map((doc) => doc.data());
        //Update thge state with the fetched tests
        setTests(testList);
        //Initialize userAnsers array with empty strings
        setUserAnswers(Array(testList.length).fill(''));

      } catch (error) {
        //Log any errors that occur during the fetch
        console.error('Error fetching tests:', error);

        //Set tests state to an empty array in case of error
        setTests([]);
      }
    };


    //Call the fetchTest functions to initiate the data fetching
    fetchTest();
  }, [courseId, lessonId]);

  //Display a loading message if tests are still being fetched or if no tests are found
  if (!tests || tests.length === 0) return <div>Loading...</div>;

  const currentTest = tests[currentTestIndex];

  // Function to check user's answer
  const handleCheckAnswer = () => {
    if (userAnswer.trim() === currentTest.answer.trim()) {
      setIsCorrect(true); // Correct answer
    } else {
      setIsCorrect(false); // Incorrect answer
    }
  };

  // Function to show the correct answer
  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  // Function to go to the next test
  const handleNextTest = () => {
    setCurrentTestIndex((prev) => (prev + 1) % tests.length); // Loop to the next test
    setIsCorrect(null); // Reset correctness
    setShowAnswer(false); // Hide correct answer
  };

  // Function to go to the previous test
  const handlePreviousTest = () => {
    setCurrentTestIndex((prev) => (prev - 1 + tests.length) % tests.length); // Loop to the previous test
    setIsCorrect(null);
    setShowAnswer(false);
  };

  const handleUserInputChange = (e) => {
    const updatedAnswers = [...userAnswer];
    updatedAnswers[currentTestIndex] = e.target.value; // Update the specific test's answer
    setUserAnswers(updatedAnswers);
  };

  // Handle quit button
  const handleQuit = () => {
    const confirmQuit = window.confirm("Are you sure you want to quit the test? All progress will be lost!");
    if (confirmQuit) {
      window.location.href = '/'; // Redirect to dashboard (change as needed)
    }
  };

  // Renders the TestSystem component displaying the current test question, user input, and navigation buttons
  return (
    <div className="test-system">
      <div className="header">
        <button className="quit-button" onClick={handleQuit}>&#x2190; Go Back</button>
      </div>

      <h2>{currentTest.number}. {currentTest.question}</h2>

      <textarea
        value={userAnswer[currentTestIndex]} // Keeps the answer for the current test
        onChange={handleUserInputChange} // Updates answer for the current test
        placeholder="Enter your code here..."
      />

      <div className="buttons">
        <button onClick={handleCheckAnswer}>Run Code</button>
        <button onClick={handleShowAnswer}>Show Answer</button>
        {currentTestIndex !== 0 && <button onClick={handlePreviousTest}>Previous Test</button>}
        {currentTestIndex === tests.length - 1 ? 
          <button onClick={handleNextTest}>Finish Test</button> :
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
