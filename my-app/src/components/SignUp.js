import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

// Component that signs a user up
const SignUpComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate('/');
  }

  // Function that handles user signup/registration 
  const signUpHandler = async (e) => {
    e.preventDefault(); // Prevents the page from reloading
    try {
      // Creates a new user using firebase auth
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // Saves user's name to firestore database in the users collection using their UID
      await setDoc(doc(db, 'users', userCred.user.uid), {
        name: name,
        courses: {},
      });
      goToHomePage();
    } catch (error) {
      alert(error.message); // Shows an error message should an error occur
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
