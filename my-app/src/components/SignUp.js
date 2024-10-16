import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import Button from './Button';

// Component that signs a user up
const SignUpComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth();


  const goToHomePage = () => {
    navigate('/');
  }

  // Function that handles user signup/registration 
  const signUpHandler = async (e) => {
    e.preventDefault(); // Prevents the page from reloading
    try {
      const response = await axios.post('http://localhost:8080/auth/signup', {
        email,
        password,
        name,
      }, {
        headers: {
          'Content-Type': 'application/json' // Ensure the correct content type is set
        }
      });

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Retrieve the ID token
      const idToken = await user.getIdToken();
      localStorage.setItem('idToken', idToken);
      console.log('Signup successful:', response.data);
      alert('Signup successful:', response.data);
      goToHomePage(); // Navigate to home page after successful signup
    } catch (error) {
      // Alert the user with the error message
      const errorMessage = error.response ? error.response.data.error : error.message;
      alert(`Error during signup: ${errorMessage}`);
      console.error('Error during signup:', errorMessage);
    }
  };

  return (
    <div className="roboto-regular">
      {/* Form for user signup */}
      <form onSubmit={signUpHandler} className="sign-up-form">
        {/* Email input field */}
        <div className='authpage-item'>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
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
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Name input field */}
        <div className='authpage-item'>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Sign Up button */}
        <Button text={"SIGN UP"} type="submit" />
      </form>
    </div>
  );
};

export default SignUpComponent;
