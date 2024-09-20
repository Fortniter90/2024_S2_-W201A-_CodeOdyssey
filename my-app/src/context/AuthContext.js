import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from '../config/firebase';
import { db } from '../config/firebase';
import { doc, getDoc } from "firebase/firestore";

// Creates a context for authentication which allows other components to share authentication information
const AuthContext = createContext();

// Creates a hook which allows components to access authContext
export function useAuth() {
  return useContext(AuthContext);
}

// Context provider that manages the authentication state
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usersId, setUsersId] = useState(null);
  const [usersName, setUsersName] = useState(null);
  const [usersCourses, setUserCourses] = useState({});

  // Effect that mounts and sets up an authentication listener 
  useEffect(() => {
    // Function that initializes the user state when the auth state is changed
    const initializeUser = async (user) => {
      if (user) {
        console.log("User authenticated:", user.uid);
        setCurrentUser(user);
        setIsAuthenticated(true);

        try {
          const userId = user.uid;  // Using user.uid consistently
          setUsersId(userId); // Store the user's ID

          // Load user-specific data from Firestore
          await loadUserData(userId);
        } catch (error) {
          console.error("Error during user initialization:", error);
        }
      } else {
        // User is not authenticated
        setCurrentUser(null);
        setIsAuthenticated(false);
        setUsersId(null);
        setUsersName(null);
        setUserCourses({});
        console.log("User logged out.");
      }
    };

    // Function that fetches user's name and course data from Firestore
    const loadUserData = async (userId) => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log("User data fetched:", userData);

          if (userData.name) {
            setUsersName(userData.name);
          } else {
            console.warn("User name not found in document.");
          }

          if (userData.courses) {
            setUserCourses(userData.courses);
          } else {
            console.warn("Courses not found in document.");
          }
        } else {
          console.warn("No user document found for userId:", userId);
        }
      } catch (error) {
        console.error("Error fetching user data from Firestore:", error);
      }
    };

    // Set up authentication state listener
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return () => unsubscribe(); // Clean up the listener when unmounted
  }, []);

  return (
    // Provides states to the rest of the program
    <AuthContext.Provider value={{ currentUser, isAuthenticated, usersId, usersName, usersCourses, setCurrentUser, setIsAuthenticated, setUsersName }}>
      {children}
    </AuthContext.Provider>
  );
};
