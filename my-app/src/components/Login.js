import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

// Component that logins user
const LoginComponent = () => {
  const [email, setEmail] = useState(''); // Stores users email input
  const [password, setPassword] = useState(''); // Stores users password input


  // Function that handles user login
  const loginHandler = async (e) => {
    e.preventDefault(); // Prevents the page from reloading
    try {
      // Logins user using Firebase auth
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!"); // Alerts user that login was successful
    } catch (error) {
      alert(`Error: ${error.message}`); // Shows an error message should an error occur
    }
  };

  return (
    <div>
      {/* Form for user login */}
      <form onSubmit={loginHandler}>

        {/* Email input field */}
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />

        {/* Password input field */}
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />

        {/* Login button*/}
        <button className="button-20" type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginComponent;

