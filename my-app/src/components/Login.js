import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

// Component that logins user
const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate('/');
  }


  // Function that handles user login
  const loginHandler = async (e) => {
    e.preventDefault(); // Prevents the page from reloading
    try {
      // Logins user using Firebase auth
      await signInWithEmailAndPassword(auth, email, password);
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

