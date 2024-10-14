import { useEffect, useRef, useState } from 'react';
import Button from '../components/Button';
import DeleteUserComponent from '../components/DeleteUser';
import NavigationBarUser from '../components/NavigationBarUser';
import { useAuth } from '../context/AuthContext';
import './UserSettings.css';
import { updateUserData } from '../utils/dataSaving';
import { useNavigate } from 'react-router-dom';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

const UserSettings = () => {
    const { currentUser, isAuthenticated, usersId, usersName, usersCourses, usersProfilePicture, setUsersName, setUsersProfilePicture } = useAuth();

    const navigate = useNavigate();

    const [imageFile, setImageFile] = useState(null);
    const [croppedImage, setCroppedImage] = useState(usersProfilePicture); // State to store the cropped image
    const [cropper, setCropper] = useState(null);
    const [isCropping, setIsCropping] = useState(false); // State to control cropping mode
    const fileInputRef = useRef(null);
    const imagePreviewRef = useRef(null); // Ref for the image preview

    // Effect to update state when usersProfilePicture changes
    useEffect(() => {
        setCroppedImage(usersProfilePicture);
    }, [usersProfilePicture]);

    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            setImageFile(file);
            const imgUrl = URL.createObjectURL(file);
            
            // Initialize cropper
            if (cropper) {
                cropper.destroy(); // Destroy existing cropper if present
            }
    
            const imageElement = imagePreviewRef.current;
            if (imageElement) { // Check if the ref is valid
                imageElement.src = imgUrl; // Set the uploaded image as the source
                
                imageElement.onload = () => {
                    const newCropper = new Cropper(imageElement, {
                        aspectRatio: 1, // Square crop
                        viewMode: 1,
                        responsive: true,
                        autoCropArea: 1,
                        ready() {
                            setIsCropping(true); // Show cropping interface
                        },
                    });
                    setCropper(newCropper);
                };
            } else {
                console.error("Image element is not available");
            }
        } else {
            console.error("No file selected");
        }
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
            setIsCropping(true);
        }
    };

    const saveCroppedImage = () => {
        if (cropper) {
            // Get the cropped image data
            const canvas = cropper.getCroppedCanvas({
                width: 200,
                height: 200,
            });
    
            // Log the canvas to check if it's valid
            console.log('Cropped canvas:', canvas);
    
            if (canvas) {
                // Convert the canvas to a blob
                canvas.toBlob((blob) => {
                    if (blob) {
                        const newProfilePicture = URL.createObjectURL(blob); // New cropped image URL
    
                        // Update the context state to reflect changes immediately
                        setUsersProfilePicture(newProfilePicture); // Set the new profile picture
                    } else {
                        console.error("Blob creation failed");
                    }
                }, 'image/jpeg');
            } else {
                console.error("Cropped canvas is null");
            }
        } else {
            console.error("Cropper is not initialized");
        }
    
        // Clean up and reset state after saving
        if (cropper) {
            cropper.destroy();
        }
        
        setIsCropping(false);
        setImageFile(null); // Clear the file input
    }
    

    const updateProfile = async () => {
        if (cropper) {
            const canvas = cropper.getCroppedCanvas({
                width: 200,
                height: 200,
            });
    
            // Ensure the canvas is not null before proceeding
            if (canvas) {
                // Create a URL from the cropped canvas
                const croppedImageUrl = canvas.toDataURL('image/jpeg'); // Get image URL directly
                
                const userData = {
                    name: usersName,
                    currentProfilePicture: croppedImageUrl, // Use the cropped image URL directly
                };
    
                // Call your data saving function
                await updateUserData(usersId, userData);
    
                // Update the context state to reflect changes immediately
                setUsersName(usersName);
                setUsersProfilePicture(croppedImageUrl); // Set the new profile picture directly
                
                // Reset cropping state
                setIsCropping(false);
                setImageFile(null); // Clear the file input
    
                // Show success alert and navigate
                alert('Profile updated successfully!');
                navigate('/profile');
            } else {
                console.error("Cropped canvas is null");
            }
        } else {
            console.error("Cropper is not initialized");
        }
    };    

    const exitSettings = () => {
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

                            {/* Always show the current profile picture */}
                            {isCropping ? (
                                <img 
                                    ref={imagePreviewRef}
                                    src={croppedImage}
                                    alt='Profile Picture'
                                    className='cropped-image'
                                />
                            ) : (
                                <img 
                                    src={usersProfilePicture}
                                    alt='Profile Picture'
                                    className='cropped-image'
                                />
                            )}
                            
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />

                            <div className='picture-upload'>
                                <Button 
                                    text={isCropping ? 'SAVE IMAGE' : 'UPLOAD YOUR AVATAR'} 
                                    action={isCropping ? saveCroppedImage : triggerFileInput} 
                                />
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
                    
                    <div className='usersettings-buttons'>
                        <Button text={'CANCEL'} action={exitSettings} />
                        <Button text={'SAVE CHANGES'} action={updateProfile} />
                    </div>
                </div>
            </div>
            
            <DeleteUserComponent />
        </div>
    );
};

export default UserSettings;
