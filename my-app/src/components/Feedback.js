import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { submitFeedback } from "../utils/dataSaving";
import { FaComment, FaX } from "react-icons/fa6";
import "./Feedback.css";
import Button from "./Button";

const Feedback = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async () => {
    if (feedback.trim() === '') return;

    try {
      await submitFeedback(currentUser.uid, currentUser.email, feedback);

      console.log('Feedback submitted:', feedback);
      setFeedback('');
      setIsOpen(false);
      setPopupVisible(true);
      setTimeout(() => setPopupVisible(false), 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const toggleFeedbackBox = () => {
    setIsOpen(!isOpen);
    if (isOpen) { // Only clear feedback when closing
      setFeedback(''); 
    }
  };

  const togglePopUp = () => {
    setPopupVisible(!popupVisible);
  }


  return (
    <>
      <button className="open-feedback-menu" onClick={popupVisible ? togglePopUp : toggleFeedbackBox}>
        <FaComment />
      </button>

      {isOpen && (
        <>
          <div className='overlay' onClick={toggleFeedbackBox} />
          <div className="feedback-container">
            <button className='authpage-close' onClick={toggleFeedbackBox} ><FaX /></button>

            <div className="feedback-header">
              <h1 className='roboto-bold'>
                Have a Suggestion or Bug to Report?
              </h1>
              <p className='roboto-medium'>
                If so, please enter it here. Any feedback is greatly appreciated!
              </p>
            </div>
            
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback here..."
            />

            <div className="feedback-buttons">
              <Button text="SUBMIT FEEDBACK" action={handleSubmit} color={'var(--green-medium)'} hoverColor={'var(--green-dark)'} />
              <Button text="CANCEL" outline={true} action={toggleFeedbackBox} color={'var(--gray-medium)'} />
            </div>
          </div>
        </>
      )}

      {popupVisible && (
        <>
          <div className='overlay' onClick={togglePopUp} />
          <div className="feedback-popup">
            <button className='authpage-close' onClick={togglePopUp} ><FaX /></button>
            
            <div className="feedback-header">
              <h1 className='roboto-bold'>
                Thank You!
              </h1>
              <p className='roboto-medium'>
                Thank you for sharing your thoughts. We appreciate your feedback
              </p>
            </div>

            <Button text="DONE" action={togglePopUp} color={'var(--green-medium)'} hoverColor={'var(--green-dark)'} />
          </div>
        </>
      )}
    </>
  );
};

export default Feedback;
