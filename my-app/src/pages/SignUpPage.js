import './AuthPage.css';
import '../App.css'
import { AuthProvider } from '../context/AuthContext';
import SignUpComponent from '../components/SignUp.js';
import AuthStatus from '../components/AuthStatus'
import { Link } from 'react-router-dom';

function SignUpPage() {
  return (
    <div className="container">
      <div className="image-half" style={{
        backgroundImage: `url(${'loginBackground.png'})`
      }}></div >
      <div className="right-half"></div>
      <div className="signup-half">
        <h1>User SignUP</h1>
        <AuthProvider>
          <SignUpComponent />
        </AuthProvider>
        <p>
          Have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>

  );
}

export default SignUpPage;

