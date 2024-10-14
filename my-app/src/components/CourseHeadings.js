import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { FaCircleInfo } from 'react-icons/fa6';
import './CourseHeadings.css';

// Predefined gradients
const gradients = {
    green: 'linear-gradient(var(--python-light), var(--python-medium), var(--python-dark))',
    orange: 'linear-gradient(var(--java-light), var(--java-medium), var(--java-dark))',
    blue: 'linear-gradient(var(--c-light), var(--c-medium), var(--c-dark))'
};

// Create context API for managing heading information state
const HeadingInformationContext = createContext();
const { Provider } = HeadingInformationContext;

const CourseHeadings = ({ name, information, backgroundColor }) => {
    const [show, setShow] = useState(false); // State to track if course information should be shown

    // Context value containing show state and function to toggle it
    const value = {
        show,
        setShow
    }

    // Style for background gradient based on provided colour
    const gradientSytle = {
        backgroundImage: gradients[backgroundColor] || gradients.blue
    }

    return (
        // Provider to pass 'show' state and 'setShow' function to the children components
        <Provider value={value}>
            <div className='course-heading' style={gradientSytle}>
                {/* Course name display */}
                <span className='fira-code'>{name}</span>

                {/* Information button to toggle course information popup */}
                <InformationButton/>

                {/* Show the CourseInformation popup if 'show' is true */}
                {show && <CourseInformation onClose={() => setShow(false)}>{information}</CourseInformation>}
            </div>
        </Provider>
    );
};

// Information button
const InformationButton = ({ children }) => {
    const { setShow, show } = useContext(HeadingInformationContext);

    return (
        // Button toggles the 'show' state when clicked
        <button className='info-button' onClick={() => setShow(!show)}>
            {children}
            <FaCircleInfo />
        </button>
    );
};

// Information popup about the course
const CourseInformation = ({ children, onClose }) => {
    const popupRef = useRef(null); // Ref for the popup content

    // Effect to close the popup when clocking outside of it
    useEffect(() => {
        const handleClickOutside = (e) => {
            // If the click was outside the popup content, close the popup
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                onClose();
            }
        };

        // Attach event listener to detect outside clicks
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Clean up the event listener
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        // Popup overlay, closes the popup if clicked outside
        <div className="popup-overlay" onClick={onClose}>
            {/* Popup content */}
            <div className="popup-content arrow-top-right roboto-regular" ref={popupRef}>
                {children} {/* Course information text */}
            </div>
        </div>
    );
};

export default CourseHeadings;