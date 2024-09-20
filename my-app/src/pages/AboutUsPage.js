import Spline from '@splinetool/react-spline';
import "./AboutUsPage.css";
import NavigationBarHome from '../components/NavigationBarHome';

const AboutUsPage = () => {
    return (
      <div className="navbar-left" >
        <NavigationBarHome />

        <h1>About Us Page</h1>
        <p>Here you can learn more about Code Odyssey</p>
        <Spline scene="https://prod.spline.design/3nD3I8QL9AqPbDtT/scene.splinecode" />
      </div>
      
    );
  };
  
  export default AboutUsPage;
  