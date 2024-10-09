import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./ProfilePicture.css";
import profileIcon from "./assets/defaultprofilepic.png"; 

const ProfilePicture = () => {
    const { usersName, currentUser } = useAuth();
    const [profileImage, setProfileImage] = useState(profileIcon);
    const [imageFile, setImageFile] = useState(null);
    const db = getFirestore();
    const storage = getStorage();

    // Fetch user's current profile image from Firestore
    useEffect(() => {
        if (currentUser) {
            const userDocRef = doc(db, "users", currentUser.uid);
            const fetchData = async () => {
                try {
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();
                        if (userData.profileImage) {
                            setProfileImage(userData.profileImage); // Load the image from Firestore
                        }
                    }
                } catch (error) {
                    console.error("Error fetching profile data:", error);
                }
            };
            fetchData();
        }
    }, [currentUser, db]);

    // Handle file input change
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]); // Set the file from input
        }
    };

    // Upload image to Firebase Storage and update Firestore with the image URL
    const handleUpload = async () => {
        if (imageFile && currentUser) {
            const storageRef = ref(storage, `profilePictures/${currentUser.uid}`);
            try {
                // Upload the image to Firebase Storage
                await uploadBytes(storageRef, imageFile);
                // Get the download URL from Firebase Storage
                const downloadURL = await getDownloadURL(storageRef);

                // Save the URL to Firestore under the user's document
                const userDocRef = doc(db, "users", currentUser.uid);
                await updateDoc(userDocRef, {
                    profileImage: downloadURL
                });

                // Update the profile picture in the UI
                setProfileImage(downloadURL);
                alert("Profile picture updated successfully!");
            } catch (error) {
                console.error("Error uploading image: ", error);
            }
        }
    };

    return (
        <div className="profile-container">
            <img src={profileImage} alt="Profile icon" className="profile-icon" />
            <p className="username-text">{usersName || 'User'}</p>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Change Profile Picture</button>
        </div>
    );
};

export default ProfilePicture;
