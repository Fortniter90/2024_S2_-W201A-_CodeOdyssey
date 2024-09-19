import './App.css';
import React from 'react';
import TestSystem from './pages/TestSystem';
import TestButton from './components/TestButton';
import PastTestButton from './components/PastTestButton';
import PastTests from './pages/PastTests'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <div>
              <TestButton /> {/* Begin Test button */}
              <PastTestButton /> {/* View Past Tests button */}
            </div>
          } 
        />
        <Route path="/test-system" element={<TestSystem />} /> {/* Page to start the test */}
        <Route path="/past-tests" element={<PastTests />} /> {/* Page for viewing past tests */}
      </Routes>
    </Router>
  );
}

export default App;

