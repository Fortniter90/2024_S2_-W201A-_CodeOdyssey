import { BrowserRouter as Router } from 'react-router-dom'
import NavigationBarHome from './components/NavigationBarHome';
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

