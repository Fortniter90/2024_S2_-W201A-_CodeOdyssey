import './App.css';
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes/Routes';

function App() {
  return (
    <Router>
      <div>
        <AppRoutes />  {/* Load the routing logic */}
      </div>
    </Router>
  );
}

export default App;
