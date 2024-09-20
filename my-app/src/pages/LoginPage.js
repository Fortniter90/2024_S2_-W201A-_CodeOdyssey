import './AuthPage.css';
import { AuthProvider } from '../context/AuthContext';
import LoginComponent from '../components/Login';
import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <div className="container">
      {/* Left side background image */}
      <div className="image-half" style={{
        backgroundImage: `url(${'loginBackground.png'})`  // Inline style to set background image
      }}></div >

      {/* Right side placeholder for any additional content */}
      <div className="right-half"></div>

      {/* Login form container */}
      <div className="login-half">
        <h1>User Login</h1>

        {/* Wrap components with AuthProvider to manage auth state */}
        <AuthProvider>
          <LoginComponent />   {/* Login form */}
        </AuthProvider>

        {/* Link to sign up page */}
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
