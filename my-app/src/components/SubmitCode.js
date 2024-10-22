import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Button from './Button';
import './SubmitCode.css';

// Establish a Socket.IO connection to the backend server
const socket = io("http://localhost:8080");

function CompilerComponent({ code, answer, language, showAnswer, navigationButtons }) {
  const [isCorrect, setIsCorrect] = useState(null);
  const [output, setOutput] = useState(''); // State to store the output from the server
  const [error, setError] = useState(''); // State to store any errors returned from the server
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    socket.on("codeResult", (data) => {
      console.log(data);
      if (data !== null) {
        setShowResults(true);
        if (data.error) {
          setError(data.error);
          setOutput('');
          setIsCorrect(false); // Mark as incorrect
        } else if (data.output) {
          setOutput(data.output);
          setError('');
          setIsCorrect(data.output.trim() === answer.trim()); // Compare output to answer
        }
      } else {
        setError("Can't Compile");
      }
    });

    return () => {
      socket.off("codeResult");
    };
  }, [answer]);

  // New useEffect to reset showResults when answer changes
  useEffect(() => {
    setShowResults(false);
  }, [answer]);

  const handleSubmit = () => {
    setShowResults(true);

    socket.emit("submitCode", { source_code: code, language: language });
  };

  return (
    <>
      {/* Buttons for navigating */}
      <div className='test-buttons'>
        <div className='test-buttons-left'>
          <Button text={'RUN CODE'} action={handleSubmit} color={'var(--green-medium)'} backgroundColor={'var(--background-light)'} hoverColor={'var(--green-dark)'} />
          {showAnswer}
        </div>

        <div className='test-buttons-right'>
          {navigationButtons}
        </div>
      </div>

      {/* Compiler results */}
      {showResults && (
        <div className='code-results-container'>
          <Section
            title={'Output'}
            children={error ? error : output}
            isCorrect={isCorrect}
          />

          <Section
            title={'Expected Output'}
            children={answer}
            isCorrect={isCorrect}
          />
        </div>
      )}
    </>
  );
}

// Section component to render the output and expected output
const Section = ({ title, children, isCorrect }) => (
  <div className={`code-results ${isCorrect === true ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}>
    <h2 className='roboto-bold'>{title}</h2>
    <pre>{children}</pre>
  </div>
);

export default CompilerComponent;

