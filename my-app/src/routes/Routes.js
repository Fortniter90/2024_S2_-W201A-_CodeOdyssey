import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HeadingsTest from '../pages/HeadingsTest';
import ResourcesPage from '../pages/ResourcesPage';
import AboutUsPage from '../pages/AboutUsPage';

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/headings" element={<HeadingsTest />} /> 
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/about" element={<AboutUsPage />} />
    </Routes>
  );
};

export default AppRoutes;