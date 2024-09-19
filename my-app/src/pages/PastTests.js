import React from 'react';
import { useNavigate } from 'react-router-dom';

function PastTests() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/'); // Navigate back to the page where "Review Past Tests" button is (Need to add that here)
  };

  return (
    <div>
      <h1>Past Tests</h1>
      <p>This page will display all your past tests.</p>
      <button onClick={handleBack}>Back</button> {/* This is the back button */}
    </div>
  );
}

export default PastTests;


