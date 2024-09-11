import './App.css';
import NavigationBarHome from './components/NavigationBarHome';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ResourcesPage from './components/ResourcesPage';
import AboutUsPage from './components/AboutUsPage';

function App() {
  return (
    <Router>
      <NavigationBarHome />
      <Routes>
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/about" element={<AboutUsPage />} />
      </Routes>
    </Router>
  );
}

export default App;

