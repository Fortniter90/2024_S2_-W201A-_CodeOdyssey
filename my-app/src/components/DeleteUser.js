import React from 'react';
import { deleteUser } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DeleteUserComponent = () => {
  const { currentUser, setCurrentUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const DeleteUserHandler = async (e) => {
    if (currentUser) {
      e.preventDefault();
      try {
        await deleteUser(currentUser);
        setCurrentUser(null);
        setIsAuthenticated(false);
        alert('User deleted successfully.');
      } catch (error) {
        navigate('/login');
        alert(`Please ReAuthenticate`);
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

