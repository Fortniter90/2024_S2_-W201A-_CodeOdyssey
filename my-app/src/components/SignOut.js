import React from 'react';
import { useAuth } from '../context/AuthContext'; // Use AuthContext to access checkAuthStatus
import axios from 'axios';

const SignOutComponent = () => {
  const { currentUser, checkAuthStatus } = useAuth(); // Access checkAuthStatus from AuthContext

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
    } catch (error) {
      console.error('Error during signout:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <button onClick={handleSignOut}>Sign Out</button>
  );
};

export default SignOutComponent;

