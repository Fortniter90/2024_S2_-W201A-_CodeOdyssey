import React, { useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi2'; // Importing the information icon from react-icons
import './CCharacter.css'; // Ensuring the correct path for the CSS
import BunnyNeutral from './assets/BunnyS2-Neutral_Happy.png'; // Importing the neutral happy bunny image
import BunnyConcerned from './assets/BunnyS2-Concerned.png'; // Importing the concerned bunny image

// Defining the CCharacter component
const CCharacter = () => {
  // State to track if the bunny is concerned or not
  const [isConcerned, setIsConcerned] = useState(false);

  // Function to toggle the concerned state when the information icon is clicked
  const handleClick = () => {
    setIsConcerned(!isConcerned); // Toggle the isConcerned state
  };

  return (
    <div className="c-character-container"> {/* Main container for the C character */}
      {isConcerned && ( // Conditionally render the speech box if isConcerned is true
        <div className="speech-box">
          <p className="speech-text">
          ⭐ Hi there! My name is Bon Bon, I'll be here to support you through this journey! Let's C... how far we can get!! ⭐
          </p>
        </div>
      )}
      <div className="bunny-container"> {/* Container for the bunny image and information icon */}
        <img 
          src={isConcerned ? BunnyConcerned : BunnyNeutral} // Change image based on isConcerned state
          alt="Bunny" // Alternative text for the image
          className="bunny-image" // Class for styling the image
        />
        <HiInformationCircle onClick={handleClick} className="info-icon" /> {/* Information icon with click handler */}
      </div>
    </div>
  );
};

export default CCharacter; // Exporting the CCharacter component for use in other parts of the application
