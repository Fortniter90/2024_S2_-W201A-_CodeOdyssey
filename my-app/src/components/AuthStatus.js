import React from 'react';
import { useAuth } from '../context/AuthContext';

const LoginStatus = () => {
  const { isAuthenticated, currentUser } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>Logged in as: {currentUser.email}</p>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
};

export default LoginStatus;
