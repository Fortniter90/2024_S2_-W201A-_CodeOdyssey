import { FaX } from 'react-icons/fa6';
import './Modal.css';

// Structure for Modal
const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    isCentered = true 
}) => {

    if (!isOpen) return null;   // Return null if modal is not open

    return (
        <>
            <div className='overlay' onClick={onClose} />
            <div className={`modal ${isCentered ? 'centered' : 'right'}`}>
                <button className='modal-close' onClick={onClose}>
                    <FaX />
                </button>
            
                <h2>{title}</h2>

                {children}
            </div>
        </>
    );
};

export default Modal;