import React, { useEffect } from 'react';
import CodeOdysseyLogo from '../components/assets/CodeOdysseyLogo';
import Footer from '../components/Footer';
import HomeBanner from '../components/HomeBanner';
import { useAuth } from '../context/AuthContext';
import './LoggedOutHomePage.css';
import NavigationBar from '../components/NavigationBar';

// HomePage for when users are not logged in
const LoggedOutHomePage = () => {
  const { checkAuthStatus } = useAuth();

  useEffect(() => {
    checkAuthStatus(); // Check if the user is authenticated when the home page loads
  }, [checkAuthStatus]);

  return (
    <div>
      {/* Navigation bar for the home page */}
      <NavigationBar />

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
