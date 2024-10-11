import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Establish a Socket.IO connection to the backend server
const socket = io("http://localhost:8080");

function CompilerComponent({ code, answer }) {
  // States to manage source code, output, and errors
  const [isCorrect, setIsCorrect] = useState(null); // To track if the answer is correct or not
  const [output, setOutput] = useState(''); // State to store the output from the server
  const [error, setError] = useState(''); // State to store any errors returned from the server
  const [showResults, setShowResults] = useState(false); // To control when to show the results

  useEffect(() => {
    // Listen for the "codeResult" event from the backend
    socket.on("codeResult", (data) => {
      setShowResults(true); // Show the results once we have them
      if (data.error) {
        setError(data.error); // If there's an error, set the error state
        setOutput(''); // Clear the output state
        setIsCorrect(false); // Mark the answer as incorrect in case of an error
      } else {
        setOutput(data.output); // If successful, set the output state
        setError(''); // Clear the error state
        if (data.output.trim() === answer.trim()) {
          setIsCorrect(true);
        } else {
          setIsCorrect(false);
        }
      }
    });

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      socket.off("codeResult"); // Unsubscribe from the event to avoid memory leaks
    };
  }, [output]);

  // Function to handle code submission to the backend
  const handleSubmit = () => {
    setShowResults(false); // Hide results when resubmitting code
    // Emit the "submitCode" event with source code and language ID (62 = JavaScript in Judge0)
    socket.emit("submitCode", { source_code: code, language_id: 62 });
  };

  return (
    <div>
      {/* Button to trigger the handleSubmit function */}
      <button onClick={handleSubmit}>Run Code/Check Answer</button>

      {/* Only show output and answer comparison after submission */}
      {showResults && (
        <>
          <h3>Output:</h3>
          {error ? (
            <pre style={{ border: '2px solid red', padding: '10px' }}>Error: {error}</pre> // If there's an error, show it with a red border
          ) : (
            <pre
              style={{
                border: `2px solid ${isCorrect ? 'green' : 'red'}`, // Green border if correct, red if incorrect
                padding: '10px',
              }}
            >
              {output}
            </pre>
          )}

          <h3>Expected Output:</h3>
          <pre
            style={{
              border: `2px solid ${isCorrect ? 'green' : 'red'}`, // Green border if correct, red if incorrect
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

