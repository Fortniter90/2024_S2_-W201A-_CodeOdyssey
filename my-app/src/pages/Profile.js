import ProfilePicture from '../components/ProfilePicture';
import ProgressBox from '../components/ProgressBox';
import Achievements from '../components/Achievements';
import NavigationBarUser from '../components/NavigationBarUser';

function Profile() {
  return (
    <div>
        <NavigationBarUser />
        <ProfilePicture />
        <ProgressBox />
        <Achievements />
    </div>
  );
};

export default Profile;