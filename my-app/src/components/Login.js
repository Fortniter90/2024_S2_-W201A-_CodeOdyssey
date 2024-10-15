import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';

// Component that logins user
const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();

  const goToHomePage = () => {
    navigate('/');
  }


  // Function that handles user login
  const loginHandler = async (e) => {
    e.preventDefault(); // Prevents the page from reloading
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Retrieve the ID token
      const idToken = await user.getIdToken();
      localStorage.setItem('idToken', idToken);
      checkAuthStatus();
      goToHomePage();
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

