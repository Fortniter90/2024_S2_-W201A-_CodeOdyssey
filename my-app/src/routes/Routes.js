import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import HeadingsTest from '../pages/HeadingsTest';
import ResourcesPage from '../pages/ResourcesPage';
import AboutUsPage from '../pages/AboutUsPage';
import LearningPath from '../components/LearningPath';
import LoggedInHomePage from '../pages/LoggedInHomePage';
import LoggedOutHomePage from '../pages/LoggedOutHomePage';
import HintTest from '../pages/HintTest';
import DeveloperDashboard from '../pages/DeveloperDashboard';
import TestTemplate from '../pages/TestTemplate';
import LessonTemplate from '../pages/LessonTemplate';
import CourseTemplate from '../pages/CourseTemplate';
import LessonList from '../pages/LessonList';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
        <Route path="/" element={isAuthenticated ? <LoggedInHomePage /> : <LoggedOutHomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/developerdashboard" element={<DeveloperDashboard />} /> 
        <Route path="/course/:courseId" element={<CourseTemplate />} /> 
        <Route path="/course/:courseId/lesson/uh/:lessonId" element={<LessonList />} /> 
        <Route path="/course/:courseId/lesson/:lessonId" element={<LessonTemplate />} /> 
        <Route path="/course/:courseId/lesson/:lessonId/test/:testId" element={<TestTemplate />} /> 
        <Route path="/headings" element={<HeadingsTest />} /> 
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/learningpath" element={<LearningPath />} /> 
        <Route path="/hinttest" element={<HintTest />} />
    </Routes>
  );
};

export default AppRoutes;
