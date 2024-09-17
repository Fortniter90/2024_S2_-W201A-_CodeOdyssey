import React from 'react';
import { useAuth } from '../context/AuthContext';

const LoginStatus = () => {
  const { isAuthenticated, usersName } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <p>Logged in as: {usersName}</p>
      ) : (
        <p>Not logged in</p>
      )}
    </div>
  );
};

export default LoginStatus;
