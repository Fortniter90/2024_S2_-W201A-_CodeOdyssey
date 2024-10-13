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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from event target
    setFormData(prev => ({ ...prev, [name]: value })); // Update formData state
  };

  // Handle lesson addition and updating
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Set the lesson number for new lesson
    const lessonNumber = isEditing ? formData.number : getNextLessonNumber();
    const newLesson = { ...formData, number: lessonNumber, available: false, testCount: 0 };

    try {
      if (isEditing) {
        await updateLesson(selectedCourse.id, selectedLesson.id, newLesson);
      } else {
        await saveLesson(selectedCourse.id, newLesson);
      }

      loadLessons(); // Refresh lesson list
      toggleModal(isEditing ? 'lessonDetails' : 'add', false); // Close modal
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} lesson:`, error);
    }
  };

  const getNextLessonNumber = () => {
    return lessons.length > 0 ? Math.max(...lessons.map(lesson => lesson.number)) + 1 : 1;
  };

  // Handle lesson selection for editing and viewing details
  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    setFormData({ title: lesson.title, number: lesson.number, description: lesson.description, content: lesson.content });
    setIsEditing(true);
    toggleModal('lessonDetails', true);
  };

  // Handle lesson deletion
  const handleDelete = async () => {
    try {
      await deleteLesson(selectedCourse.id, selectedLesson.id);
      loadLessons();
      toggleModal('deleteConfirmation', false);
      toggleModal('confirmation', true);
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
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
        <div className='modal-overlay'>
          <div className='modal'>
            <input
              type="number"
              name="number" // Add name attribute
              placeholder="Lesson Number"
              value={formData.number}
              onChange={handleInputChange} // Use the simplified input handler
              required
            />
            <input
              type="text"
              name="title" // Add name attribute
              placeholder="Title"
              value={formData.title}
              onChange={handleInputChange} // Use the simplified input handler
              required
            />
            <textarea
              name="description" // Add name attribute
              placeholder="Lesson Description"
              value={formData.description}
              onChange={handleInputChange} // Use the simplified input handler
              required
            />

            {/* Dynamic Content Management */}
            {formData.content.map((item, index) => (
              <div key={index} className='content-item'>
                <select
                  value={item.type}
                  onChange={(e) => handleContentChange(index, 'type', e.target.value)}
                >
                  <option value="text">Text</option>
                  <option value="code">Code</option>
                </select>

                {item.type === 'text' && (
                  <textarea
                    placeholder="Content"
                    value={item.content}
                    onChange={(e) => handleContentChange(index, 'content', e.target.value)}
                  />
                )}

                {item.type === 'code' && (
                  <div>
                    <textarea
                      placeholder="Code Input"
                      value={item.input}
                      onChange={(e) => handleContentChange(index, 'input', e.target.value)}
                      rows={25}
                    />
                    <textarea
                      placeholder="Code Output"
                      value={item.output}
                      onChange={(e) => handleContentChange(index, 'output', e.target.value)}
                      rows={25}
                    />
                  </div>
                )}

                <button onClick={() => removeContent(index)}>Remove</button>
              </div>
            ))}

            <button onClick={addContent}>Add Content</button>

            <div className='modal-buttons'>
              <Button text="Add Lesson" action={handleSubmit} />
              <Button text="Cancel" type="outline" action={() => toggleModal('add', false)} />
            </div>
          </div>
        </div>
      )}
  
      <ManagementTable 
        items={lessons}
        onRowClick={handleLessonClick}
        renderNoItems={renderNoItems}
      />
  
      {/* Lesson information modal */}
{modals.lessonDetails && selectedLesson && (
  <>
    <div className='overlay' onClick={() => toggleModal('lessonDetails', true)} />
    <div className='information-modal'>
      <button className='authpage-close' onClick={() => toggleModal('lessonDetails', false)}>
        <FaX />
      </button>
      
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <h2>Edit Lesson</h2>
          <label>
            Title:
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Number:
            <input
              type="number"
              name="number"
              value={formData.number}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Availability:
            <select
              name="available"
              value={formData.available}
              onChange={handleInputChange}
              required
            >
              <option value="">Select Availability</option>
              <option value={true}>Available</option>
              <option value={false}>Unavailable</option>
            </select>
          </label>
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
            <Button text="Edit" action={handleSubmit} />
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
