import "./HeaderOptions.css";
import userIcon from "./assets/profilepic.png";
import searchIcon from "./assets/searchicn.png";

const HeaderOptions = () => {
    return (
        <div className="header-options">
            <div className="header-left">
                <ul className="header-items">
                    <li className="header-item">
                        <button className="dashboard">DASHBOARD</button>
                    </li>
                    <li className="header-item">

                        <button className="courses">COURSES</button>

                    </li>
                    <li className="header-item">

                        <button className="resources">RESOURCES</button>

                    </li>
                </ul>
                </div>
                <div className="header-right">

                    <button className="search-icn">
                    <img src={searchIcon} alt="Search icon" />
                    </button>

                    <button className="user-icn">
                    <img src={userIcon} alt="User icon" />
                    </button>

            </div>
        </div>
    );
};

export default HeaderOptions;