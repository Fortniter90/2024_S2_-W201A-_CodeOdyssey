import React, { useState, useEffect } from 'react';
import Button from './Button';
import './SubmitCode.css';

function CompilerComponent({ code, answer, language, showAnswer, navigationButtons, socket }) {
  const [isCorrect, setIsCorrect] = useState(null);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    socket.on("codeResult", (data) => {
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
    });

    socket.on("connect_error", (error) => {
      setConnectionError(`Backend Connection Failure: ${error.message}`);
      setShowResults(false);
    });

    return () => {
      socket.off("codeResult");
      socket.off("connect_error");
    };
  }, [answer, socket]);

  useEffect(() => {
    setShowResults(false);
    setConnectionError(null);
  }, [answer]);

  const handleSubmit = () => {
    setShowResults(false);
    setConnectionError(null);
    socket.emit("submitCode", { source_code: code, language: language });
  };

  return (
    <>
      <div className='test-buttons'>
        <div className='test-buttons-left'>
          <Button
            text={'RUN CODE'}
            action={handleSubmit}
            color={'var(--green-medium)'}
            backgroundColor={'var(--background-light)'}
            hoverColor={'var(--green-dark)'}
          />
          {showAnswer}
        </div>
        <div className='test-buttons-right'>
          {navigationButtons}
        </div>
      </div>

      {connectionError && (
        <div className="error-message" data-testid="connection-error">{connectionError}</div>
      )}

      {showResults && !connectionError && (
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

const Section = ({ title, children }) => (
  <div className='code-results'>
    <h2 className='roboto-bold'>{title}</h2>
    <pre>{children}</pre>
  </div>
);

export default CompilerComponent;

