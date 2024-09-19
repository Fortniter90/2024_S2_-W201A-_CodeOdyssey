import React from 'react';
import { useAuth } from '../context/AuthContext';

// Displays login status
const LoginStatus = () => {
  // Uses useAuth hook to access auth status and users name
  const { isAuthenticated, usersName } = useAuth();

  return (
    <div>
      {/* Checks if user is authenticated*/}
      {isAuthenticated ? (
        <p>Logged in as: {usersName}</p> // Displays users name
      ) : (
        //If not authenticated display message
        <p>Not logged in</p>
      )}
    </div>
  );
};

export default LoginStatus;
