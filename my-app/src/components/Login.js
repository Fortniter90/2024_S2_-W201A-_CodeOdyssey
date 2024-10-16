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
    <div className='roboto-regular'>
      {/* Form for user login */}
      <form onSubmit={loginHandler}>

        {/* Email input field */}
        <div className='authpage-item'>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        {/* Password input field */}
        <div className='authpage-item'>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        {/* Login button*/}
        <Button text={"LOGIN"} type="submit" />
      </form>
    </div>
  );
};

export default LoginComponent;

