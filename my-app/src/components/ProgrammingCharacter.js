import { useRef, useState } from "react"
import { HiInformationCircle } from "react-icons/hi2";
import './ProgrammingCharacter.css';

// Component for character visuals
const ProgrammingCharacter = ({
    neutralImage,
    alternativeImage,
    characterVoice,
    speechText,
    altText
}) => {
    
    const [showText, setShowText] = useState(false);    // State to track text status
    const audioRef = useRef(null);                      // Reference to the audio element

    // Function to toggle between images and play the audio
    const handleImageChange = () => {
        // If image is in neutral state, play the audio
        if (showText) {
            if (characterVoice.current) {
                characterVoice.current.play();
            }
        }
        setShowText(!showText); // Toggle text status
    }

    return (
        <div className='programmingcharacter'>
            {/* Conditionally render the speech box */}
            {showText && (
                <div className='programmingcharacter-speech'>
                    <p>{speechText}</p>
                </div>
            )}

            {/* Container for the character image and information icon */}
            <div className='programmingcharacter-container'>
                {/* Change image based on text status */}
                <img src={showText ? alternativeImage : neutralImage} alt={altText} />

                {/* Information icon handler */}
                <HiInformationCircle onClick={handleImageChange} className='information-icon' />
            </div>

            {/* Audio element for character */}
            <audio ref={audioRef} src={characterVoice} />
        </div>
    )
}

export default ProgrammingCharacter;