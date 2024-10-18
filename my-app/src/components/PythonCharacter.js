import ProgrammingCharacter from './ProgrammingCharacter';
import SnakeNeutral from './assets/SnakeS2-Neutral.png'; // Importing the neutral snake image
import SnakeHappy from './assets/SnakeS2-Happy.png'; // Importing the happy snake image
import SnakeVoice from './assets/SnakeVoice.mp3'; // Importing the audio file

// Defining the PythonCharacter component
const PythonCharacter = () => {
  return (
    <>
      <ProgrammingCharacter 
        neutralImage={SnakeNeutral}
        alternativeImage={SnakeHappy}
        characterVoice={SnakeVoice}
        speechText={'Ssssssoooo you want to learn Python? Well you\'re in luck! I\'ll be here to teach you 📚'}
        altText={'Snake Image'}
      />
    </>
  );
};

export default PythonCharacter; // Exporting the PythonCharacter component for use in other parts of the application
