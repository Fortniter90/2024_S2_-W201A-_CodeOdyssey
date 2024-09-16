import React from 'react';
import './TestButton.css';
import { useNavigate } from 'react-router-dom';

function TestButton() {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate('/test-system'); // This navigates to the TestSystem page
  };

  return (
    <button className="test-button" onClick={handleStartTest}>
      Begin Test
    </button>
  );
}

export default TestButton;
