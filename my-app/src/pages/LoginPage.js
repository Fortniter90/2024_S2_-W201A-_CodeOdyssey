import './AuthPage.css';
import { AuthProvider } from '../context/AuthContext';
import LoginComponent from '../components/Login';
import { Link, useNavigate } from 'react-router-dom';
import CodeOdysseyLogo from '../components/assets/CodeOdysseyLogo';
import { FaArrowRightLong, FaX } from "react-icons/fa6";

function LoginPage() {
  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate('/');
  };

  return (
    <div className="authpage">
      {/* Left side of the authentication page */}
      <div className='authpage-left'>
        <h1 className='fira-code'>Welcome to</h1>
        <CodeOdysseyLogo width='30vw'/>
      </div>

      {/* Right side of the authentication page */}
      <div className='authpage-right'>
        {/* Button to close the authentication page */}
        <button className='authpage-close' onClick={goToHomePage}><FaX /></button>

        {/* Page content */}
        <div className='authpage-content'>
          <h1 className='fira-code'>User Login</h1>

          {/* Wrap components with AuthProvider to manage the authentication state */}
          <AuthProvider>
            <LoginComponent />   {/* Login form */}
          </AuthProvider>
        </div>
        
        {/* Link to the sign up page */}
        <Link className='roboto-regular authpage-navigation' to='/signup'>Don't have an Account? Sign up Now for Free<FaArrowRightLong /></Link>
      </div>
    </div>
  );
}

export default LoginPage;
