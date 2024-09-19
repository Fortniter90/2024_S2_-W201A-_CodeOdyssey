// Importing the CSS file for the styling component.
import "./NavigationBarUser.css";

//Import the profile icon from the react-icons library.
import { CgProfile } from "react-icons/cg";

//Defining the NavigationBarUser copmponent.
const NavigationBarUser = () => {
  return (
    //Main navigation bar container.
    <div className="navbar">
        {/*Left side of the nav bar containing the navigation links*/}
      <div className="navbar-left">
        <ul className="nav-links">
            {/*List item for the Dashoard link*/}
          <li className="nav-item">
            <span>DASHBOARD</span>
          </li>
          {/* List item for the courses link with a dropdown icon*/}
          <li className="nav-item">
            <span>
              COURSES <span className="dropdown-icon">&#x25BC;</span>
            </span>
          </li>
          {/* List item for resources link */}
          <li className="nav-item">
            <span>RESOURCES</span>
          </li>
        </ul>
      </div>
      {/*Right side of the nav bar containing the profile icon*/}
      <div className="navbar-right">
        {/*Profile icon, will change colour on hover*/}
        <CgProfile className="profile-icon" />
      </div>
    </div>
  );
};

//Exporting the NavigationBaruser component to be used in other parts of the app.
export default NavigationBarUser;
