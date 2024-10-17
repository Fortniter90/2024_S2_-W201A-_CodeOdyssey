import { useEffect, useRef, useState } from 'react';
import { updateUsername, updateUserProfilePicture } from '../utils/dataSaving';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Cropper from 'cropperjs';
import DeleteUserComponent from '../components/DeleteUser';
import Button from '../components/Button';
import 'cropperjs/dist/cropper.css';
import './UserSettings.css';
import NavigationBar from '../components/NavigationBar';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6';

const UserSettings = () => {
  const { currentUser } = useAuth();
  const [newUsername, setNewUsername] = useState(currentUser.name);

  // States to store images
  const [imageFile, setImageFile] = useState(null);         // Image file
  const [croppedImage, setCroppedImage] = useState(null);  // Cropped image

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
      const canvas = cropper.getCroppedCanvas({
        width: 200,
        height: 200,
      });

      if (canvas) {
        canvas.toBlob((blob) => {
          if (blob) {
            // Store the actual blob instead of the URL
            setCroppedImage(blob);  // Set the cropped image blob instead of the URL

            setIsCropping(false);
            setImageFile(null);

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

    // Check if the username has changed and update it
    if (newUsername !== currentUser.name && newUsername) {
      await updateUsername(currentUser.uid, newUsername);
    }

    if (cropper) {
      const canvas = cropper.getCroppedCanvas({
        width: 200,
        height: 200,
      });

      if (canvas) {
        // Instead of getting the image URL, we use the blob
        canvas.toBlob(async (blob) => {
          if (blob) {
            // Update the user profile picture using the actual image blob
            await updateUserProfilePicture(currentUser.uid, blob);
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

    // Success message and navigation
    alert('Profile updated successfully!');
    navigate('/profile');
  };

  const toggleAdvancedSettings = () => {
    setAdvancedSettings(!advancedSettings);
  };

  const exitSettings = () => {
    navigate('/profile');
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
