import React from 'react';
import { useAuth } from '../context/AuthContext'; // Use AuthContext to access checkAuthStatus
import axios from 'axios';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

const SignOutComponent = () => {
  const { currentUser, checkAuthStatus } = useAuth(); // Access checkAuthStatus from AuthContext
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const user = currentUser;
      const response = await axios.post('http://localhost:8080/auth/signout', {
        user,
      }, {
        headers: {
          'Content-Type': 'application/json' // Ensure the correct content type is set
        }
      });

      console.log('Signout successful:', response.data);
      localStorage.removeItem('idToken');
      checkAuthStatus();
      navigate('/');

    } catch (error) {
      console.error('Error during signout:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <Button 
      text={'SIGN OUT'} 
      outline={true} 
      action={handleSignOut} 
      color={'var(--gray-medium)'} 
      backgroundColor={'var(--background-medium)'} 
    />
  );
};

export default SignOutComponent;