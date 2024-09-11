import React from 'react';
import { useAuth } from '../context/AuthContext';

const LoginStatus = () => {
  const { isAuthenticated, currentUser } = useAuth(); // Accessing context values

  return (
    <div>
      {isAuthenticated ? (
        <p>Logged in as: {currentUser.email}</p>  // Displaying user's email if logged in
      ) : (
        <p>Not logged in</p>  // Message if not logged in
      )}
    </div>
  );
};

export default LoginStatus;
