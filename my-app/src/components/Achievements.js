import "./Achievements.css";
import achivIcon from "./assets/award.png";

const Achievements = () => {
    return (
        <div className="achiv-box">
            <div className="achiv-box-item">
            <img src={achivIcon} alt="Achivement Icon" className="achiv-icon" />
            <div className="achiv-item">Achievement 1</div>
            </div>
            <div className="achiv-box-item">
            <img src={achivIcon} alt="Achivement Icon" className="achiv-icon" />
            <div className="achiv-item">Achievement 2</div>
            </div>
        </div>
    )
}

export default Achievements;