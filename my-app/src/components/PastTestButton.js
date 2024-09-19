import React from 'react';
import './PastTestButton.css';
import { useNavigate } from 'react-router-dom';


function PastTestButton() {
  const navigate = useNavigate();
  //Creating the navigate function to programmatically change routes

  const handleStartTest = () => {
    navigate('/past-tests'); // Navigate to the PastTests page
  };

  return (
    <button className="past-test-button" onClick={handleStartTest}>
      {/* Button with class 'past-test-button' for styling and an onClick handler to trigger navigation */}
      Review Past Tests
    </button>
  );
}

export default PastTestButton;

