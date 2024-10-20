import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { submitFeedback } from "../utils/dataSaving";
import "./Feedback.css";

const Feedback = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const { currentUser } = useAuth();

  const toggleFeedbackBox = () => {
    setIsOpen(!isOpen);
    if (isOpen) { // Only clear feedback when closing
      setFeedback('');
    }
  };

  const handleSubmit = async () => {
    if (feedback.trim() === '') return;

    try {
      console.log('Feedback submitted:', feedback);
      await submitFeedback(currentUser.uid, currentUser.email, feedback);
      setFeedback('');
      setIsOpen(false);
      setPopupVisible(true);
      setTimeout(() => setPopupVisible(false), 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <>
      <button className="feedback-btn" onClick={toggleFeedbackBox}>
        💬
      </button>

      {isOpen && (
        <div className="feedback-overlay">
          <div className="feedback-box">
            <h2>Any suggestions or bugs to report?</h2>
            <p>Please enter it here, any feedback is greatly appreciated!</p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback here"
            />
            <button className="submit-btn" onClick={handleSubmit}>
              Submit Feedback
            </button>
          </div>
        </div>
      )}

      {popupVisible && (
        <div className="feedback-popup">
          <p>Feedback submitted, thank you!</p>
        </div>
      )}
    </>
  );
};

export default Feedback;
