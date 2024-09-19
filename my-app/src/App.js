import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './routes/Routes';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
      <div>
        <AppRoutes /> 
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;

