//JavaBara Character Component
import React, { useState, useRef } from 'react';
import { HiInformationCircle } from 'react-icons/hi2'; // Importing the information icon from react-icons
import './JavaCharacter.css'; //Importing the CSS file for the styling
import CapybaraNeutral from './assets/CapybaraS2-Neutral.png'; // Importing the neutral capybara image
import CapybaraHappy from './assets/CapybaraS2-Happy.png'; // Importing the happy capybara image
import JavabaraVoice from './assets/JavabaraVoice.mp3'; // Importing the audio file

// Defining the JavaCharacter component
const JavaCharacter = () => {
  // State to track if the capybara is happy or not
  const [isHappy, setIsHappy] = useState(false);
  
  // Reference to the audio element
  const audioRef = useRef(null);

  // Function to toggle the happy state and conditionally play the audio
  const handleClick = () => {
    if (!isHappy) {  // Only play audio if the capybara is in the neutral state
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
    setIsHappy(!isHappy); // Toggle between neutral and happy states
  };

  return (
    <div className="java-character-container">  {/* Main container for the Java character */}
      {isHappy && (  // Conditionally render the speech box if isHappy is true
        <div className="speech-box">
          <p className="speech-text">
            <b>Hello!</b> Welcome to the Java programming course, I'm the Javabara! Here to assist you 😊
          </p>
        </div>
      )}
      <div className="capybara-container"> {/* Container for the capybara image and information icon */}
        <img 
          src={isHappy ? CapybaraHappy : CapybaraNeutral} // Change the image based on the isHappy state
          alt="Capybara" // Alternative text for the image
          className="capybara-image" // Class for styling the image
        />
        <HiInformationCircle onClick={handleClick} className="info-icon" /> {/* Information icon with click handler */}
      </div>
      <audio ref={audioRef} src={JavabaraVoice} /> {/* Audio element with the mp3 file */}
    </div>
  );
};

export default JavaCharacter; // Exporting the JavaCharacter component for use in other parts of the application
