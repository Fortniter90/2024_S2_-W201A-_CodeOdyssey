import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDHJ2RRBJbopTuVzGgK7LzgZ84jZ2PL4uo",
  authDomain: "codeodysseydatabase.firebaseapp.com",
  projectId: "codeodysseydatabase",
  storageBucket: "codeodysseydatabase.appspot.com",
  messagingSenderId: "605483995331",
  appId: "1:605483995331:web:212e020befc37d6c6dd276"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
