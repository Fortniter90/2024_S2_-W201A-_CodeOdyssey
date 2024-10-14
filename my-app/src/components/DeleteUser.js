import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Component that deletes a user's account
const DeleteUserComponent = () => {
  // Accesses current user, sets current user, and handles authentication state
  const { currentUser, checkAuthStatus } = useAuth();
  const navigate = useNavigate(); // Initializes navigate function for redirection

  const goToHomePage = () => {
    navigate('/');
  }
  // Function that handles account deletion
  const DeleteUserHandler = async () => {

    // Checks if user is authenticated
    if (currentUser) {
      try {
        const user = currentUser;
        const response = await axios.post('http://localhost:8080/auth/deleteuser', {
          user,
        });
        console.log('User deletion successful:', response.data);
        checkAuthStatus();
        goToHomePage();
      } catch (error) {
        console.error('Error during user deletion:', error.response ? error.response.data : error.message);
      }
    }
  };

  return (
    <button class="button-20" onClick={DeleteUserHandler} disabled={!currentUser}>
      Delete My Account
    </button>
  );
};

export default DeleteUserComponent;

