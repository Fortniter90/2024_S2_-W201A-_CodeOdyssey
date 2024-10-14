import { useEffect, useRef, useState } from 'react';
import { updateUserData } from '../utils/dataSaving';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Cropper from 'cropperjs';
import NavigationBarUser from '../components/NavigationBarUser';
import DeleteUserComponent from '../components/DeleteUser';
import Button from '../components/Button';
import 'cropperjs/dist/cropper.css';
import './UserSettings.css';

const UserSettings = () => {
    const { currentUser, isAuthenticated, usersId, usersName, usersCourses, usersProfilePicture, setUsersName, setUsersProfilePicture } = useAuth();

    // States to store images
    const [imageFile, setImageFile] = useState(null);                       // Image file
    const [croppedImage, setCroppedImage] = useState(usersProfilePicture);  // Cropped image

    // States to control cropping
    const [cropper, setCropper] = useState(null);           // Cropper instance
    const [isCropping, setIsCropping] = useState(false);    // Cropping mode active status

    // States for file and image references
    const fileInputRef = useRef(null);
    const imagePreviewRef = useRef(null);

    const navigate = useNavigate(); // Router hook for navigation



    // Effect to update state when the profile picture changes
    useEffect(() => {
        setCroppedImage(usersProfilePicture);
    }, [usersProfilePicture]);

    // Trigger the file input dialog when the upload button is clicked
    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
            setIsCropping(true);
        }
    };

    // Handle file input changes when the user selects a file
    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return; // If no file is selected, do nothing

        // Reset the file input to prevent future triggers
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear the file input value
        }

        setImageFile(file);
        const imgUrl = URL.createObjectURL(file);
        
        // If there's an existing cropper instance, destroy it
        if (cropper) {
            cropper.destroy();
        }

        // Get the image element and set up the cropper
        const imageElement = imagePreviewRef.current;
        if (imageElement) { // Check if the ref is valid
            imageElement.src = imgUrl; // Set the uploaded image as the source
            
            imageElement.onload = () => {
                // Initialize Cropper.js with options
                const newCropper = new Cropper(imageElement, {
                    aspectRatio: 1, // Square crop
                    viewMode: 1,
                    responsive: true,
                    autoCropArea: 1,
                    ready() {
                        setIsCropping(true); // Enter cropping mode
                    },
                });
                setCropper(newCropper); // Save the cropper instance
            };
        } else {
            console.error("Image element is not available");
        }
    };

    // Save the cropped image and exit cropping mode
    const saveCroppedImage = () => {
        if (cropper) {
            // Get the cropped canvas dimensions
            const canvas = cropper.getCroppedCanvas({
                width: 200,
                height: 200,
            });
    
            if (canvas) {
                // Convert the canvas to a blob
                canvas.toBlob((blob) => {
                    if (blob) {
                        const newProfilePicture = URL.createObjectURL(blob); // New cropped image URL
    
                        // Update the context state to reflect changes immediately
                        setCroppedImage(newProfilePicture); 

                        setIsCropping(false); // Explicitly exit cropping mode
                        setImageFile(null); // Clear the selected file



                        // Reset the file input to avoid re-triggering
                        if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                        }

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
                                <div>
                                    <img 
                                        src={croppedImage}
                                        alt='Profile Picture'
                                        className='cropped-image'
                                    />
                                </div>
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
