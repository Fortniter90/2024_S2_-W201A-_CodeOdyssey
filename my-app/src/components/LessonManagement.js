import { useState, useEffect } from 'react';
import { FaX } from 'react-icons/fa6';
import { fetchLessons } from '../utils/dataFetching';
import { saveLesson, updateLesson } from '../utils/dataSaving';
import { deleteLesson } from '../utils/dataDeleting';
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
  const [addModalActive, setAddModalActive] = useState(false);                                // Add course
  const [lessonModalActive, setLessonModalActive] = useState(false);                          // Lesson details
  const [confirmationModalActive, setConfirmationModalActive] = useState(false);              // Success confirmation
  const [deleteConfirmationModalActive, setDeleteConfirmationModalActive] = useState(false);  // Delete confirmation

  // States controling course status
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from event target
    setFormData(prev => ({ ...prev, [name]: value })); // Update formData state
  };

  // Handle lesson addition
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const newLesson = {
      ...formData,
      available: false,
      testCount: 0
    };

    try {
      await saveLesson(selectedCourse.id, newLesson);  // Save the new lesson
      setAddModalActive(false);     // Close the add lesson modal

      setFormData({ title: '', number: '', description: '', content: [] }); // Reset form data
      loadLessons() // Refresh lessons list
      
    } catch (error) {
      console.error('Error adding lesson:', error); // Log any errors during course addition
    }
  };

  // Handle lesson selection for editing and viewing details
  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    setLessonModalActive(true);
  };

  // Handle course deletion
  const handleDelete = async () => {
    try {
      await deleteLesson(selectedCourse.id, selectedLesson.id);    // Delete the selected lesson
      setDeleteConfirmationModalActive(false);  // Close delete confirmation modal
      setLessonModalActive(false);              // Close lesson details
      setConfirmationModalActive(true);         // Show success confirmation
      loadLessons();                            // Refresh lesson list after deletion

    } catch (error) {
      console.error('Error deleting lesson:', error); // Log any errors during deletion
    }
  };

  // Prepare form for editing
  const handleEdit = () => {
    // Set form data for selected lesson
    setFormData({ 
      title: selectedLesson.title,
      number: selectedLesson.number,
      description: selectedLesson.description,
      content: selectedLesson.content,
      available: selectedLesson.available
    });
    setIsEditing(true); // Set editing mode
  };
  
  // Handle lesson update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    const updatedCourse = {
      ...formData,
      testCount: selectedLesson.testCount       // Keep original test count
    };
  
    try {
      await updateLesson(selectedCourse.id, selectedLesson.id, updateLesson); // Update lesson with new data
      setLessonModalActive(false);      // Close lesson details modal
      setIsEditing(false);              // Exit editing mode
      setSelectedLesson(null);          // Clear selected lesson
      loadLessons();                    // Refresh lesson list                    
      setConfirmationModalActive(true); // Show success confirmation modal

    } catch (error) {
      console.error('Error updating lesson:', error); // Log any errors during update
    }
  };
  

  const addContent = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      content: [...prevFormData.content, { type: 'text', content: '' }]
    }));
  };
  
  const removeContent = (index) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      content: prevFormData.content.filter((_, i) => i !== index)
    }));
  };
  
  const handleContentChange = (index, field, value) => {
    const newContent = [...formData.content];
    newContent[index] = { ...newContent[index], [field]: value };
    setFormData(prevFormData => ({
      ...prevFormData,
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
        <Button text="Add Lesson" action={() => setAddModalActive(true)} />
      </div>
  
      {/* Modal for adding new lesson */}
      {addModalActive && (
        <div className='modal-overlay'>
          <div className='modal'>
            <input
              type="number"
              placeholder="Lesson Number"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Lesson Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              <Button text="Cancel" type="outline" action={() => setAddModalActive(false)} />
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
{lessonModalActive && selectedLesson && (
  <>
    <div className='overlay' onClick={() => setLessonModalActive(false)} />
    <div className='information-modal'>
      <button className='authpage-close' onClick={() => setLessonModalActive(false)}>
        <FaX />
      </button>
      
      {isEditing ? (
        <form onSubmit={handleUpdateSubmit}>
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
            <Button text="Delete" outline={true} action={() => setDeleteConfirmationModalActive(true)} />
          </div>
        </>
      )}
    </div>
  </>
)}

  
      {/* Confirmation modal after course add or delete */}
      {confirmationModalActive && (
        <>
          <div className='overlay' onClick={() => setConfirmationModalActive(false)} />
          <div className='modal'>
            <button className='authpage-close' onClick={() => setConfirmationModalActive(false)}><FaX /></button>
            <h2>Success!</h2>
            <p>Action completed successfully.</p>
            <Button text="Close" action={() => setConfirmationModalActive(false)} />
          </div>
        </>
      )}
  
      {/* Delete confirmation modal */}
      {deleteConfirmationModalActive && (
        <>
          <div className='overlay' onClick={() => setDeleteConfirmationModalActive(false)} />
          <div className='modal'>
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this lesson?</p>
            <div className='modal-buttons'>
              <Button text="Delete" action={handleDelete} />
              <Button text="Cancel" outline={true} action={() => setDeleteConfirmationModalActive(false)} />
            </div>
          </div>
        </>
      )}
    </div>
  );  
};

export default LessonManagement;
