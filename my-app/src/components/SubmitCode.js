import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Establish a Socket.IO connection to the backend server
const socket = io("http://localhost:8080");

function CompilerComponent({ code, answer, language }) {
  const [isCorrect, setIsCorrect] = useState(null);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);

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

    return () => {
      socket.off("codeResult");
    };
  }, [answer]);

  // New useEffect to reset showResults when answer changes
  useEffect(() => {
    setShowResults(false);
  }, [answer]);

  const handleSubmit = () => {
    setShowResults(false);

    socket.emit("submitCode", { source_code: code, language: language });
  };

  return (
    <div>
      <button onClick={handleSubmit}>Run Code/Check Answer</button>

      {showResults && (
        <>
          <h3>Output:</h3>
          {error ? (
            <pre style={{ border: '2px solid red', padding: '10px' }}>Error: {error}</pre>
          ) : (
            <pre
              style={{
                border: `2px solid ${isCorrect ? 'green' : 'red'}`,
                padding: '10px',
              }}
            >
              {output}
            </pre>
          )}

          <h3>Expected Output:</h3>
          <pre
            style={{
              border: `2px solid ${isCorrect ? 'green' : 'red'}`,
              padding: '10px',
            }}
          >
            {answer}
          </pre>
        </>
      )}
    </div>
  );
}

export default CompilerComponent;
