import { FaMagnifyingGlass } from 'react-icons/fa6';
import Pagination from './Pagination';
import './DatabaseManagement.css';
import './FeedbackManagement.css';
import './Filter.css';
import { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

const FeedbackManagement = () => {

    const [selectedItem, setSelectedItem] = useState(null);
    // States controling filtering and searching
    const [searchTerm, setSearchTerm] = useState(''); 
    
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;



    // States controling modal visibility
    const [modals, setModals] = useState({
        details: false,
        success: false,
        delete: false,
    })

    // Handle course selection for editing and viewing details
    const handleItemClick = () => {
      setSelectedItem(true);          // Set the selected item
      toggleModal('details', true); // Open the details modal
    };

    // Handle modal visibility
    const toggleModal = (modalName, state) => {
      setModals((prev) => ({ ...prev, [modalName]: state })); // Change state of given modal
    }

    //const filteredFeedback = feedback..

    return (
        <div className='management roboto-regular'> 
            <div className='management-header'>
                <h1 className='fira-code'>Feedback Management</h1>
            </div>

            <div className='filter'>
                <div className='search-container roboto-regular'>
                    <input
                    type='text'
                    placeholder='Search by name...'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaMagnifyingGlass className='search-icon' />
                </div>
            </div>

            <div className='feedback-management'>
                <div className='feedback-management-box' onClick={() => handleItemClick()}>
                    <h2>User</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
                <div className='feedback-management-box'>
                    <h2>User</h2>
                    <p>Feedback</p>
                </div>
                <div className='feedback-management-box'>
                    <h2>User</h2>
                    <p>Feedback</p>
                </div>
                <div className='feedback-management-box'>
                    <h2>User</h2>
                    <p>Feedback</p>
                </div>
                <div className='feedback-management-box'>
                    <h2>User</h2>
                    <p>Feedback</p>
                </div>
                <div className='feedback-management-box'>
                    <h2>User</h2>
                    <p>Feedback</p>
                </div>
            </div>

            {selectedItem && (
                <Modal
                    isOpen={modals.details}
                    onClose={() => toggleModal('details', false)}
                    title={"Feedback"}
                    children={
                        <>
                            <h2>User</h2>
                            <p>Feedback</p>
                            

                            <hr className='modal-divider' />
                                    
                            <div className='modal-buttons'>
                                <Button text={"Close"} action={() => toggleModal('details', false)} />
                                <Button text={"Delete"} outline={true} action={() => { toggleModal('details', false); toggleModal('delete', true) }} />
                            </div>
                        </>
                    }
                    isCentered={false}
                />
            )}

        </div>
    );
}

export default FeedbackManagement;