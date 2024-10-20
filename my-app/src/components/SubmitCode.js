import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Button from './Button';
import './SubmitCode.css';

// Establish a Socket.IO connection to the backend server
const socket = io("http://localhost:8080");

function CompilerComponent({ code, answer, language, showAnswer, navigationButtons }) {
  // States to manage source code, output, and errors
  const [isCorrect, setIsCorrect] = useState(null);
  const [output, setOutput] = useState(''); // State to store the output from the server
  const [error, setError] = useState(''); // State to store any errors returned from the server
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    socket.on("codeResult", (data) => {
      if (data.output !== null) {
        setShowResults(true);
        if (data.error) {
          setError(data.error);
          setOutput('');
          setIsCorrect(false);
        } else {
          setOutput(data.output);
          setError('');
          setIsCorrect(data.output.trim() === answer.trim());
        }
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
          />
          
          <Section 
            title={'Expected Output'}
            children={answer}
          />
        </div>
      )}
    </>
  );
}

// Section component to render a the output and expected output
const Section = ({ title, children }) => (
  <div className='code-results'>
    <h2 className='roboto-bold'>{title}</h2>
    <pre>{children}</pre>
  </div>
);

export default CompilerComponent;
