import { useAuth } from "../context/AuthContext";
import "./ProfilePicture.css";

// Function to handle the visuals of  the profile picture
const ProfilePicture = () => {

  const { currentUser } = useAuth();

  return (
    <div className="profile-picture">
      <img src={currentUser.picture} alt="Profile Picture" />
    </div>
  );
};

export default ProfilePicture;
