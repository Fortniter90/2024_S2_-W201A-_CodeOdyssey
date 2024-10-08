import React, { useState } from 'react';
import { HiInformationCircle } from 'react-icons/hi2';
import './JavaCharacter.css';
import CapybaraNeutral from './assets/CapybaraS2-Neutral.png'; // Importing the neutral capybara image
import CapybaraHappy from './assets/CapybaraS2-Happy.png'; // Importing the happy capybara image


const JavaCharacter = () => {
  const [isHappy, setIsHappy] = useState(false);

  const handleClick = () => {
    setIsHappy(!isHappy); 
  };

  return (
    <div className="java-character-container">
      {isHappy && (
        <div className="speech-box">
          <p className="speech-text">
            <b>Hello!</b> Welcome to the Java programming course, I'm the Javabara! Here to assist you 😊
          </p>
        </div>
      )}
      <div className="capybara-container">
        <img 
          src={isHappy ? CapybaraHappy : CapybaraNeutral} 
          alt="Capybara" 
          className="capybara-image"
        />
        <HiInformationCircle onClick={handleClick} className="info-icon" />
      </div>
    </div>
  );
};

export default JavaCharacter;
