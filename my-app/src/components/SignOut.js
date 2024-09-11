import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './FirebaseConfig';
import { useAuth } from '../context/AuthContext';

const SignOutComponent = () => {
  const { setCurrentUser, setIsAuthenticated } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setIsAuthenticated(false);
      alert("Successfully signed out!");
    } catch (error) {
      alert("Error signing out. Please try again.");
    }
  };

  return (
    <button onClick={handleSignOut}>Sign Out</button>
  );
};

export default SignOutComponent;

