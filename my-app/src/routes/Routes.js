import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TempHomePage from '../pages/TempHomePage';
import DeveloperDashboard from '../pages/DeveloperDashboard';
import TestTemplate from '../pages/TestTemplate';
import LessonTemplate from '../pages/LessonTemplate';
import CourseTemplate from '../pages/CourseTemplate';
import LessonList from '../pages/LessonList';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TempHomePage />} /> 
      <Route path="/developerdashboard" element={<DeveloperDashboard />} /> 
      <Route path="/course/:courseId" element={<CourseTemplate />} /> 
      <Route path="/course/:courseId/lesson/uh/:lessonId" element={<LessonList />} /> 
      <Route path="/course/:courseId/lesson/:lessonId" element={<LessonTemplate />} /> 
      <Route path="/course/:courseId/lesson/:lessonId/test/:testId" element={<TestTemplate />} /> 
    </Routes>
  );
};

export default AppRoutes;