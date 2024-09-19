import "./NavigationBarHome.css";
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react'; 

const NavigationBarHome = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const goToLogin = () => {
    navigate('/login');
  }

  const goToSignUp = () => {
    navigate('/signup');
  }

  return (
    <div className="navbar">
      <div className="navbar-left">
        <ul className="nav-links">
        <li className="nav-item">
            <Link to="/" className="nav-link">
              <span>HOME</span>
            </Link>
          </li>
          <li className="nav-item">
            <span onClick={toggleDropdown}>
              COURSES <span className="dropdown-icon">&#x25BC;</span>
            </span>
            {isDropdownOpen && (
              <ul className="dropdown-menu">
                <li className="dropdown-item">Java</li>
                <li className="dropdown-item">Python</li>
                <li className="dropdown-item">C</li>
              </ul>
            )}
          </li>
          <li className="nav-item">
            <Link to="/resources" className="nav-link">
              <span>RESOURCES</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">
              <span>ABOUT US</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-right">
        <button className="login-btn" onClick={goToLogin}>LOGIN</button>
        <button className="signup-btn" onClick={goToSignUp}>SIGN UP</button>
      </div>
    </div>
  );
};

export default NavigationBarHome;