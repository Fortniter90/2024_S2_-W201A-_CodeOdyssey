import React, { useState, useEffect } from 'react';
import Button from './Button';
import './DatabaseManagement.css';
import { FaMagnifyingGlass, FaX } from 'react-icons/fa6';
import { fetchLessons } from '../utils/dataFetching';
import ManagementTable from './ManagementTable';

const LessonManagement = ({ selectedCourse, onSelectLesson }) => {
  // State for lessons
  const [lessons, setLessons] = useState([]);
  
  // State for adding lesson information
  const [formData, setFormData] = useState({
    title: '',
    number: '',
    available: true,
    content: [] // Array to hold content objects
  });

  // States managing modal visibility
  const [modalActive, setModalActive] = useState(false); // Manage visibility of the modal for adding lessons
  const [lessonModalActive, setLessonModalActive] = useState(false); // Manage lesson details modal
  const [selectedLesson, setSelectedLesson] = useState(null); // Store the selected lesson for the details modal

  // Fetch lessons when the component mounts
  useEffect(() => {
    loadLessons();
  }, [selectedCourse]);

  // Fetch all lessons for the course
  const loadLessons = async () => {
    try {
      const lessonList = await fetchLessons(selectedCourse.id);
      setLessons(Object.values(lessonList));
    } catch (error) {
      console.error('Error loading lessons:', error);
    }
  };
  
  // Handle opening the "Add Lesson" modal
  const handleAdd = () => {
    setModalActive(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission to add a new lesson
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("New lesson data", formData);
    // Implement your add lesson logic here
    setModalActive(false);
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    setLessonModalActive(true);
  };

  const handleDelete = () => {
    console.log("delete lesson");
  };

  const handleEdit = () => {
    console.log("edit lesson");
  };

  // Render no items message
  const renderNoItems = () => <div>No lessons available.</div>;

  return (
    <div className='management roboto-regular'>
      {/* Header section */}
      <div className='management-header'>
        <h1 className='fira-code'>{selectedCourse.title}</h1>
        <Button onClick={handleAdd} text="Add Lesson" />
      </div>

      {/* Modal displaying the information about the lesson */}
      {lessonModalActive && selectedLesson && (
        <>
          <div className='overlay' onClick={() => setLessonModalActive(false)} />
          <div className='information-modal'>
            <button className='authpage-close' onClick={() => setLessonModalActive(false)}><FaX /></button>
            <h1>{selectedLesson.title}</h1>
            <div>
              <p><strong>Number:</strong> {selectedLesson.number}</p>
              <p><strong>Description:</strong> {selectedLesson.description}</p>
              <p><strong>Availability:</strong> {selectedLesson.available ? "Available" : "Unavailable"}</p>
              <p><strong>Tests Count:</strong> {selectedLesson.testCount}</p>
            </div>
            <div className='modal-buttons'>
              <Button text="Manage Lesson Content" action={() => onSelectLesson(selectedLesson)} />
              <Button text="Edit" action={handleEdit} />
              <Button text="Delete" action={handleDelete} outline={true} />
            </div>
          </div>
        </>
      )}

      <ManagementTable 
        items={lessons}
        onRowClick={handleLessonClick}
        renderNoItems={renderNoItems}
      />

      {/* Modal for adding new lesson */}
      {modalActive && (
        <>
          <div className='overlay' onClick={() => setModalActive(false)} />
          <div className='add-lesson-modal'>
            <button className='authpage-close' onClick={() => setModalActive(false)}><FaX /></button>
            <h2>Add New Lesson</h2>
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="title" 
                placeholder="Title" 
                value={formData.title} 
                onChange={handleInputChange} 
                required 
              />
              <input 
                type="number" 
                name="number" 
                placeholder="Lesson Number" 
                value={formData.number} 
                onChange={handleInputChange} 
                required 
              />
              <label>
                <input 
                  type="checkbox" 
                  name="available" 
                  checked={formData.available} 
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })} 
                />
                Available
              </label>
              {/* Content management */}
              <div>
                <h3>Content:</h3>
                {/* Here you can render the content inputs based on the types: code and text */}
                {/* Example of adding content dynamically (you would need to implement add/remove logic) */}
                {formData.content.map((item, index) => (
                  <div key={index}>
                    <select onChange={(e) => {/* Handle content type change */}}>
                      <option value="text">Text</option>
                      <option value="code">Code</option>
                    </select>
                    {/* Add fields for content based on type */}
                    {item.type === 'text' ? (
                      <input 
                        type="text" 
                        placeholder="Text Content" 
                        value={item.content} 
                        onChange={(e) => {/* Update content logic */}} 
                      />
                    ) : (
                      <>
                        <input 
                          type="text" 
                          placeholder="Input String" 
                          value={item.input} 
                          onChange={(e) => {/* Update input logic */}} 
                        />
                        <input 
                          type="text" 
                          placeholder="Output String" 
                          value={item.output} 
                          onChange={(e) => {/* Update output logic */}} 
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
              <button type="submit">Add Lesson</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default LessonManagement;
