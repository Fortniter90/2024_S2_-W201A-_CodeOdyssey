import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

// Component signs out a user
const SignOutComponent = () => {
  const { setCurrentUser, setIsAuthenticated } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);  // Uses firebase to sign user out
      setCurrentUser(null); // Sets current user to null
      setIsAuthenticated(false); // Sets user to unauthenticated 
      alert("Successfully signed out!"); // Alerts user that signout was successful
    } catch (error) {
      alert(error.message); // Shows an error message should an error occur
    }
  };

  return (
    <button onClick={handleSignOut}>Sign Out</button>
  );
};

export default SignOutComponent;

