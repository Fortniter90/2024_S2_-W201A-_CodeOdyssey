import React, { useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi2'; // Importing the information icon from react-icons
import './PythonCharacter.css'; // Make sure the CSS file is correctly linked
import SnakeNeutral from './assets/SnakeS2-Neutral.png'; // Importing the neutral snake image
import SnakeHappy from './assets/SnakeS2-Happy.png'; // Importing the happy snake image

// Defining the PythonCharacter component
const PythonCharacter = () => {

  // State to track if the snake is happy or not
  const [isHappy, setIsHappy] = useState(false);

   // Function to toggle the happy state when the information icon is clicked
  const handleClick = () => {
    setIsHappy(!isHappy); // Toggling the isHappy state
  };

  return (
    <div className="python-character-container"> {/* Main container for the Python character */}
      {isHappy && ( // Conditionally render the speech box if isHappy is true
        <div className="speech-box">
          <p className="speech-text">
            Ssssssoooo you want to learn Python? Well you're in luck! I'll be here to teach you 📚
          </p>
        </div>
      )}
      <div className="snake-container"> {/* Container for the snake image and information icon */}
        <img 
          src={isHappy ? SnakeHappy : SnakeNeutral} // Change image based on isHappy state
          alt="Snake" // Alternative text for the image
          className="snake-image" // Class for styling the image
        />
        <HiInformationCircle onClick={handleClick} className="info-icon" /> {/* Information icon with click handler */}
      </div>
    </div>
  );
};

export default PythonCharacter; // Exporting the PythonCharacter component for use in other parts of the application
