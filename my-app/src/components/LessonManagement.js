import { useState, useEffect } from 'react';
import { FaX } from 'react-icons/fa6';
import { fetchLessons } from '../utils/DataFetching';
import { saveLesson, updateLesson } from '../utils/DataSaving';
import { deleteLesson } from '../utils/DataDeleting';
import ManagementTable from './ManagementTable';
import Button from './Button';
import './DatabaseManagement.css';



// Component to manage lesson data
const LessonManagement = ({ selectedCourse, onSelectLesson }) => {

  // States handling lesson data
  const [lessons, setLessons] = useState([]);   // List of lessons
  const [formData, setFormData] = useState({    // Data for adding and editing lesson data
    title: '',
    number: '',
    description: '',
    content: []
  });

  // States controling modal visibility
  const [modals, setModals] = useState({
    add: false,
    lessonDetails: false,
    confirmation: false,
    deleteConfirmation: false,
  })
  
  const [selectedLesson, setSelectedLesson] = useState(null);   // Stores selected lesson
  const [isEditing, setIsEditing] = useState(false);            // Indicates if lesson is in edit mode



  // Fetch lessons when the component mounts
  useEffect(() => {
    loadLessons();
  }, [selectedCourse]);

  // Fetch all lessons for the course
  const loadLessons = async () => {
    try {
      const lessonList = await fetchLessons(selectedCourse.id);   // Fetch list of lessons
      setLessons(Object.values(lessonList));                      // Update the state with the fetched lessons

    } catch (error) {
      console.error('Error loading lessons:', error); // Log any errors during data fetching
    }
  };
  
  // Handle modal visibility
  const toggleModal = (modalName, state) => {
    setModals((prev) => ({ ...prev, [modalName]: state })); // Change state of given modal

    if (state == false) {
      setFormData({ title: '', number: '', description: '', content: [] }); // Reset form data
      setIsEditing(false); // Set editing mode
    }
  }

  // Handle lesson selection for editing and viewing details
  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    toggleModal('lessonDetails', true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from event target
    setFormData(prev => ({ ...prev, [name]: value })); // Update formData state
  };

  const addContent = () => {
    setFormData(prev => ({
      ...prev,
      content: [...prev.content, { type: 'text', content: '' }]
    }));
  };

  const removeContent = (index) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index)
    }));
  };

  const handleContentChange = (index, field, value) => {
    const newContent = [...formData.content];
    newContent[index] = { ...newContent[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
  };

  // Prepare form for editing
  const handleEdit = () => {
    // Set form data for selected course
    setFormData({ 
      title: selectedLesson.title, 
      number: selectedLesson.number, 
      description: selectedLesson.description, 
      content: selectedLesson.content 
    });

    setIsEditing(true); // Set editing mode
  };

  // Handle lesson addition and updating
  const handleSubmit = async (e) => {
    e.preventDefault();

    const lessonNumber = parseInt(formData.number, 10);
    const newLesson = { 
      ...formData,
      testCount: isEditing ? selectedCourse.testCount : 0,    // Keep original test count
      available: false
    };

    try {
      if (isEditing) {
        if (lessonNumber !== selectedLesson.number) {
          await shiftLessonNumbers(selectedLesson.number, false); // Shift down
          await shiftLessonNumbers(lessonNumber); // Shift up
        }

        await updateLesson(selectedCourse.id, selectedLesson.id, newLesson);
      } 
      else {
        await shiftLessonNumbers(lessonNumber);
        await saveLesson(selectedCourse.id, newLesson);
      }

      toggleModal(isEditing ? 'lessonDetails' : 'add', false); // Close modal
      setIsEditing(false);
      loadLessons(); // Refresh lesson list

    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} lesson:`, error);
    }
  };

  // Shift lesson numbers if a new lesson is inserted
  const shiftLessonNumbers = async (newNumber, increment = true) => {
    const lessonsToShift = lessons.filter(lesson => (increment ? lesson.number >= newNumber : lesson.number > newNumber));

    // Update each lesson number individually
    for (const lesson of lessonsToShift) {
      const currentNumber = parseInt(lesson.number, 10);
      const updatedLessonData = { 
        ...lesson, 
        number: increment ? currentNumber + 1 : currentNumber - 1 
      };

      try {
        await updateLesson(selectedCourse.id, lesson.id, updatedLessonData);
      } catch (error) {
        console.error('Error shifting lesson number:', error);
      }
    }
  };

  // Get the next lesson number in the sequence
  const getNextLessonNumber = () => {
    if (lessons.length === 0) {
      return 1; 
    }

    const lastLesson = lessons.reduce((prev, current) => (prev.number > current.number ? prev : current));
    return lastLesson.number + 1;
  };  

  // Handle lesson deletion
  const handleDelete = async () => {
    try {
      await deleteLesson(selectedCourse.id, selectedLesson.id);
      
      toggleModal('deleteConfirmation', false); // Close delete confirmation modal
      toggleModal('lessonDetails', false);      // Close lesson details
      loadLessons();                            // Refresh lesson list after deletion
      toggleModal('confirmation', true);        // Show success confirmation

    } catch (error) {
      console.error('Error deleting lesson:', error); // Log any errors during deletion
    }
  };
  


  // Render message if no lessons are available
  const renderNoItems = () => <div>No lessons available.</div>;

  return (
    <div className='management roboto-regular'>
      {/* Header section */}
      <div className='management-header'>
        <h1 className='fira-code'>{selectedCourse.title}</h1>
        <Button text="Add Lesson" action={() => toggleModal('add', true)} />
      </div>
  
      {/* Modal for adding new lesson */}
      {modals.add && (
        <>
          <div className='overlay' onClick={() => toggleModal('add', false)} />
          <div className='modal'>
            <button className='authpage-close' onClick={() => toggleModal('add', false)}><FaX /></button>
            <h2>Add New Lesson</h2>

            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label>Lesson Number:</label>
                <input type="number" name="number" value={formData.number} onChange={handleInputChange} required />
              </div>
              <div className='form-group'>
                <label>Title:</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className='form-group'>
                <label>Description:</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required />
              </div>

              {/* Dynamic Content Management */}
              <div className='form-group'>
                <label>Content:</label>
                {formData.content.map((item, index) => (
                  <div key={index} className='content-item'>
                    <div className='form-group'>
                      <select
                        value={item.type}
                        onChange={(e) => handleContentChange(index, 'type', e.target.value)}
                      >
                        <option value="text">Text</option>
                        <option value="code">Code</option>
                      </select>
                    </div>

                    {item.type === 'text' && (
                      <div className='form-group'>
                        <textarea
                          placeholder="Content"
                          value={item.content}
                          onChange={(e) => handleContentChange(index, 'content', e.target.value)}
                        />
                      </div>
                    )}

                    {item.type === 'code' && (
                      <div className='form-group'>
                        <textarea
                          placeholder="Code Input"
                          value={item.input}
                          onChange={(e) => handleContentChange(index, 'input', e.target.value)}
                          rows={10}
                        />
                        <textarea
                          placeholder="Code Output"
                          value={item.output}
                          onChange={(e) => handleContentChange(index, 'output', e.target.value)}
                          rows={10}
                        />
                      </div>
                    )}
                    <button onClick={() => removeContent(index)}>Remove</button>
                  </div>
                ))}
                <button type="button" onClick={addContent}>Add Content</button>
              </div>

              <div className='modal-buttons'>
                <Button type="submit" text="Add Lesson" />
                <Button text="Cancel" outline={true} action={() => toggleModal('add', false)} />
              </div>
            </form>
          </div>
        </>
      )}
  
      <ManagementTable 
        items={lessons}
        onRowClick={handleLessonClick}
        renderNoItems={renderNoItems}
      />
  
      {/* Lesson information modal */}
      {modals.lessonDetails && selectedLesson && (
        <>
          <div className='overlay' onClick={() => toggleModal('lessonDetails', false)} />
          <div className='information-modal'>
            <button className='authpage-close' onClick={() => toggleModal('lessonDetails', false)}><FaX /></button>
            
            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <h2>Edit Lesson</h2>
                
                <div className='form-group'>
                  <label>Lesson Number:</label>
                  <input type="number" name="number" value={formData.number} onChange={handleInputChange} required />
                </div>
                <div className='form-group'>
                  <label>Title:</label>
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div className='form-group'>
                  <label>Availability:</label>
                  <select name="available" value={formData.available} onChange={handleInputChange} required>
                    <option value="">Select Availability</option>
                    <option value={true}>Available</option>
                    <option value={false}>Unavailable</option>
                  </select>
                </div>
                <div className='form-group'>
                  <label>Description:</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} required />
                </div>

                {/* Dynamic Content Management */}
                <div className='form-group'>
                  <label>Content:</label>
                  {formData.content.map((item, index) => (
                    <div key={index} className='content-item'>
                      <div className='form-group'>
                        <select
                          value={item.type}
                          onChange={(e) => handleContentChange(index, 'type', e.target.value)}
                        >
                          <option value="text">Text</option>
                          <option value="code">Code</option>
                        </select>
                      </div>

                      {item.type === 'text' && (
                        <div className='form-group'>
                          <textarea
                            placeholder="Content"
                            value={item.content}
                            onChange={(e) => handleContentChange(index, 'content', e.target.value)}
                          />
                        </div>
                      )}

                      {item.type === 'code' && (
                        <div className='form-group'>
                          <textarea
                            placeholder="Code Input"
                            value={item.input}
                            onChange={(e) => handleContentChange(index, 'input', e.target.value)}
                            rows={10}
                          />
                          <textarea
                            placeholder="Code Output"
                            value={item.output}
                            onChange={(e) => handleContentChange(index, 'output', e.target.value)}
                            rows={10}
                          />
                        </div>
                      )}
                      <button onClick={() => removeContent(index)}>Remove</button>
                    </div>
                  ))}
                  <button type="button" onClick={addContent}>Add Content</button>
                </div>

                <div className='modal-buttons'>
                  <Button type="submit" text="Update Lesson" />
                  <Button text="Cancel" outline={true} action={() => setIsEditing(false)} />
                </div>
              </form>
            ) : (
              <>
                <h1>{selectedLesson.title}</h1>
                <div className='row-availability-edit'>
                  <span className={`availability-tag ${selectedLesson.available ? "available" : "unavailable"}`}>
                    {selectedLesson.available ? "Available" : "Unavailable"}
                  </span>
                  <Button text="Edit" action={handleEdit} />
                </div>
                <div className='row-lesson-test'>
                  <p><strong>Number:</strong> {selectedLesson.number}</p>
                  <p><strong>Description:</strong> {selectedLesson.description}</p>
                  <p><strong>Tests Count:</strong> {selectedLesson.testCount}</p>
                </div>
                <hr className='modal-divider' />
                <div className='modal-buttons'>
                  <Button text="Manage Lesson Content" action={() => onSelectLesson(selectedLesson)} />
                  <Button text="Delete" outline={true} action={() => toggleModal('deleteConfirmation', true)} />
                </div>
              </>
            )}
          </div>
        </>
      )}

  
      {/* Success Confirmation Modal */}
      {modals.confirmation && (
        <>
          <div className='overlay' onClick={() => toggleModal('confirmation', false)} />
          <div className='modal'>
            <button className='authpage-close' onClick={() => toggleModal('confirmation', false)}><FaX /></button>
            <h2>Success!</h2>
            <p>Action completed successfully.</p>
            <Button text="Close" action={() => toggleModal('confirmation', false)} />
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {modals.deleteConfirmation && (
        <>
          <div className='overlay' onClick={() => toggleModal('deleteConfirmation', false)} />
          <div className='modal'>
            <button className='authpage-close' onClick={() => toggleModal('deleteConfirmation', false)}><FaX /></button>
            <h2>Delete Course</h2>
            <p>Are you sure you want to delete this lesson?</p>
            <div className='modal-buttons'>
              <Button text="Delete" action={handleDelete} />
              <Button text="Cancel" outline={true} action={() => toggleModal('deleteConfirmation', false)} />
            </div>
          </div>
        </>
      )}
    </div>
  );  
};

export default LessonManagement;
