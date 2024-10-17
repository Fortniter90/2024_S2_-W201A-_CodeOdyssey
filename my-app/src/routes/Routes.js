import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Imports for all pages in order
import LoggedInHomePage from '../pages/LoggedInHomePage';
import LoggedOutHomePage from '../pages/LoggedOutHomePage';
import ResourcesPage from '../pages/ResourcesPage';
import AboutUsPage from '../pages/AboutUsPage';
import { LoginPage, SignUpPage } from '../pages/AuthPage';
import DeveloperDashboard from '../pages/DeveloperDashboard';
import AllCourses from '../pages/AllCourses';
import CourseTemplate from '../pages/CourseTemplate';
import LessonTemplate from '../pages/LessonTemplate';
import TestTemplate from '../pages/TestTemplate';
import Profile from '../pages/Profile';
import PastTests from '../pages/PastTests';
import UserSettings from '../pages/UserSettings';

const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator while checking auth status
  }
  return (
    <Routes>
        <Route path="/" element={isAuthenticated ? <LoggedInHomePage /> : <LoggedOutHomePage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/developerdashboard" element={<DeveloperDashboard />} /> 
        <Route path="/course" element={<AllCourses />} /> 
        <Route path="/course/:courseId" element={<CourseTemplate />} /> 
        <Route path="/course/:courseId/lesson/:lessonId" element={<LessonTemplate />} /> 
        <Route path="/course/:courseId/lesson/:lessonId/test" element={<TestTemplate />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/pasttests" element={<PastTests />} />
        <Route path="/profile/settings" element={<UserSettings />} />
    </Routes>
  );
};

export default AppRoutes;
