import { useState, useEffect } from 'react';
import { FaX } from 'react-icons/fa6';
import { fetchTests } from '../utils/DataFetching';
import { saveTest, updateTest } from '../utils/DataSaving';
import { deleteTest } from '../utils/DataDeleting';
import ManagementTable from './ManagementTable';
import Button from './Button';
import './DatabaseManagement.css';



// Component to manage test data
const TestManagement = ({ selectedCourse, selectedLesson }) => {
  
  // States handling course data
  const [tests, setTests] = useState([]);   // List of tests
  const [formData, setFormData] = useState({    // Data for adding and editing test data
    number: '',
    question: '',
    answer: '',
    hint: ''
  });

  // States controling modal visibility
  const [addModalActive, setAddModalActive] = useState(false);                                // Add test
  const [testModalActive, setTestModalActive] = useState(false);                          // Test details
  const [confirmationModalActive, setConfirmationModalActive] = useState(false);              // Success confirmation
  const [deleteConfirmationModalActive, setDeleteConfirmationModalActive] = useState(false);  // Delete confirmation

  // States controling test status
  const [selectedTest, setSelectedTest] = useState(null);   // Stores selected test
  const [isEditing, setIsEditing] = useState(false);        // Indicates if test is in edit mode


  
  // Load tests component on mount
  useEffect(() => {
    loadTests();
  }, [selectedCourse, selectedLesson]);

  // Fetch all of the tests for the lesson
  const loadTests = async () => {
    try {
      const testList = await fetchTests(selectedCourse.id, selectedLesson.id);
      setTests(Object.values(testList));

    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from event target
    setFormData(prev => ({ ...prev, [name]: value })); // Update formData state
  };
  
  // Handle course addition
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const newTest = {
      ...formData,
      available: false
    };

    try {
      await saveTest(selectedCourse.id, selectedLesson.id, newTest);  // Save the new course
      setAddModalActive(false);     // Close the add course modal

      setFormData({ number: '', question: '', answer: '', hint: '' }); // Reset form data
      loadTests() // Refresh tests list
      
    } catch (error) {
      console.error('Error adding test:', error); // Log any errors during course addition
    }
  };

  // Handle test selection for editing and viewing details
  const handleTestClick = (course) => {
    setSelectedTest(course);  // Set the selected test
    setTestModalActive(true); // Open the test details modal
  };

  // Handle course deletion
  const handleDelete = async () => {
    try {
      await deleteTest(selectedCourse.id, selectedLesson.id, selectedTest.id);    // Delete the selected course
      setDeleteConfirmationModalActive(false);  // Close delete confirmation modal
      setTestModalActive(false);              // Close course details
      setConfirmationModalActive(true);         // Show success confirmation
      loadTests();                            // Refresh course list after deletion

    } catch (error) {
      console.error('Error deleting course:', error); // Log any errors during deletion
    }
  };

  // Prepare form for editing
  const handleEdit = () => {
    // Set form data for selected course
    setFormData({ 
      number: selectedTest.number,
      question: selectedTest.question,
      answer: selectedTest.answer,
      hint: selectedTest.hint,
      available: selectedTest.available
    });
    setIsEditing(true); // Set editing mode
  };
  
  // Handle course update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    const updatedTest = {
      ...formData,
    };
  
    try {
      await updateTest(selectedCourse.id, selectedLesson.id, selectedTest.id, updatedTest); // Update course with new data
      setTestModalActive(false);      // Close course details modal
      setIsEditing(false);              // Exit editing mode
      setSelectedTest(null);          // Clear selected course
      loadTests();                    // Refresh course list                    
      setConfirmationModalActive(true); // Show success confirmation modal

    } catch (error) {
      console.error('Error updating test:', error); // Log any errors during update
    }
  };



  // Render message if no courses are available
  const renderNoItems = () => <div>No tests available.</div>;

  return (
    <div className='management roboto-regular'>
      {/* Header section */}
      <div className='management-header'>
        <h1 className='fira-code'>{selectedLesson.number}. {selectedLesson.title}</h1>
        <Button text={'Add Test'} action={() => setAddModalActive(true)} />
      </div>
  
      {/* Add Test Modal */}
      {addModalActive && (
        <>
          <div className='overlay' onClick={() => setAddModalActive(false)} />
        <div className='modal'>
          <div className='modal-content'>
          <button className='authpage-close' onClick={() => setAddModalActive(false)}><FaX /></button>
            <h2>Add Test</h2>
            <form onSubmit={handleSubmit}>
              <input 
                type='text' 
                name='number' 
                placeholder='Test Number' 
                value={formData.number} 
                onChange={handleInputChange} 
                required 
              />
              <input 
                type='text' 
                name='question' 
                placeholder='Question' 
                value={formData.question} 
                onChange={handleInputChange} 
                required 
              />
              <input 
                type='text' 
                name='answer' 
                placeholder='Answer' 
                value={formData.answer} 
                onChange={handleInputChange} 
                required 
              />
              <input 
                type='text' 
                name='hint' 
                placeholder='Hint' 
                value={formData.hint} 
                onChange={handleInputChange} 
              />
              <Button type="submit" text="Save Test" />
            </form>
          </div>
        </div>
        </>
      )}
  
      <ManagementTable
        items={tests}
        onRowClick={handleTestClick}
        renderNoItems={renderNoItems}
      />
  
      {/* Edit Test Modal */}
      {testModalActive && selectedTest && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>Edit Test</h2>
            <button className='close-modal' onClick={() => setTestModalActive(false)}>
              <FaX />
            </button>
            <form onSubmit={handleUpdateSubmit}>
              <input 
                type='text' 
                name='number' 
                placeholder='Test Number' 
                value={formData.number} 
                onChange={handleInputChange} 
                required 
              />
              <input 
                type='text' 
                name='question' 
                placeholder='Question' 
                value={formData.question} 
                onChange={handleInputChange} 
                required 
              />
              <input 
                type='text' 
                name='answer' 
                placeholder='Answer' 
                value={formData.answer} 
                onChange={handleInputChange} 
                required 
              />
              <input 
                type='text' 
                name='hint' 
                placeholder='Hint' 
                value={formData.hint} 
                onChange={handleInputChange} 
              />
              <Button type="submit" text="Update Test" />
            </form>
            <Button text="Delete Test" onClick={() => setDeleteConfirmationModalActive(true)} />
          </div>
        </div>
      )}
  
      {/* Confirmation Modal */}
      {confirmationModalActive && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>Success</h2>
            <p>Operation completed successfully!</p>
            <Button onClick={() => setConfirmationModalActive(false)} text="Close" />
          </div>
        </div>
      )}
  
      {/* Delete Confirmation Modal */}
      {deleteConfirmationModalActive && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>Delete Test</h2>
            <p>Are you sure you want to delete this test?</p>
            <Button text="Yes, Delete" onClick={handleDelete} />
            <Button text="Cancel" onClick={() => setDeleteConfirmationModalActive(false)} />
          </div>
        </div>
      )}
    </div>
  );  
};

export default TestManagement;
