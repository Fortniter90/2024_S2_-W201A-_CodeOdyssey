import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Establish a Socket.IO connection to the backend server
const socket = io("http://localhost:8080");

function CompilerComponent({ code }) {
  // States to manage source code, output, and errors
  const [output, setOutput] = useState(''); // State to store the output from the server
  const [error, setError] = useState(''); // State to store any errors returned from the server

  useEffect(() => {
    // Listen for the "codeResult" event from the backend
    socket.on("codeResult", (data) => {
      if (data.error) {
        setError(data.error); // If there's an error, set the error state
        setOutput(''); // Clear the output state
      } else {
        setOutput(data.output); // If successful, set the output state
        setError(''); // Clear the error state
      }
    });

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      socket.off("codeResult"); // Unsubscribe from the event to avoid memory leaks
    };
  }, []);

  // Function to handle code submission to the backend
  const handleSubmit = () => {
    // Emit the "submitCode" event with source code and language ID (62 = JavaScript in Judge0)
    socket.emit("submitCode", { source_code: code, language_id: 62 });
  };

  return (
    <div>
      {/* Button to trigger the handleSubmit function */}
      <button onClick={handleSubmit}>Run Code</button>

      {/* Display output or errors in a <pre> tag */}
      <h3>Output:</h3>
      {error ? (
        <pre style={{ color: 'red' }}>Error: {error}</pre> // If there's an error, show it in red
      ) : (
        <pre>{output}</pre> // Otherwise, display the output
      )}
    </div>
  );
}

export default CompilerComponent;

