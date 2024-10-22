import { FaMagnifyingGlass } from 'react-icons/fa6';
import Pagination from './Pagination';
import './DatabaseManagement.css';
import './FeedbackManagement.css';
import './Filter.css';
import { useEffect, useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { fetchFeedback } from '../utils/dataFetching';
import { deleteFeedback } from '../utils/dataDeleting';

const FeedbackManagement = () => {

  const [allFeedback, setAllFeedback] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // States controling modal visibility
  const [modals, setModals] = useState({
    details: false,
    success: false,
    delete: false,
  })

  useEffect(() => {

    loadFeedback();
  }, [])

  const loadFeedback = async () => {
    try {
      const feedback = await fetchFeedback();
      setAllFeedback(feedback);
    } catch (error) {
      console.error('Error loading feedback: ', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteFeedback(selectedFeedback.id);
      await loadFeedback();
    } catch (error) {
      console.error('Error deleting feedback: ', error);
    }
  }

  // Handle course selection for editing and viewing details
  const handleItemClick = (feedback) => {
    setSelectedFeedback(feedback);          // Set the selected item
    toggleModal('details', true); // Open the details modal
  };

  // Handle modal visibility
  const toggleModal = (modalName, state) => {
    setModals((prev) => ({ ...prev, [modalName]: state })); // Change state of given modal
  }

  const filteredFeedback = allFeedback.filter(feedback =>
    feedback.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage);
  const currentItems = filteredFeedback.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);



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
        {currentItems.length > 0 ? (
          currentItems.map((feedback) => (
            <div className='feedback-management-box' onClick={() => handleItemClick(feedback)}>
              <h2>{feedback.email}</h2>
              <p>{feedback.feedback}</p>
            </div>
          ))
        ) : (
          <div className='feedback-management-box'>
            <p>No Feedback Available</p>
          </div>
        )}
      </div>

      {selectedFeedback && (
        <Modal
          isOpen={modals.details}
          onClose={() => toggleModal('details', false)}
          title={selectedFeedback.email}
          children={
            <>
              <p>{selectedFeedback.feedback}</p>

              <hr className='modal-divider' />

              <div className='modal-buttons'>
                <Button text={"Close"} action={() => toggleModal('details', false)} />
                <Button text={"Delete"} outline={true} action={() => { handleDelete(); toggleModal('details', false); toggleModal('delete', true) }} />
              </div>
            </>
          }
          isCentered={false}
        />
      )}

      {/* Page navigation controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default FeedbackManagement;
