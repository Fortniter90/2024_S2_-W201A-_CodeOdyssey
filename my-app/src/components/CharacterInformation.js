import React, { useState } from 'react';
import './CharacterInformation.css'; 
import capy1 from '../assets/capy1.png'; 
import capy2 from '../assets/capy2.png'; 

const CharacterInformation = () => {
    //useState to manage the current displayed image, initalized with capy2
  const [currentImage, setCurrentImage] = useState(capy2); 

  const handleClick = () => {
    // Switching between capy2 and capy1
    setCurrentImage((prevImage) => (prevImage === capy2 ? capy1 : capy2));
  };

  return (
    <div className="character-info">
        {/* Displays the current image */}
      <img src={currentImage} alt="Capybara character" className="capy-image" />
      {/* Button to switch between images when clicked */}
      <button onClick={handleClick} className="switch-button">Click Here</button>
    </div>
  );
};

export default CharacterInformation;

