import { useRef, useState } from 'react';
import Button from '../components/Button';
import DeleteUserComponent from '../components/DeleteUser';
import NavigationBarUser from '../components/NavigationBarUser';
import { useAuth } from '../context/AuthContext';
import './UserSettings.css';
import { updateUserData } from '../utils/dataSaving';
import { useNavigate } from 'react-router-dom';

const UserSettings = () => {
    const { currentUser, isAuthenticated, usersId, usersName, usersCourses, usersProfilePicture, setUsersName, setUsersProfilePicture } = useAuth();    // Extracting user info

    const navigate = useNavigate();

    const [imageFile, setImageFile] = useState(null);
    const [profilePicture, setProfilePicture] = useState(usersProfilePicture)
    const fileInputRef = useRef(null);


    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setImageFile(file);
            setProfilePicture(URL.createObjectURL(file));
        } else {
            console.error("No file selected");
        }
    }

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const updateProfile = () => {
        const userData = {
            username: usersName,
            imageFile: imageFile,
            currentProfilePicture: profilePicture,
        };
        
        updateUserData(usersId, userData);
        setUsersName(usersName);
        setUsersProfilePicture(profilePicture);

        // Show success alert and navigate
        alert('Profile updated successfully!');
        navigate('/profile');
    }

    return (
        <div>
            <NavigationBarUser />

            <div className='usersettings'>
                <div className='usersettings-header'>
                    <h1 className='fira-code'>Profile Settings</h1>
                    <h3 className='roboto-bold'>user email</h3>
                </div>
                    
                <div className='usersettings-container'>
                    <div className='usersettings-content roboto-regular'>
                        <div className='usersettings-picture'>
                            <img src={profilePicture} alt='Profile Picture' />
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />

                            <div className='picture-upload'>
                                <Button text={'UPLOAD YOUR AVATAR'} action={triggerFileInput} />
                                <p>Images should be a square.</p>
                            </div>
                        </div>
                        
                        <div className='usersettings-username roboto-medium'>
                            <label htmlFor='username'>Username</label>
                            <input
                                type='text'
                                id='username'
                                value={usersName}
                                onChange={(e) => setUsersName(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    {/* Buttons to manage profile settings */}
                    {/* These will be updated with buttons component I've made on
                        a different branch when merged */}
                    <div className='usersettings-buttons'>
                        <Button text={'CANCEL'} />
                        <Button text={'SAVE CHANGES'} action={updateProfile} />
                    </div>

                </div>
                    
            </div>

            
            
            <DeleteUserComponent />
        </div>
    );
}

export default UserSettings;