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
  const [currentUser, setCurrentUser] = useState(null); // Stores currently authenticated user
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks if the user is authenticated or not
  const [usersName, setUsersName] = useState(null); // Stores the users name after fetching from firestore

  // Effect that mounts and sets up an authentication listener 
  useEffect(() => {
    // Function that initializes the user state when the auth state is changed
    const initializeUser = async (user) => {
      // Checks if user is authenticated
      if (user) {
        setCurrentUser(user); // Sets currentUser to the current user
        setIsAuthenticated(true); // Sets user to authenticated
        await loadName(user); // Calls function that fetchs name from firestore
      } else {
        // If user is not authenticated
        setCurrentUser(null); // Sets the currentUser to null
        setIsAuthenticated(false); // Sets the user to unauthenticated
        setUsersName(null); // Clears the name of the user
      }
    };

    // Function that fetches users name from Firestore
    const loadName = async (user) => {
      try {
        const docRef = doc(db, 'users', user.uid); // Gets a reference to the users document in Firestore
        const docSnap = await getDoc(docRef); // Fetches document snapshot
        // Checks if document snapshot exits
        if (docSnap.exists()) {
          const data = docSnap.data(); // Gets data from document
          if (data.name) {
            setUsersName(data.name); // Sets the users name as the name from the data
          }
        } else {
          console.log("No such document!"); // Logs if docment doesn't exists
        }
      } catch (error) {
        console.error("Error loading user name:", error); // Logs any errors during Firestore fetch
      }
    };

    // Sets up authentication state listener
    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return () => unsubscribe(); // Clean up the listener when unmounted
  }, []);

  return (
    // Provides states to the rest of the program
    <AuthContext.Provider value={{ currentUser, isAuthenticated, usersName, setCurrentUser, setIsAuthenticated, setUsersName }}>
      {children}
    </AuthContext.Provider>
  );
};

