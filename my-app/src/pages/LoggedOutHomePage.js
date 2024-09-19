import HomeBanner from '../components/HomeBanner';
import NavigationBarHome from '../components/NavigationBarHome';
import './LoggedOutHomePage.css';

const LoggedOutHomePage = () => {
    return (
        <div>
            <NavigationBarHome />

            <div className='main-content'>
                <p className='fira-code'>
                    Your Journey <br/>
                    to Mastering <br/>
                    Programming <br/>
                    Starts Here!
                </p>

                <div className='logo'>
                    <h1 className='ultra-regular top-logo'>Code</h1>
                    <h1 className='solway-regular bottom-logo'>Odyssey</h1>
                </div>
            </div>

            <HomeBanner />
        </div>
    );
};

export default LoggedOutHomePage;