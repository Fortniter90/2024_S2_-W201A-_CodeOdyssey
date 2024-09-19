import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import HeadingsTest from '../pages/HeadingsTest';
import ResourcesPage from '../pages/ResourcesPage';
import AboutUsPage from '../pages/AboutUsPage';
import { useAuth } from '../context/AuthContext';
import LoggedInHomePage from '../pages/LoggedInHomePage';
import LoggedOutHomePage from '../pages/LoggedOutHomePage';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <LoggedInHomePage /> : <LoggedOutHomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
        <Route path="/headings" element={<HeadingsTest />} /> 
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/about" element={<AboutUsPage />} />
    </Routes>
  );
};

export default AppRoutes;
