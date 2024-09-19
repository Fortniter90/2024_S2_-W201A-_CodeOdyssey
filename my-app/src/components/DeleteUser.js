import React from 'react';
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { deleteUser } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Component that deletes a user's account
const DeleteUserComponent = () => {
  // Accesses current user, sets current user, and handles authentication state
  const { currentUser, setCurrentUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate(); // Initializes navigate function for redirection

  // Function that handles account deletion
  const DeleteUserHandler = async () => {
    const docRef = doc(db, 'users', currentUser.uid); // Reference to Firestore document

    // Checks if user is authenticated
    if (currentUser) {
      try {
        // Deletes the user from Firebase Auth
        await deleteUser(currentUser);
        // Deletes the user's document from Firestore
        await deleteDoc(docRef);
        setCurrentUser(null); // Sets current user to null
        setIsAuthenticated(false); // Sets user to unauthenticated
        alert('User and user data deleted successfully.'); // Alerts user of account deletion
        navigate('/'); // Redirect to home after account deletion
      } catch (error) {
        if (error.code === 'auth/requires-recent-login') {
          navigate('/login'); // Redirect to login page if re-authentication is needed
          alert('Please reauthenticate before deleting your account.');
        } else {
          alert('Failed to delete user or user data.');
        }
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

