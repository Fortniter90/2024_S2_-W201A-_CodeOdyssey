import './AuthPage.css';
import '../App.css'
import { AuthProvider } from '../context/AuthContext';
import LoginComponent from '../components/Login';
import AuthStatus from '../components/AuthStatus'
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div className="container">
      <div className="image-half" style={{
        backgroundImage: `url(${'loginBackground.png'})`
      }}></div >
      <div className="right-half"></div>
      <div className="login-half">
        <h1>User Login</h1>
        <AuthProvider>
          <LoginComponent />
          <AuthStatus />
        </AuthProvider>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>

  );
}

export default LoginPage;

