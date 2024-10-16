import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [usersCourses, setUsersCourses] = useState([]);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('idToken'); // or from another place where you store tokens
    if (!token) {
      setIsAuthenticated(false);
      console.log("no token");
      return;
    }

    try {
      console.log("this is it");
      const response = await axios.get('http://localhost:8080/auth/status', {
        headers: {
          Authorization: `Bearer ${token}`, // Use backticks for template literals
          'Content-Type': 'application/json', // Set Content-Type correctly
        },
      });

      const result = response.data;

      if (result.isAuthenticated) {
        setIsAuthenticated(true);
        setCurrentUser(result.user);
        await loadUserData(result.user.uid);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setUsersCourses({});
      }
    } catch (error) {
      console.error('Error checking auth status', error);
      setIsAuthenticated(false);
      setCurrentUser(null);
      setUsersCourses({});
    }
  };

  const loadUserData = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/auth/userdata/${userId}`); // Fetch user data from your backend
      const userData = response.data;

      if (userData.courses) {
        console.log("work", userData.courses);
        setUsersCourses(userData.courses);
      } else {
        throw new Error('Courses not found in user data');
      }
    } catch (error) {
      console.error('Error loading user data', error);
      setUsersCourses({});
    }
  };


  return (
    <AuthContext.Provider value={{ usersCourses, isAuthenticated, currentUser, checkAuthStatus }}>
      {children}
    </AuthContext.Provider >
  );
};
