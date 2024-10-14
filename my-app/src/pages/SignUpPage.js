import './AuthPage.css';
import { AuthProvider } from '../context/AuthContext';
import SignUpComponent from '../components/SignUp.js';
import { Link, useNavigate } from 'react-router-dom';
import CodeOdysseyLogo from '../components/assets/CodeOdysseyLogo.js';
import { FaArrowRightLong, FaX } from 'react-icons/fa6';

function SignUpPage() {
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
          <h1 className='fira-code'>Sign Up</h1>

          {/* Wrap components with AuthProvider to manage the authentication state */}
          <AuthProvider>
            <SignUpComponent />   {/* Sign up form */}
          </AuthProvider>
        </div>
        
        {/* Link to the sign up page */}
        <Link className='roboto-regular authpage-navigation' to='/login'>Already Have an Account? Login Now<FaArrowRightLong /></Link>
      </div>
    </div>
  );
}


export default SignUpPage;

