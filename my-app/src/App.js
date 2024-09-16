import './App.css';
import React from 'react';
import TestSystem from './pages/TestSystem';
import TestButton from './components/TestButton';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TestButton />} /> {/* Default page with the button */}
        <Route path="/test-system" element={<TestSystem />} /> {/* Page to start the test */}
      </Routes>
    </Router>
  );
}

export default App;
