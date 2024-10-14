import Button from '../components/Button';
import DeleteUserComponent from '../components/DeleteUser';
import NavigationBarUser from '../components/NavigationBarUser';
import { useAuth } from '../context/AuthContext';
import './UserSettings.css';

const UserSettings = () => {
    const { currentuser, isAuthenticated, usersId, usersName, usersCourses } = useAuth();    // Extracting user info

    // Temporary variable for testing purposes
    const profilePicture = "https://i.pinimg.com/736x/1c/56/d1/1c56d1e6e3f002f4109a1f59e56cf292.jpg";

    
    const updateProfile = () => {
        
    }

    return (
        <div className='usersettings'>
            <NavigationBarUser />

            <div className='usersettings-container'>
                <div className='usersettings-header'>
                    <h1 className='fira-code'>Profile Settings</h1>
                    <h3 className='roboto-bold'>user email</h3>
                </div>
                
                <div className='usersettings-content roboto-regular'>
                    <div className='usersettings-picture'>
                        <img src={profilePicture} alt='Profile Picture' />
                        <p>Text for the button to upload the image</p>
                    </div>
                    

                    <p>Username: {usersName}</p>
                </div>
                

                {/* Buttons to manage profile settings */}
                {/* These will be updated with buttons component I've made on
                    a different branch when merged */}
                <div className='usersettings-buttons'>
                    <Button text={'CANCEL'} />
                    <Button text={'SAVE CHANGES'} />
                </div>                
            </div>
            
            <DeleteUserComponent />
        </div>
    );
}

export default UserSettings;