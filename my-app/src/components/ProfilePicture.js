import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./ProfilePicture.css";

const ProfilePicture = () => {
  const { currentUser } = useAuth();
  const [profileImage, setProfileImage] = useState(null);

  // Fetch user's current profile image from Firestore
  useEffect(() => {
    setProfileImage(currentUser.photoURL);
  }, [currentUser]);

  return (
    <div className="profile-container">
      <img src={profileImage} alt="Profile icon" className="profile-icon" />
      <p className="username-text">{currentUser.displayName || 'User'}</p>
    </div>
  );
};

export default ProfilePicture;
