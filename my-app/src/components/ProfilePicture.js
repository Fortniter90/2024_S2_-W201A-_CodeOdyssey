import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./ProfilePicture.css";

const ProfilePicture = () => {
  const { currentUser } = useAuth();
  const [profilePicture, setProfilePicture] = useState(null);

  // Fetch user's current profile image from Firestore
  useEffect(() => {
    setProfilePicture(currentUser.picture);
  }, [currentUser]);

  return (
    <div className="profile-picture">
      <img src={profilePicture} alt="Profile Picture" />
    </div>
  );
};

export default ProfilePicture;
