import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import ResourcesPage from '../pages/ResourcesPage';
import AboutUsPage from '../pages/AboutUsPage';
import LoggedInHomePage from '../pages/LoggedInHomePage';
import LoggedOutHomePage from '../pages/LoggedOutHomePage';
import DeveloperDashboard from '../pages/DeveloperDashboard';
import TestTemplate from '../pages/TestTemplate';
import LessonTemplate from '../pages/LessonTemplate';
import CourseTemplate from '../pages/CourseTemplate';
import AllCourses from '../pages/AllCourses';
import PastTests from '../pages/PastTests';
import Profile from '../pages/Profile';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
        <Route path="/" element={isAuthenticated ? <LoggedInHomePage /> : <LoggedOutHomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/developerdashboard" element={<DeveloperDashboard />} /> 
        <Route path="/course" element={<AllCourses />} /> 
        <Route path="/course/:courseId" element={<CourseTemplate />} /> 
        <Route path="/course/:courseId/lesson/:lessonId" element={<LessonTemplate />} /> 
        <Route path="/course/:courseId/lesson/:lessonId/test" element={<TestTemplate />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/pasttests" element={<PastTests />} />
        <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default AppRoutes;
