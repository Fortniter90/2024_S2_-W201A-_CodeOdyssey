import ProfilePicture from '../components/ProfilePicture';
import ProgressBox from '../components/ProgressBox';
import Achievements from '../components/Achievements';
import NavigationBarUser from '../components/NavigationBarUser';
import { useEffect } from 'react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const goToSettings = () => {
    navigate('/profile/settings');
  }

  if (currentUser === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavigationBarUser />
      <Button text={'SETTINGS'} action={goToSettings} />
      <ProfilePicture />
      <ProgressBox />
      <Achievements />
    </div>
  );
};

export default Profile;

