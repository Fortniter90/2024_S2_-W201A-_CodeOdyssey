import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { FaCircleInfo } from 'react-icons/fa6';
import './CourseHeadings.css';

const CourseHeadings = ({ course }) => {
    const [show, setShow] = useState(false); // State to track if course information should be shown
    const popupRef = useRef(null);
    
    // Effect to close the popup when clicking outside of it
    useEffect(() => {
        const handleClickOutside = (e) => {
            // If the click was outside the popup content, close the popup
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setShow(false);
            }
        };

        // Attach event listener to detect outside clicks
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Clean up the event listener
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className='course-heading' style={{ backgroundImage: `linear-gradient(var(--${course.color}-light), var(--${course.color}-medium), var(--${course.color}-dark))` }}>
            {/* Course name display */}
            <span className='fira-code'>{course.title}</span>

            {/* Information button to toggle course information popup */}
            <button className='info-button' onClick={() => setShow(!show)}>
                <FaCircleInfo />
            </button>

            {/* Show the CourseInformation popup if 'show' is true */}
            {show && (
                <div className="popup-overlay">
                    {/* Popup content */}
                    <div className="popup-content arrow-top-right roboto-regular" ref={popupRef}>
                        {course.description}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseHeadings;