import "./NavigationBarHome.css";

const NavigationBarHome = () => {
    return (
      <div className="navbar">
        <div className="navbar-left">
          <ul className="nav-links">
            <li className="nav-item">
              <span>COURSES <span className="dropdown-icon">&#x25BC;</span></span>
            </li>
            <li className="nav-item">
              <span>RESOURCES</span>
            </li>
            <li className="nav-item">
              <span>ABOUT US</span>
            </li>
          </ul>
        </div>
        <div className="navbar-right">
          <button className="login-btn">LOGIN</button>
          <button className="signup-btn">SIGN UP</button>
        </div>
      </div>
    );
  };
  
  export default NavigationBarHome;