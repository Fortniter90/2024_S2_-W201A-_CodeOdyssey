import './AuthPage.css';
import { AuthProvider } from '../context/AuthContext';
import SignUpComponent from '../components/SignUp.js';
import { Link } from 'react-router-dom';

function SignUpPage() {
  return (
    <div className="container">
      {/* Left side background image */}
      <div className="image-half" style={{
        backgroundImage: `url(${'loginBackground.png'})`  // Inline style to set background image
      }}></div >

      {/* Right side placeholder for any additional content */}
      <div className="right-half"></div>

      {/* Signup form container */}
      <div className="signup-half">
        <h1>User SignUp</h1>

        {/* Wrap components with AuthProvider to manage authentication state */}
        <AuthProvider>
          <SignUpComponent />   {/* Sign up form */}
        </AuthProvider>

        {/* Link to login page */}
        <p>
          Have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}


export default SignUpPage;

