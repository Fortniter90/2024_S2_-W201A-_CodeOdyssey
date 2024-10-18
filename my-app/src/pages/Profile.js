import ProfilePicture from '../components/ProfilePicture';
import ProgressBox from '../components/ProgressBox';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import { useAuth } from '../context/AuthContext';
import SignOutComponent from '../components/SignOut';
import './Profile.css';

const Profile = () => {

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const goToSettings = () => {
    navigate('/profile/settings');
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

          <Button text={'SETTINGS'} action={goToSettings} />
          <SignOutComponent />
        </div>

        <div className='profile-right'>
          <ProgressBox />
        </div>
        
        
      </div>
    </>
  );
};

export default Profile;

