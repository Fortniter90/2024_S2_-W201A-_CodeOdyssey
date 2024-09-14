import './App.css';
import DeveloperDashboard from './pages/DeveloperDashboard.js';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TempHomePage from './pages/TempHomePage.js';
import CourseTemplate from './pages/CourseTemplate.js';
import LessonTemplate from './pages/LessonTemplate.js';
import TestTemplate from './pages/TestTemplate.js';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<TempHomePage />} />
          <Route path='/developerdashboard' element={<DeveloperDashboard />} />
          <Route path="/course/:courseId" element={<CourseTemplate />} />
          <Route path="/course/:courseId/lesson/:lessonId" element={<LessonTemplate />} />
          <Route path="/course/:courseId/lesson/:lessonId/test/:testId" element={<TestTemplate />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;