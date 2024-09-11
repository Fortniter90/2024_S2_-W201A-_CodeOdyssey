import "./ProfilePicture.css";
import profileIcon from "./assets/profilepic.png"

const ProfilePicture = () => {
    return (
        <div className="profile-container">
            <img src={profileIcon} alt="Profile icon" className="profile-icon" />
            <p className="username-text">Username</p>
            <button className="edit-profile">EDIT PROFILE</button>
        </div>
    );
};

export default ProfilePicture;