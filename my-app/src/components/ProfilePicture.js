import { useAuth } from "../context/AuthContext";
import "./ProfilePicture.css";

// Function to handle the visuals of  the profile picture
const ProfilePicture = ({ picture }) => {

  const { currentUser } = useAuth();

  if (!picture) picture = currentUser.picture;

  return (
    <div className="profile-picture">
      <img src={picture || currentUser.photoURL} alt="Profile Picture" />
    </div>
  );
};

export default ProfilePicture;
