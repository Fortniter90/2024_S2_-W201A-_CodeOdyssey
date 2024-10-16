import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Component that deletes a user's account
const DeleteUserComponent = () => {
  const { currentUser, checkAuthStatus } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const goToHomePage = () => {
    navigate('/');
  };

  // Function that handles account deletion
  const deleteUserHandler = async () => {
    if (currentUser) {
      // Confirm user wants to delete their account
      const confirmDelete = window.confirm("Are you sure you want to delete your account?");
      if (!confirmDelete) return;

      setLoading(true);
      setError(null); // Reset error state

      try {
        const token = localStorage.getItem('idToken');
        console.log(currentUser.uid);
        const response = await axios.delete('http://localhost:8080/auth/deleteuser', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: { uid: currentUser.uid },
        });

        console.log('User deletion successful:', response.data);
        localStorage.removeItem('idToken'); // Clear local token if necessary
        checkAuthStatus(); // Update auth status
        goToHomePage(); // Redirect to the home page
      } catch (error) {
        console.error('Error during user deletion:', error.response ? error.response.data : error.message);
        setError('An error occurred while deleting your account. Please try again.'); // Set error message for UI
      } finally {
        setLoading(false); // Reset loading state
      }
    } else {
      console.error('No user is currently logged in.');
      setError('You are not logged in.'); // Set error message for UI
    }
  };

  return (
    <div>
      <button className="button-20" onClick={deleteUserHandler} disabled={!currentUser || loading}>
        {loading ? 'Deleting...' : 'Delete My Account'}
      </button>
      {error && <p className="error-message">{error}</p>} {/* Display error message if any */}
    </div>
  );
};

export default DeleteUserComponent;

