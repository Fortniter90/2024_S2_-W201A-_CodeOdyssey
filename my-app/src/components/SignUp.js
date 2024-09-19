import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';

// Component that signs a user up
const SignUpComponent = () => {
  const [email, setEmail] = useState(''); // Stores users email input
  const [password, setPassword] = useState(''); // Stores users password input
  const [name, setName] = useState(''); // Stores users name input

  // Function that handles user signup/registration 
  const signUpHandler = async (e) => {
    e.preventDefault(); // Prevents the page from reloading
    try {
      // Creates a new user using firebase auth
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // Saves user's name to firestore database in the users collection using their UID
      await setDoc(doc(db, 'users', userCred.user.uid), {
        name: name,
      });

      alert("SignUp successful!"); // Alerts user that signup was successful
    } catch (error) {
      alert(error.message); // Shows an error message should an error occur
    }
  };

  return (
    <div className="sign-up-container">
      {/* Form for user signup */}
      <form onSubmit={signUpHandler} className="sign-up-form">
        {/* Email input field */}
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />

        {/* Password input field */}
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        {/* Name input field */}
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />

        {/* Sign Up button */}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUpComponent;
