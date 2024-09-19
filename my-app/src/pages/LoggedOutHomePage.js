import HomeBanner from '../components/HomeBanner';
import NavigationBarHome from '../components/NavigationBarHome';
import './LoggedOutHomePage.css';

// HomePage for when users are not logged in
const LoggedOutHomePage = () => {
    return (
        <div>
            {/* Navigation bar for the home page */}
            <NavigationBarHome />

            {/* Main content area */}
            <div className='main-content'>
                <p className='fira-code'>
                    Your Journey <br/>
                    to Mastering <br/>
                    Programming <br/>
                    Starts Here!
                </p>

                {/* Website logo */}
                <div className='logo'>
                    <h1 className='ultra-regular top-logo'>Code</h1>
                    <h1 className='solway-regular bottom-logo'>Odyssey</h1>
                </div>
            </div>

            {/* Banner about courses */}
            <HomeBanner />
        </div>
    );
};

export default LoggedOutHomePage;