import { createContext, useContext, useState, useRef, useEffect } from "react";
import { FaCircleInfo } from "react-icons/fa6";
import "./CourseHeadings.css";

// Predefined gradients
const gradients = {
    green: 'linear-gradient(var(--python-light), var(--python-medium), var(--python-dark))',
    orange: 'linear-gradient(var(--java-light), var(--java-medium), var(--java-dark))',
    blue: 'linear-gradient(var(--c-light), var(--c-medium), var(--c-dark))'
};

// Create context api
const HeadingInformationContext = createContext();
const { Provider } = HeadingInformationContext;

const CourseHeadings = (props) => {
    const { name, info, backgroundColor } = props;
    const [show, setShow] = useState(false);

    const value = {
        show,
        setShow
    }

    const gradientSytle = {
        backgroundImage: gradients[backgroundColor] || gradients.blue
    }

    return (
        <Provider value={value}>
            <div className="course-heading" style={gradientSytle}>
                <span className="course-name fira-code">{name}</span>
                <InformationButton/>
                {show && <CourseInformation onClose={() => setShow(false)}>{info}</CourseInformation>}
            </div>
        </Provider>
    );
};

// Information button
const InformationButton = ({ children }) => {
    const { setShow, show } = useContext(HeadingInformationContext);

    return (
        <button className="info-button" onClick={() => setShow(!show)}>
            {children}
            <FaCircleInfo />
        </button>
    );
};

// Information about the course
const CourseInformation = ({ children, onClose }) => {
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="popup-overlay" onClick={onClose}>
            <div className="popup-content arrow-top-right roboto-regular" ref={popupRef}>
                {children}
            </div>
        </div>
    );
};

export default CourseHeadings;