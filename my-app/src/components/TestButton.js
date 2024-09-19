import React from 'react';
import './TestButton.css';
import { useNavigate } from 'react-router-dom';

function TestButton() {
  const navigate = useNavigate();
  // Create a navigate function to programmatically change routes

  const handleStartTest = () => {
    navigate('/test-system'); // This navigates to the TestSystem page
  };

  return (
    <button className="test-button" onClick={handleStartTest}>
       {/* Button with class 'test-button' that triggers navigation to the TestSystem page on click */}
      Begin Test
    </button>
  );
}

export default TestButton;
