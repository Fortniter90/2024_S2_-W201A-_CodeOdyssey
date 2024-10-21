import { useEffect, useRef, useState } from 'react';
import { updateUsername, updateUserProfilePicture } from '../utils/dataSaving';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';
import NavigationBar from '../components/NavigationBar';
import DeleteUserComponent from '../components/DeleteUser';
import Button from '../components/Button';
import ProfilePicture from '../components/ProfilePicture';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import './UserSettings.css';

const UserSettings = () => {
  const { currentUser, refreshToken } = useAuth();
  const [newUsername, setNewUsername] = useState(currentUser.name);

  // States to store images
  const [croppedImage, setCroppedImage] = useState(null);  // Cropped image
  const [croppedImageBlob, setCroppedImageBlob] = useState(null); // Blob for the cropped image

  // States to control cropping
  const [cropper, setCropper] = useState(null);           // Cropper instance
  const [isCropping, setIsCropping] = useState(false);    // Cropping mode active status

  // State controlling advanced settings toggle
  const [advancedSettings, setAdvancedSettings] = useState(false);

  // States for file and image references
  const fileInputRef = useRef(null);
  const imagePreviewRef = useRef(null);

  const navigate = useNavigate(); // Router hook for navigation

  // Effect to update state when the profile picture changes
  useEffect(() => {
    setCroppedImage(currentUser.picture);
  }, [currentUser.picture]);

  // Trigger the file input dialog when the upload button is clicked
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      setIsCropping(true);
      fileInputRef.current.click();
    }
  };

  // Handle file input changes when the user selects a file
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    
    // Check if the user canceled the file selection
    if (!file) {
      setIsCropping(false); // Set cropping mode to false if no file is selected
      return; // Exit the function if no file was selected
    }

    // Reset the file input to prevent future triggers
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Clear the file input value
    }

    const imgUrl = URL.createObjectURL(file);

    // If there's an existing cropper instance, destroy it
    if (cropper) {
      cropper.destroy();
    }

    initializeCropper(imgUrl);
  };

  // Function to reinitialize the cropper when needed
  const initializeCropper = (imgUrl) => {
    const imageElement = imagePreviewRef.current;
    if (imageElement) {
        imageElement.src = imgUrl; // Set the uploaded image as the source
        const newCropper = new Cropper(imageElement, {
            aspectRatio: 1,
            viewMode: 1,
            responsive: true,
            autoCropArea: 1,
            ready() {
                setIsCropping(true);
            },
        });
        setCropper(newCropper); // Save the new cropper instance
    }
  };

  // Save the cropped image and exit cropping mode
  const saveCroppedImage = () => {
    if (cropper) {
      const canvas = cropper.getCroppedCanvas({
        width: 200,
        height: 200,
      });

      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedImageUrl = URL.createObjectURL(blob);
            setCroppedImage(croppedImageUrl); // Set the cropped image for preview
            setCroppedImageBlob(blob); // Save the blob for later use
            setIsCropping(false); // Exit cropping mode
            cropper.destroy(); // Destroy the cropper instance

            if (fileInputRef.current) {
              fileInputRef.current.value = ''; // Clear the file input
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
  };

  // Function to exit cropping mode
  const exitCropping = () => {
    if (cropper) {
      cropper.destroy(); // Destroy the cropper to remove its elements
      setCropper(null); // Clear the cropper instance
    }
    setIsCropping(false); // Exit cropping mode
  };

  const updateProfile = async () => {
    let update = false;

    // Update the profile picture if a new image blob exists
    if (croppedImageBlob) {
      await updateUserProfilePicture(currentUser.uid, croppedImageBlob);
      update = true; // Mark as updated
      setCroppedImageBlob(null); // Clear the blob after updating
    }

    // Check if the username has changed and update it
    if (newUsername !== currentUser.name && newUsername) {
      await updateUsername(currentUser.uid, newUsername);
      update = true;
    }

    if (update) {
      await refreshToken();
      alert('Profile updated successfully!');
      navigate('/profile');
    } else {
      alert('Error updating profile');
    }
  };
  
  const toggleAdvancedSettings = () => {
    setAdvancedSettings(!advancedSettings);
  };

  const exitSettings = () => {
    navigate('/profile');
  }

  if (currentUser === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavigationBar />

      <div className='usersettings'>
        <div className='usersettings-header'>
          <h1 className='fira-code'>Profile Settings</h1>
          <h3 className='roboto-bold'>{currentUser.email}</h3>
        </div>

        <div className='usersettings-container'>
          <div className='usersettings-content roboto-regular'>

            <div className='usersettings-picture'>
              {/* Always show the current profile picture */}
              {isCropping ? (
                <>
                  <img
                    ref={imagePreviewRef}
                    src={croppedImage}
                    alt='Image Cropper'
                    className='image-cropper'
                  />
                </>
              ) : (
                <ProfilePicture picture={croppedImage} />
              )}
              
              

              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {/* Buttons for uploading and saving the image */}
              {isCropping ? (
                <div className='usersettings-saveimage'>
                  <Button text={'SAVE IMAGE'} action={saveCroppedImage} />
                  <Button text={'CANCEL'} outline={true} action={exitCropping} color={'var(--gray-medium)'} backgroundColor={'var(--white)'} />
                </div>
              ) : (
                <div className='usersettings-uploadimage'>
                  <Button text={'UPLOAD IMAGE'} action={triggerFileInput} />
                  <p>Images should be a square.</p>
                </div>
              )}
            </div>

            <div className='usersettings-username roboto-medium'>
              <label htmlFor='username'>Username</label>
              <input
                type='text'
                id='username'
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </div>
          </div>

          <div className='usersettings-bottom'>
            <div className='usersettings-buttons'>
              <Button text={'SAVE CHANGES'} action={updateProfile} color={'var(--green-medium'} hoverColor={'var(--green-dark)'} backgroundColor={'var(--background-medium)'} />
              <Button text={'CANCEL'} outline={true} action={exitSettings} color={'var(--gray-medium)'} backgroundColor={'var(--background-medium)'} />
            </div>

            <div className='usersettings-advancedtoggle' onClick={toggleAdvancedSettings}>
              <span className='roboto-bold'>ADVANCED SETTINGS</span>
              <span className="dropdown-icon">
                {advancedSettings ? 
                  <FaChevronUp /> 
                  : <FaChevronDown />
                }
              </span>
            </div>
          </div>
          
          <div className='usersettings-advanced'>
            {advancedSettings && <DeleteUserComponent className='usersettings-delete' />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;