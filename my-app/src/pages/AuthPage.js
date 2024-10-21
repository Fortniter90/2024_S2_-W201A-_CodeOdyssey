import { AuthProvider } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRightLong, FaX } from 'react-icons/fa6';
import SignUpComponent from '../components/SignUp';
import LoginComponent from '../components/Login';
import CodeOdysseyLogo from '../components/assets/CodeOdysseyLogo';
import './AuthPage.css';

// Component to handle the login and sign up page visuals
const AuthPage = ({ title, formComponent: FormComponent, navigationText, navigationLink }) => {
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
                <h1 className='fira-code'>{title}</h1>

                {/* Wrap components with AuthProvider to manage the authentication state */}
                <AuthProvider>
                    <FormComponent />   {/* Login or Sign up form */}
                </AuthProvider>
            </div>
            
            {/* Navigation link */}
            <Link className='roboto-regular authpage-navigation' to={navigationLink}>
                {navigationText}<FaArrowRightLong />
            </Link>
        </div>
    </div>
  );
}

// Component to set the information for the login page
export const LoginPage = () => {
    return (
        <AuthPage
        title="User Login"
        formComponent={LoginComponent}
        navigationText="Don't have an Account? Sign up Now for Free"
        navigationLink="/signup"
        />
    );
}

// Component to set the information for the sign up page
export const SignUpPage = () => {
    return (
        <AuthPage
        title="Sign Up"
        formComponent={SignUpComponent}
        navigationText="Already Have an Account? Login Now"
        navigationLink="/login"
        />
    );
}