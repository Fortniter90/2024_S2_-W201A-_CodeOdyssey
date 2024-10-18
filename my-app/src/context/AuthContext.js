import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { auth } from '../config/firebase';
import { setAdminStatus } from '../utils/dataSaving';

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // New state to track fetch status

  const refreshUserData = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setCurrentUser(auth.currentUser);
    }
  };

  const refreshToken = async () => {
    console.log("reeeee");
    const user = auth.currentUser;
    if (!user) return false;

    try {
      await user.getIdToken(true);  // Force refresh the token
      await refreshUserData();  // Reload user data after token refresh
      return true;
    } catch (error) {
      console.error('Error refreshing token', error);
      return false;
    }
  };

  const checkAuthStatus = async () => {
    const token = localStorage.getItem('idToken');
    if (!token) {
      setIsAuthenticated(false);
      console.log("No token found");
      return;
    }

    try {
      const response = await axios.get('http://localhost:8080/auth/status', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
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
        setUsersCourses([]);
      }
    } catch (error) {
      console.error('Error checking auth status', error);
      setIsAuthenticated(false);
      setCurrentUser(null);
      setUsersCourses([]);
    }
  };

  // UseCallback for loadUserData to prevent re-creation on every render
  const loadUserData = useCallback(async (userId) => {
    // Prevent duplicate requests with isFetching
    if (isFetching) {
      console.log("Already fetching, skipping...");
      return;
    }

    setIsFetching(true); // Set fetching to true

    try {
      console.log("Fetching user data for userId:", userId); // Log to check

      const response = await axios.get(`http://localhost:8080/auth/userdata/${userId}`);
      const userData = response.data;

      // Only update if the courses have changed
      if (userData.courses && JSON.stringify(userData.courses) !== JSON.stringify(usersCourses)) {
        setUsersCourses(userData.courses);
        console.log("Courses updated");
      } else {
        console.log("Courses unchanged, skipping update");
      }

      if (userData.isAdmin === true) {
        setIsAdmin(true);
      } else if (userData.isAdmin === false || userData.isAdmin === null) {
        setIsAdmin(false);
      } else {
        setAdminStatus(false);
      }
    } catch (error) {
      console.error('Error loading user data', error);
      setUsersCourses([]);
    } finally {
      setIsFetching(false); // Ensure to reset isFetching after the request completes
    }
  }, [usersCourses, isFetching]); // Add isFetching as a dependency

  // useEffect that runs once on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []); // Empty dependency array ensures it runs only once

  return (
    <AuthContext.Provider value={{ isAdmin, usersCourses, isAuthenticated, currentUser, checkAuthStatus, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

