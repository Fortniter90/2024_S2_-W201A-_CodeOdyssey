import './App.css';
import HeaderOptions from './components/HeaderOptions';
import ProfilePicture from './components/ProfilePicture';
import ProgressBox from './components/ProgressBox';
import Achievements from './components/Achievements';


function App() {
  return (
    <div>
      <HeaderOptions />
      <ProfilePicture />
      <ProgressBox />
      <Achievements />
    </div>
  );
}

export default App;
