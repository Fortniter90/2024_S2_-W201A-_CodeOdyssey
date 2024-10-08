import React, { useState, useEffect } from 'react';
import { FaX } from 'react-icons/fa6';
import { fetchCourses } from '../utils/dataFetching';
import { saveCourse } from '../utils/dataSaving';
import Button from './Button';
import './DatabaseManagement.css';
import ManagementTable from './ManagementTable';

// CourseManagement Component
const CourseManagement = ({ onSelectCourse }) => {
  // State for courses
  const [courses, setCourses] = useState([]);

  // State for adding course information
  const [formData, setFormData] = useState({
    title: '',
    color: '',
    description: ''
  });

  // States managing modal and dropdown visibility
  const [modalActive, setModalActive] = useState(false); // Manage visibility of the modal for adding courses
  const [courseModalActive, setCourseModalActive] = useState(false); // Manage course details modal
  const [selectedCourse, setSelectedCourse] = useState(null); // Store the selected course for the details modal

  // States for editing course information
  const [isEditing, setIsEditing] = useState(false); // State to toggle between view and edit mode
  const [editableCourse, setEditableCourse] = useState(selectedCourse || {}); // State for the editable fields

  // Fetch all courses
  const loadCourses = async () => {
    try {
      const courseList = await fetchCourses();
      setCourses(Object.values(courseList)); // Adjust based on fetchCourses return type
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  // Fetch courses when the component mounts
  useEffect(() => {
    loadCourses();
  }, []);

  // Handle opening the "Add Course" modal
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

  // Handle form submission to add a new course
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the course data
    const newCourse = {
      ...formData, // All user-input data from the form
      available: false,
      lessonCount: 0,
      testCount: 0
    };

    try {
      // Call the saveCourse function to add the new course to Firestore
      await saveCourse(newCourse);
      setModalActive(false);
      setFormData({ title: '', color: '', description: '' }); // Reset form data
      loadCourses(); // Reload the courses after adding
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setCourseModalActive(true);
  };

  const handleDelete = () => {
    console.log("delete course");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Render no items message
  const renderNoItems = () => <div>No courses available.</div>;

  return (
    <div className='management roboto-regular'>
      {/* Header for management */}
      <div className='management-header'>
        <h1 className='fira-code'>Course Management</h1>
        <Button text={'Add Course'} action={handleAdd} />
      </div>

      {/* Modal for adding a new course */}
      {modalActive && (
        <>
          <div className='overlay' onClick={() => setModalActive(false)} />
          <div className='modal'>
            <button className='authpage-close' onClick={() => setModalActive(false)}><FaX /></button>
            <h2>Add New Course</h2>
            <div className='modal-context'>
              <form onSubmit={handleSubmit}>
                <label>
                  Title:
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                </label>
                <label>
                  Color:
                  <select name="color" value={formData.color} onChange={handleInputChange} required>
                    <option value="">Select Color</option>
                    <option value="orange">Orange</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                  </select>
                </label>
                <label>
                  Description:
                  <textarea name="description" value={formData.description} onChange={handleInputChange} required />
                </label>
                <div className='modal-buttons'>
                  <Button type="submit" text="Add Course" />
                  <Button text="Cancel" outline={true} action={() => setModalActive(false)} />
                </div>
              </form>
            </div>
          </div>
        </>
      )}

      <ManagementTable 
        items={courses}
        onRowClick={handleCourseClick}
        renderNoItems={renderNoItems}
      />

      {/* Modal displaying the information about the course */}
      {courseModalActive && selectedCourse && (
        <>
          <div className='overlay' onClick={() => setCourseModalActive(false)} />
          <div className='information-modal'>
            <button className='authpage-close' onClick={() => setCourseModalActive(false)}><FaX /></button>
            <h1>{selectedCourse.title}</h1>

            {/* Row with availability tag and Edit button */}
            <div className='row-availability-edit'>
              <span className={`availability-tag ${selectedCourse.available ? "available" : "unavailable"}`}>
                {selectedCourse.available ? "Available" : "Unavailable"}
              </span>
              <Button text="Edit" action={handleEdit} />
            </div>

            {/* Row with lessons and tests count */}
            <div className='row-lesson-test'>
              <p><strong>Lessons Count:</strong> {selectedCourse.lessonCount}</p>
              <p><strong>Tests Count:</strong> {selectedCourse.testCount}</p>
            </div>

            {/* Description */}
            <p><strong>Color:</strong> {selectedCourse.color}</p>
            <p><strong>Description:</strong> {selectedCourse.description}</p>

            {/* Divider */}
            <hr className='modal-divider' />

            {/* Buttons for managing course content and delete */}
            <div className='modal-buttons'>
              <Button text="Manage Course Content" action={() => onSelectCourse(selectedCourse)} />
              <Button text="Delete" action={handleDelete} outline={true} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CourseManagement;