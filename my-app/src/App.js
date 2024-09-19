import { BrowserRouter as Router } from 'react-router-dom'
import NavigationBarHome from './components/NavigationBarHome';
import NavigationBarUser from './components/NavigationBarUser';
import AppRoutes from './routes/Routes';

function App() {
  return (
    <Router>
      <NavigationBarUser />
      <NavigationBarHome />
      <div>
        <AppRoutes />
      </div>
    </Router>
    
  );
  
}

export default App;

