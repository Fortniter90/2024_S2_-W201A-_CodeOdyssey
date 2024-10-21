import { useState, useEffect, useRef } from 'react';
import { FaCircleQuestion } from 'react-icons/fa6';
import './HintSystem.css';
import Button from './Button';

const HintSystem = ({ hint, testId }) => {
    // State variables controlling the visibility of functions
    const [showHint, setShowHint] = useState(false);            // Hint
    const [showPrompt, setShowPrompt] = useState(false);        // Hint prompt
    const [showTimerTool, setTimerTool] = useState(true);       // Timer setter
    const [remainingTime, setRemainingTime] = useState(0);      // Remaining time for the timer
    const [hintUsed, setHintUsed] = useState(false);            // Flag to check if hint was used

    // Variables for timer delays
    const [delay, setDelay] = useState(300000);                 // Default delay of 5 minutes (300000 ms)
    const [customDelay, setCustomDelay] = useState(0);          // Store the custom delay

    // Store the timer state for each question
    const timerStates = useRef({}); // Store the timer state for each question
    const promptTimerIdRef = useRef(null); // Store the prompt timer ID
    const hintSystemRef = useRef(null); // Ref for the HintSystem component

    // Effect to manage the visibility of the hint prompt
    useEffect(() => {
        if (showPrompt) {
            const promptTimeout = setTimeout(() => {
                setShowPrompt(false); // Hide the prompt after 10 seconds
            }, 10000);

            return () => clearTimeout(promptTimeout); // Cleanup timer on unmount or prompt change
        }
    }, [showPrompt]);

    // Effect to manage remaining time and handle hint visibility
    useEffect(() => {
        if (remainingTime > 0) {
            const countdown = setInterval(() => {
                setRemainingTime((prevTime) => {
                    if (prevTime <= 1000) {
                        clearInterval(countdown);
                        setShowPrompt(true); // Show the hint prompt when time runs out
                        return 0; // Stop the timer
                    }
                    return prevTime - 1000; // Decrease by 1 second
                });
            }, 1000);

            return () => clearInterval(countdown); // Cleanup interval on unmount or when remainingTime changes
        }
    }, [remainingTime]);

    // Function to handle form submission and set the custom timer
    const handleSetTimer = (e) => {
        e.preventDefault();
        const minutes = parseInt(e.target.minutes.value, 10) || 0;
        const seconds = parseInt(e.target.seconds.value, 10) || 0;
        const newCustomDelay = (minutes * 60 + seconds) * 1000; // Convert to milliseconds

        setDelay(newCustomDelay > 0 ? newCustomDelay : 300000);           // Use 5 minutes if no valid delay is set
        setRemainingTime(newCustomDelay > 0 ? newCustomDelay : 300000);   // Set remaining time
        setTimerTool(false);                                        // Hide the timer tool after setting the timer
        setCustomDelay(newCustomDelay);                            // Store custom delay
    };

    // Handle clicking the hint button
    const handleHintButtonClick = () => {
        setShowHint((prevShowHint) => !prevShowHint); // Toggle the visibility of the hint
        setShowPrompt(false); // Hide the prompt when the hint is shown
        clearTimeout(promptTimerIdRef.current); // Clear prompt timer
    };

    // Save the current timer state when navigating away from a question
    const saveTimerState = () => {
        timerStates.current[testId] = {
            remainingTime,
            hintUsed,
        };
    };

    // Restore the timer state when returning to a question
    const restoreTimerState = () => {
        const savedState = timerStates.current[testId];

        if (savedState) {
            setRemainingTime(savedState.remainingTime);
            setHintUsed(savedState.hintUsed);
            if (savedState.hintUsed) {
                setShowHint(true); // Show hint if it was used
            }
        } else {
            // If no saved state, set initial timer values
            setRemainingTime(0);
            setHintUsed(false);
            setShowHint(false);
            setShowPrompt(false);
            setTimerTool(true);
        }
    };

    // Effect to handle navigation between questions
    useEffect(() => {
        // Restore the timer state for the new question
        restoreTimerState();
        
        // Start the timer for showing the prompt after the custom delay
        if (remainingTime === 0) {
            setRemainingTime(delay); // Reset to default or custom delay
        }

        return () => {
            saveTimerState(); // Save the current timer state when changing questions
        };
    }, [testId]);

    // Effect to handle clicks outside the HintSystem component
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (hintSystemRef.current && !hintSystemRef.current.contains(event.target)) {
                setShowHint(false);
                setShowPrompt(false);
                setTimerTool(false); // Close all panels
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="hint-system-container" ref={hintSystemRef}>
            {/* Button to display hint */}
            <div className="hint-button-container">
                <FaCircleQuestion onClick={handleHintButtonClick} />
            </div>

            {/* Display the initial prompt only once and allow a custom timer */}
            {showTimerTool && (
                <div className="hint-container roboto-regular">
                    <p>Set a time for the hint to be prompted</p>
                    <p>If you ignore this, a hint will be prompted in 5 minutes.</p>
                    
                    <form onSubmit={handleSetTimer} className="timer-form">
                        <label>
                            Minutes
                            <input type="number" name="minutes" min="0" />
                        </label>
                        <label>
                            Seconds
                            <input type="number" name="seconds" min="0" />
                        </label>
                        
                        <Button text={'SET TIME'} type={'submit'} />
                    </form>
                </div>
            )}

            {/* Show a prompt for the hint */}
            {showPrompt && (
                <div className="hint-container">
                    Do you need a hint?
                </div>
            )}

            {/* Show the hint only when the question mark is clicked */}
            {showHint && (
                <div className="hint-container roboto-regular">
                    {hint || "You don't need a hint for this, you got it!"}
                </div>
            )}
        </div>
    );
};

export default HintSystem;