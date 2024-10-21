import ProgrammingCharacter from './ProgrammingCharacter';
import CapybaraNeutral from './assets/CapybaraS2-Neutral.png'; // Importing the neutral capybara image
import CapybaraHappy from './assets/CapybaraS2-Happy.png'; // Importing the happy capybara image
import JavabaraVoice from './assets/JavabaraVoice.mp3'; // Importing the audio file

// Defining the JavaCharacter component
const JavaCharacter = () => {
  return (
    <>
      <ProgrammingCharacter 
        neutralImage={CapybaraNeutral}
        alternativeImage={CapybaraHappy}
        characterVoice={JavabaraVoice}
        speechText={'<b>Hello!</b> Welcome to the Java programming course, I\'m the Javabara! Here to assist you 😊'}
        altText={'Capybara Image'}
      />
    </>
  );
};

export default JavaCharacter; // Exporting the JavaCharacter component for use in other parts of the application
