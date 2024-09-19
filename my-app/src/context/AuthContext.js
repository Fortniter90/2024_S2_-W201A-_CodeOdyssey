
import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useState, useEffect, useContext } from "react";
import { auth } from '../config/firebase';
import { db } from '../config/firebase';
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usersName, setUsersName] = useState(null);
  const [usersCourses, setUserCourses] = useState({});

  useEffect(() => {
    const initializeUser = async (user) => {
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        await loadName(user);
        await loadUserData(user);
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setUsersName(null);
      }
    };

    const loadName = async (user) => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.name) {
            setUsersName(data.name);
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error loading user name:", error);
      }
    };

    const loadUserData = async (user) => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserCourses(data.courses || {});
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, initializeUser);
    return () => unsubscribe(); // Clean up the listener
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isAuthenticated, usersName, usersCourses }}>
      {children}
    </AuthContext.Provider>
  );
};

