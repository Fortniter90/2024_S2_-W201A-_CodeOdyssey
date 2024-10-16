import { useState, useEffect } from 'react';
import { FaX } from 'react-icons/fa6';
import { fetchTests } from '../utils/dataFetching';
import { saveTest, updateTest } from '../utils/dataSaving';
import { deleteTest } from '../utils/dataDeleting';
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
    hint: '',
    constraints: []
  });

  // States controling modal visibility
  const [modals, setModals] = useState({
    add: false,
    testDetails: false,
    confirmation: false,
    deleteConfirmation: false,
  })

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
      const testList = await fetchTests(selectedCourse.id, selectedLesson.id);  // Fetch list of tests
      setTests(Object.values(testList));                                        // Update the state with the fetches tests

    } catch (error) {
      console.error('Error loading courses:', error); // Log any errors during data fetching
    }
  };

  // Handle modal visibility
  const toggleModal = (modalName, state) => {
    setModals((prev) => ({ ...prev, [modalName]: state })); // Change state of given modal

    if (state == false) {
      setFormData({ number: '', question: '', answer: '', hint: '', constraints: [] }); // Reset form data
      setIsEditing(false); // Set editing mode
    }
  }

  // Handle test selection for editing and viewing details
  const handleTestClick = (course) => {
    setSelectedTest(course);  // Set the selected test
    toggleModal('testDetails', true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from event target
    setFormData(prev => ({ ...prev, [name]: value })); // Update formData state
  };

  const handleCheckboxChange = (e, constraint) => {
    const { checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      constraints: {
        ...prevData.constraints,
        [constraint]: checked
      }
    }));
  };

  // Prepare form for editing
  const handleEdit = () => {
    // Set form data for selected course
    setFormData({
      number: selectedTest.number,
      question: selectedTest.question,
      answer: selectedTest.answer,
      hint: selectedTest.hint,
      available: selectedTest.available,
      constraints: selectedTest.constraints
    });

    setIsEditing(true); // Set editing mode
  };

  // Handle course addition
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const testNumber = parseInt(formData.number, 10);
    const newTest = {
      ...formData,
      available: false
    };

    try {
      if (isEditing) {
        if (testNumber !== selectedTest.number) {
          await shiftTestNumbers(selectedTest.number, false); // Shift down
          await shiftTestNumbers(testNumber); // Shift up
        }

        await updateTest(selectedCourse.id, selectedLesson.id, selectedTest.id, newTest);
      }
      else {
        await shiftTestNumbers(testNumber);
        await saveTest(selectedCourse.id, selectedLesson.id, newTest);
      }

      toggleModal(isEditing ? 'testDetails' : 'add', false); // Close modal
      setIsEditing(false);
      loadTests(); // Refresh lesson list

    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} test:`, error);
    }
  };

  // Shift lesson numbers if a new lesson is inserted
  const shiftTestNumbers = async (newNumber, increment = true) => {
    const testsToShift = tests.filter(test => (increment ? test.number >= newNumber : test.number > newNumber));

    // Update each lesson number individually
    for (const test of testsToShift) {
      const currentNumber = parseInt(test.number, 10);
      const updatedTestData = {
        ...test,
        number: increment ? currentNumber + 1 : currentNumber - 1
      };

      try {
        await updateTest(selectedCourse.id, selectedLesson.id, selectedTest.id, updatedTestData);
      } catch (error) {
        console.error('Error shifting lesson number:', error);
      }
    }
  };

  // Handle lesson deletion
  const handleDelete = async () => {
    try {
      await deleteTest(selectedCourse.id, selectedLesson.id, selectedTest.id);

      toggleModal('deleteConfirmation', false); // Close delete confirmation modal
      toggleModal('testDetails', false);      // Close lesson details
      loadTests();                            // Refresh lesson list after deletion
      toggleModal('confirmation', true);        // Show success confirmation

    } catch (error) {
      console.error('Error deleting test:', error); // Log any errors during deletion
    }
  };



  // Render message if no courses are available
  const renderNoItems = () => <div>No tests available.</div>;

  return (
    <div className='management roboto-regular'>
      {/* Header section */}
      <div className='management-header'>
        <h1 className='fira-code'>{selectedLesson.number}. {selectedLesson.title}</h1>
        <Button text={'Add Test'} action={() => toggleModal('add', true)} />
      </div>

      {/* Add Test Modal */}
      {modals.add && (
        <>
          <div className='overlay' onClick={() => toggleModal('add', false)} />
          <div className='modal'>
            <div className='modal-content'>
              <button className='authpage-close' onClick={() => toggleModal('add', false)}><FaX /></button>
              <h2>Add Test</h2>

              <form onSubmit={handleSubmit}>
                <div className='form-group'>
                  <label>Test Number:</label>
                  <input type="number" name="number" value={formData.number} onChange={handleInputChange} required />
                </div>
                <div className='form-group'>
                  <label>Question:</label>
                  <input type="text" name="question" value={formData.question} onChange={handleInputChange} required />
                </div>
                <div className='form-group'>
                  <label>Answer:</label>
                  <input type="text" name="answer" value={formData.answer} onChange={handleInputChange} required />
                </div>
                <div className='form-group'>
                  <label>Hint:</label>
                  <input type="text" name="hint" value={formData.hint} onChange={handleInputChange} />
                </div>
                <div className='form-group'>
                  <label>
                    <input type="checkbox" name="constraints-print" checked={formData.constraints?.print || false} onChange={(e) => handleCheckboxChange(e, 'print')} />
                    Print Constraint
                  </label>
                </div>
                <div className='form-group'>
                  <label>
                    <input type="checkbox" name="constraints-loop" checked={formData.constraints?.loop || false} onChange={(e) => handleCheckboxChange(e, 'loop')} />
                    Loop Constraint
                  </label>
                </div>

                <div className='modal-buttons'>
                  <Button type="submit" text="Add Test" />
                  <Button text="Cancel" outline={true} action={() => toggleModal('add', false)} />
                </div>
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
      {modals.testDetails && selectedTest && (
        <>
          <div className='overlay' onClick={() => toggleModal('testDetails', false)} />
          <div className='information-modal'>
            <h2>Edit Test</h2>
            <button className='authpage-close' onClick={() => toggleModal('testDetails', false)}><FaX /></button>

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <h2>Edit Test</h2>

                <div className='form-group'>
                  <label>Test Number:</label>
                  <input type="number" name="number" value={formData.number} onChange={handleInputChange} required />
                </div>
                <div className='form-group'>
                  <label>Question:</label>
                  <input type="text" name="question" value={formData.question} onChange={handleInputChange} required />
                </div>
                <div className='form-group'>
                  <label>Answer:</label>
                  <input type="text" name="answer" value={formData.answer} onChange={handleInputChange} required />
                </div>
                <div className='form-group'>
                  <label>Hint:</label>
                  <input type="text" name="hint" value={formData.hint} onChange={handleInputChange} />
                </div>
                <div className='form-group'>
                  <label>
                    <input type="checkbox" name="constraints-print" checked={formData.constraints?.print || false} onChange={(e) => handleCheckboxChange(e, 'print')} />
                    Print Constraint
                  </label>
                </div>
                <div className='form-group'>
                  <label>
                    <input type="checkbox" name="constraints-loop" checked={formData.constraints?.loop || false} onChange={(e) => handleCheckboxChange(e, 'loop')} />
                    Loop Constraint
                  </label>
                </div>

                <div className='modal-buttons'>
                  <Button type="submit" text="Update Test" />
                  <Button text="Cancel" outline={true} action={() => setIsEditing(false)} />
                </div>
              </form>
            ) : (
              <>
                <h1>{selectedTest.title}</h1>
                <div className='row-availability-edit'>
                  <span className={`availability-tag ${selectedTest.available ? "available" : "unavailable"}`}>
                    {selectedTest.available ? "Available" : "Unavailable"}
                  </span>
                  <Button text="Edit" action={handleEdit} />
                </div>
                <div className='row-lesson-test'>
                  <p><strong>Number:</strong> {selectedTest.number}</p>
                  <p><strong>Question:</strong> {selectedTest.question}</p>
                  <p><strong>Answer:</strong> {selectedTest.answer}</p>
                  <p><strong>Hint:</strong> {selectedTest.hint}</p>
                </div>
                <hr className='modal-divider' />
                <div className='modal-buttons'>
                  <Button text="Delete" outline={true} action={() => toggleModal('deleteConfirmation', true)} />
                </div>
              </>
            )}
          </div>
        </>
      )}

      {/* Confirmation Modal */}
      {modals.confirmation && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>Success</h2>
            <p>Operation completed successfully!</p>
            <Button onClick={() => toggleModal('confirmation', false)} text="Close" />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modals.deleteConfirmation && (
        <div className='modal'>
          <div className='modal-content'>
            <h2>Delete Test</h2>
            <p>Are you sure you want to delete this test?</p>
            <Button text="Yes, Delete" onClick={handleDelete} />
            <Button text="Cancel" onClick={() => toggleModal('deleteConfirmation', false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TestManagement;
