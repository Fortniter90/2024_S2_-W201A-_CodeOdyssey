import ProfilePicture from '../components/ProfilePicture';
import ProgressBox from '../components/ProgressBox';
import Achievements from '../components/Achievements';
import NavigationBarUser from '../components/NavigationBarUser';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const goToSettings = () => {
    navigate('/profile/settings');
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