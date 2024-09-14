// This is a test system so that the user can test their knowledge throughout the duration of the courses.
import React, { useState } from 'react';
import './TestSystem.css';

const questions = [
  {
    question: "Write a Java program to print 'Hello, World!'",
    correctAnswer: 
    `public class Main {
      public static void main(String[] args) {
          System.out.println("Hello, World!");
    }
}`
  },
  {
    question: "Write a Java program that declares an integer variable and assigns the value 10 to it.",
    correctAnswer: 
    `public class Main {
    public static void main(String[] args) {
        int num = 10;
    }
}`
  },
  {
    question: "Write a Java program that prints the sum of 5 and 10.",
    correctAnswer: 
    `public class Main {
    public static void main(String[] args) {
        int sum = 5 + 10;
        System.out.println(sum);
    }
}`
  }
];

function TestSystem() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleCheckAnswer = () => {
    if (userAnswer.trim() === questions[currentQuestion].correctAnswer.trim()) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length);
    setUserAnswer('');
    setIsCorrect(null);
    setShowAnswer(false);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestion((prev) => (prev - 1 + questions.length) % questions.length);
    setUserAnswer('');
    setIsCorrect(null);
    setShowAnswer(false);
  };

  //Handling the Quit Button Click
  const handleQuit = () => {
    const confirmQuit = window.confirm("Are you sure you want to quit the test? All progress will be lost!");
    if (confirmQuit) {
        window.location.href = '/'; //Need to change this to redirect to dahsboard page.
    }
  };

  return (
    <div className="test-system">
        <div className="header">
            <button className="quit-button" onClick={handleQuit}>Q U I T</button>
            </div>
      <h2>Lesson 1: Introduction to Java</h2>
      <p>{questions[currentQuestion].question}</p>
      <textarea 
        value={userAnswer} 
        onChange={(e) => setUserAnswer(e.target.value)} 
        placeholder="Enter your code here..."
      />
      <div className="buttons">
        <button onClick={handleCheckAnswer}>Run Code</button>
        <button onClick={handleShowAnswer}>Show Answer</button>
        <button onClick={handlePreviousQuestion}>Previous Exercise</button>
        <button onClick={handleNextQuestion}>Next Exercise</button>
      </div>

      {isCorrect !== null && (
        <div className="result">
          {isCorrect ? <p>Correct!</p> : <p>Incorrect.Please Try Again!</p>}
        </div>
      )}

      {showAnswer && (
        <div className="answer">
          <h3>Correct Answer:</h3>
          <pre>{questions[currentQuestion].correctAnswer}</pre>
        </div>
      )}
    </div>
  );
}

export default TestSystem;
