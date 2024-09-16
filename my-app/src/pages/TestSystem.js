// This is a test system so that the user can test their knowledge throughout the duration of the courses.
import React, { useState } from 'react';
import './TestSystem.css';

//Array of questions and their correct answers for the test.
const questions = [
  {
    question: "1. Write a Java program to print 'Hello, World!'",
    correctAnswer: 
    `public class Main {
      public static void main(String[] args) {
          System.out.println("Hello, World!");
    }
}` //Correct Java Code for "Hello World Program".
  },
  {
    question: "2. Write a Java program that declares an integer variable and assigns the value 10 to it.",
    correctAnswer: 
    `public class Main {
    public static void main(String[] args) {
        int num = 10;
    }
}`// Correct Java code for variable assignment.
  },
  {
    question: "3. Write a Java program that prints the sum of 5 and 10.",
    correctAnswer: 
    `public class Main {
    public static void main(String[] args) {
        int sum = 5 + 10;
        System.out.println(sum);
    }
}` //Correct Java code for the sum calculation.
  }
];

function TestSystem() {
  //Stating variables to track the current question, user input, whether to show the answer, and if the answer is correct.
  const [currentQuestion, setCurrentQuestion] = useState(0); //Tracks the current question index.
  const [userAnswer, setUserAnswer] = useState(''); //Tracks the users answer input.
  const [showAnswer, setShowAnswer] = useState(false); //Controls whether the correct answer is displayed.
  const [isCorrect, setIsCorrect] = useState(null); //Tracks if the users answer is correct or not.

  //FUnction to check if the users answer matches the correct answer.
  const handleCheckAnswer = () => {
    if (userAnswer.trim() === questions[currentQuestion].correctAnswer.trim()) {
      setIsCorrect(true); //Set to true of the users answer is correct.
    } else {
      setIsCorrect(false); //Set to false if the users answer is incorrect.
    }
  };

  //Function to show the correct answer.
  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  //Function to go to the next question.
  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => (prev + 1) % questions.length); //Move to the next question, loop back if at the end.
    setUserAnswer(''); //Clear the users input.
    setIsCorrect(null); // Reset the result status
    setShowAnswer(false); //Hide the answer.
  };

  //Function to go to the previous question.
  const handlePreviousQuestion = () => {
    setCurrentQuestion((prev) => (prev - 1 + questions.length) % questions.length); //Move to the previous question, loop back if at the start.
    setUserAnswer('');
    setIsCorrect(null);
    setShowAnswer(false);
  };

  //Handling the Quit Button Click
  const handleQuit = () => {
    const confirmQuit = window.confirm("Are you sure you want to quit the test? All progress will be lost!");
    if (confirmQuit) {
        window.location.href = '/'; //Need to change this to redirect to dahsboard page!.
    }
  };

  return (
    <div className="test-system">
      {/* Quit button and header */}
        <div className="header">
            <button className="quit-button" onClick={handleQuit}>&#x2190;      Go Back</button>
            </div>
      {/* Displays the current question */}      
      <h2>Lesson 1: Introduction to Java</h2>
      <p>{questions[currentQuestion].question}</p>

      {/* Textarea for the user to input their answer */}
      <textarea 
        value={userAnswer} 
        onChange={(e) => setUserAnswer(e.target.value)} 
        placeholder="Enter your code here..."
      />

      {/* Buttons for checking the answer, showing the answer, and navigating between exercises */}
      <div className="buttons">
        <button onClick={handleCheckAnswer}>Run Code</button>
        <button onClick={handleShowAnswer}>Show Answer</button>
        <button onClick={handlePreviousQuestion}>Previous Exercise</button>
        <button onClick={handleNextQuestion}>Next Exercise</button>
      </div>

      {/* Display the result if the answer is correct or incorrect */}
      {isCorrect !== null && (
        <div className="result">
          {isCorrect ? <p>Correct!</p> : <p>Incorrect.Please Try Again!</p>}
        </div>
      )}
      
      {/* Display the correct answer if requested */}
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
