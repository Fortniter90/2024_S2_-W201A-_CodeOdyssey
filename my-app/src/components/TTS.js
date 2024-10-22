import React, { useState } from 'react';
import './TTS.css';
import { FaVolumeHigh, FaVolumeXmark } from 'react-icons/fa6';

const TTS = ({ text }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    const speech = new SpeechSynthesisUtterance(text);
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.speak(speech);
      setIsPlaying(true);

      // Stop playing when finished
      speech.onend = () => {
        setIsPlaying(false);
      };
    }
  };

  return (
    <div className="tooltip-container">
      <div
        className="tts-button"
        onClick={handleSpeak}
        role="button"
        tabIndex="0"
      >
        {isPlaying ? <FaVolumeHigh /> : <FaVolumeXmark />}
      </div>
      <span className="tooltip">Text to Speech</span>
    </div>
  );
};

export default TTS;
