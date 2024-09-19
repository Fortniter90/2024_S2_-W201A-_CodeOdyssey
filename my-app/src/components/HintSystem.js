import { useState, useEffect } from 'react';
import { FaCircleQuestion } from "react-icons/fa6";
import './HintSystem.css';

// HintSystem Component: handles the display of hints for questions
const HintSystem = ({ hint, testId }) => { 
    const [showHint, setShowHint] = useState(false);            // Manage whether the hint is visible or not
    const [showPrompt, setShowPrompt] = useState(true);         // Control the visibility of the initial prompt
    const [timerId, setTimerId] = useState(null);               // Keep track of the active timer
    const [delay, setDelay] = useState(300000);                 // Default delay of 5 minutes (300000 ms)
    const [hasSeenPrompt, setHasSeenPrompt] = useState(false);  // Track if prompt has been shown before

    // Effect to handle visibility of the initial prompt
    useEffect(() => {
        // Show the prompt if it hasn't been shown before
        if (!hasSeenPrompt) {
            setShowPrompt(true); // Make the prompt visible

            const id = setTimeout(() => {
                setShowPrompt(false); // Hide the prompt after 10 seconds if no interaction
            }, 10000);

            setHasSeenPrompt(true); // Mark the prompt as seen
            return () => clearTimeout(id); // Cleanup timer on component unmount

        } else {
            setShowPrompt(false); // Hide the prompt after it has been shown once
        }
    }, []);

    // Function to start the timer for showing the hint
    const startTimer = (customDelay = delay) => {
        if (timerId) {
            clearTimeout(timerId); // Clear the previous timer if any
        }

        // Set a new timer to show hint after specified delay
        const id = setTimeout(() => {
            setShowHint(true); // Show hint after the specified delay
            clearTimeout(id); // Stop the timer once the hint is shown
        }, customDelay);

        setTimerId(id); // Store timer ID
    };

    // Handle form submission to set the custom timer
    const handleSetTimer = (e) => {
        e.preventDefault();

        const minutes = parseInt(e.target.minutes.value, 10) || 0;
        const seconds = parseInt(e.target.seconds.value, 10) || 0;
        const customDelay = (minutes * 60 + seconds) * 1000; // Convert to milliseconds

        setDelay(customDelay > 0 ? customDelay : 300000); // Use 5 minutes if no valid delay is set

        startTimer(customDelay); // Start the timer
        setShowPrompt(false); // Hide the prompt after setting the timer
    };

    // Effect to reset the hint and start the timer when a new test is selected
    useEffect(() => {
        setShowHint(false); // Hide the hint when a new question is shown

        if (timerId) {
            clearTimeout(timerId); // Clear the previous timer
        }

        startTimer(); // Start timer with the previously set delay or default delay
    }, [testId]); // Run this effect when a new test is selected

    return (
        <div className="hint-system-container">
            {/* Button to display hint */}
            <div className="hint-button-container">
                <FaCircleQuestion 
                    className="hint-button" 
                    onClick={() => setShowHint(prevShowHint => !prevShowHint)} // Show the hint when clicked
                />
            </div>

            {/* Display the initial prompt only once and allow a custom timer */}
            {showPrompt && (
                <div className="hint-tooltip">
                    <p>Set a time for the hint to be prompted. If you ignore this, a hint will be prompted in 5 minutes.</p>
                    <form onSubmit={handleSetTimer} className="timer-form">
                        <label>
                            Minutes:
                            <input type="number" name="minutes" min="0" />
                        </label>
                        <label>
                            Seconds:
                            <input type="number" name="seconds" min="0" />
                        </label>
                        <button type="submit">Set Timer</button>
                    </form>
                </div>
            )}

            {/* Show the hint only when the question mark is clicked */}
            {showHint && (
                <div className="hint-panel">
                    {hint || "No hint available."}
                </div>
            )}
        </div>
    );
};

export default HintSystem;
