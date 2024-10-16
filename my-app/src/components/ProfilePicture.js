import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./ProfilePicture.css";
import profileIcon from "./assets/defaultprofilepic.png";

const ProfilePicture = () => {
  const { currentUser } = useAuth();
  const [profileImage, setProfileImage] = useState(null);

  // Fetch user's current profile image from Firestore
  useEffect(() => {
    setProfileImage(currentUser.picture);
  }, [currentUser]);

  return (
    <div className="profile-container">
      <img src={profileImage} alt="Profile icon" className="profile-icon" />
      <p className="username-text">{currentUser.name || 'User'}</p>
    </div>
  );
};

export default ProfilePicture;
