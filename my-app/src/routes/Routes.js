import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />  {/* Login Page Route */}
      <Route path="/signup" element={<SignUpPage />} /> {/* Signup Page Route */}
    </Routes>
  );
};

export default AppRoutes;
