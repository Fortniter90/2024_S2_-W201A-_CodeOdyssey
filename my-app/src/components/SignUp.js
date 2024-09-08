import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './FirebaseConfig';

const SignUpComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUpHandler = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("SignUp successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={signUpHandler}>SignUp</button>
    </div>
  );
};

export default SignUpComponent;
