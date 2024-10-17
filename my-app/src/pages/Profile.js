import ProfilePicture from '../components/ProfilePicture';
import ProgressBox from '../components/ProgressBox';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';

const Profile = () => {
  const navigate = useNavigate();

  const goToSettings = () => {
    navigate('/profile/settings');
  }

  return (
    <div>
      <NavigationBar />


      <Button text={'SETTINGS'} action={goToSettings} />


      <ProfilePicture />
      <ProgressBox />
    </div>
  );
};

export default Profile;