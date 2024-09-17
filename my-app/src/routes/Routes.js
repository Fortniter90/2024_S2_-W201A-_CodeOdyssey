import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LearningPath from '../components/LearningPath';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/learningpath" element={<LearningPath />} /> 
    </Routes>
  );
};

export default AppRoutes;