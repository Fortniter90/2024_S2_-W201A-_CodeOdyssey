import ProfilePicture from '../components/ProfilePicture';
import ProgressBox from '../components/ProgressBox';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import { useAuth } from '../context/AuthContext';
import SignOutComponent from '../components/SignOut';
import './Profile.css';
import Footer from '../components/Footer';
import Feedback from '../components/Feedback';

const Profile = () => {

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const goToSettings = () => {
    navigate('settings');
  }

  const goToPastTests = () => {
    navigate('pasttests')
  }

  if (currentUser === null) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavigationBar />

      <div className='profile'>
        <div className='profile-left'>
          <ProfilePicture />
          <h1 className='fira-code'>{currentUser.name}</h1>

          <Button text={'USER SETTINGS'} action={goToSettings} backgroundColor={'var(--background-medium)'} />
          <SignOutComponent />
        </div>

        <div className='profile-right'>
          <Button text={"PAST TESTS"} action={goToPastTests}
            color={'var(--green-medium)'}
            backgroundColor={'var(--background-medium)'}
            hoverColor={'var(--green-dark)'}
          />
          <ProgressBox />
        </div>
      </div>
        
      <Feedback />
      <Footer />
    </>
  );
};

export default Profile;

