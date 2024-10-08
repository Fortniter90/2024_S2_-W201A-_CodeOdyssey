import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import "./ProfilePicture.css";
import profileIcon from "./assets/defaultprofilepic.png"; 

const ProfilePicture = () => {
    const { usersName, currentUser } = useAuth();
    const [profileImage, setProfileImage] = useState(profileIcon);
    const db = getFirestore();

    useEffect(() => {
        if (currentUser) {
            const userDocRef = doc(db, "users", currentUser.uid);
            const fetchData = async () => {
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    if (userData.courses && userData.courses.profileImage) {
                        setProfileImage(userData.courses.profileImage); 
                    }
                }
            };
            fetchData();
        }
    }, [currentUser, db]);

    return (
        <div className="profile-container">
            <img src={profileImage} alt="Profile icon" className="profile-icon" />
            <p className="username-text">{usersName || 'User'}</p>
            <button className="edit-profile" onClick={() => alert('Edit Profile feature is disabled')}>EDIT PROFILE</button>
        </div>
    );
};

export default ProfilePicture;
