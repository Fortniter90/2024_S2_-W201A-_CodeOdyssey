import ProgrammingCharacter from './ProgrammingCharacter';
import BunnyNeutral from './assets/BunnyS2-Neutral_Happy.png'; // Importing the neutral happy bunny image
import BunnyConcerned from './assets/BunnyS2-Concerned.png'; // Importing the concerned bunny image
import BunnyVoice from './assets/BunnyVoice.mp3'; // Importing the audio file


// Defining the CCharacter component
const CCharacter = () => {
  return (
    <>
      <ProgrammingCharacter 
        neutralImage={BunnyNeutral}
        alternativeImage={BunnyConcerned}
        characterVoice={BunnyVoice}
        speechText={'⭐ Hi there! My name is Bon Bon, I\'ll be here to support you through this journey! Let\'s C... how far we can get!! ⭐'}
        altText={'Bunny Image'}
      />
    </>
  );
};

export default CCharacter; // Exporting the CCharacter component for use in other parts of the application
