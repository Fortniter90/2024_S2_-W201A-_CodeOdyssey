import React, { useEffect } from 'react';
import CodeOdysseyLogo from '../components/assets/CodeOdysseyLogo';
import Footer from '../components/Footer';
import HomeBanner from '../components/HomeBanner';
import NavigationBarHome from '../components/NavigationBarHome';
import { useAuth } from '../context/AuthContext';
import './LoggedOutHomePage.css';

// HomePage for when users are not logged in
const LoggedOutHomePage = () => {
  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    checkAuthStatus(); // Check if the user is authenticated when the home page loads
  }, [checkAuthStatus]);

  return (
    <div>
      {/* Navigation bar for the home page */}
      <NavigationBarHome />

      {/* Main content area */}
      <div className='main-content'>
        <p className='fira-code'>
          Your Journey <br />
          to Mastering <br />
          Programming <br />
          Starts Here!
        </p>

        {/* Website logo */}
        <div className='logo'>
          <CodeOdysseyLogo width='32vw' />
        </div>
      </div>

      {/* Banner about courses */}
      <HomeBanner />

      <Footer />
    </div>
  );
};

export default LoggedOutHomePage;
