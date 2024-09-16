import './App.css';
import NavigationBarHome from './components/NavigationBarHome';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/Routes';

function App() {
  return (
    <Router>
      <NavigationBarHome />
      <div>
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;

