import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HeadingsTest from '../pages/HeadingsTest';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/headings" element={<HeadingsTest />} /> 
    </Routes>
  );
};

export default AppRoutes;