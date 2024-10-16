import { useState, useEffect } from 'react';
import { FaX } from 'react-icons/fa6';
import { fetchCourses } from '../utils/dataFetching';
import { saveCourse, updateCourse } from '../utils/dataSaving';
import { deleteCourse } from '../utils/dataDeleting';
import ManagementTable from './ManagementTable';
import Button from './Button';
import './DatabaseManagement.css';



// Component to manage course data
const CourseManagement = ({ onSelectCourse }) => {

  // States handling course data
  const [courses, setCourses] = useState([]);   // List of courses
  const [formData, setFormData] = useState({    // Data for adding and editing course data
    title: '',
    color: '',
    description: ''
  });

  // States controling modal visibility
  const [modals, setModals] = useState({
    add: false,
    courseDetails: false,
    confirmation: false,
    deleteConfirmation: false,
  })

  const [selectedCourse, setSelectedCourse] = useState(null);   // Stores selected course
  const [isEditing, setIsEditing] = useState(false);            // Indicates if course is in edit mode



  // Load courses component on mount
  useEffect(() => {
    loadCourses();
  }, []);

  // Load all of the courses
  const loadCourses = async () => {
    try {
      const courseList = await fetchCourses();  // Fetch list of courses
      setCourses(Object.values(courseList));    // Update the state with the fetched courses

    } catch (error) {
      console.error('Error loading courses:', error); // Log any errors during data fetching
    }
  };

  // Handle modal visibility
  const toggleModal = (modalName, state) => {
    setModals((prev) => ({ ...prev, [modalName]: state })); // Change state of given modal

    if (state == false) {
      setFormData({ title: '', color: '', description: '' }); // Reset form data
      setIsEditing(false); // Set editing mode
    }
  }

  // Handle course selection for editing and viewing details
  const handleCourseClick = (course) => {
    setSelectedCourse(course);          // Set the selected course
    toggleModal('courseDetails', true); // Open the course details modal
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from event target
    setFormData(prev => ({ ...prev, [name]: value })); // Update formData state
  };

  // Prepare form for editing
  const handleEdit = () => {
    // Set form data for selected course
    setFormData({
      title: selectedCourse.title,
      color: selectedCourse.color,
      description: selectedCourse.description,
      available: selectedCourse.available
    });

    setIsEditing(true); // Set editing mode
  };

  // Handle new course and course update
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    const courseData = {
      ...formData,
      lessonCount: isEditing ? selectedCourse.lessonCount : 0,   // Keep original lesson count
      testCount: isEditing ? selectedCourse.testCount : 0,       // Keep original test count
      available: formData.available || false,
    };

    try {
      if (isEditing) {
        await updateCourse(selectedCourse.id, courseData);
      } else {
        await saveCourse(courseData);
      }

      toggleModal('courseDetails', false);  // Close course details modal
      setIsEditing(false); // Exit editing mode
      loadCourses();       // Refresh course list

    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} course:`, error);
    }
  };

  // Handle course deletion
  const handleDelete = async () => {
    try {
      await deleteCourse(selectedCourse.id); // Delete the selected course

      toggleModal('deleteConfirmation', false); // Close delete confirmation modal
      toggleModal('courseDetails', false);      // Close course details
      loadCourses();                            // Refresh course list after deletion
      toggleModal('confirmation', true);        // Show success confirmation

    } catch (error) {
      console.error('Error deleting course:', error); // Log any errors during deletion
    }
  };



  // Render message if no courses are available
  const renderNoItems = () => <div>No courses available.</div>;

  return (
    <div className='management roboto-regular'>
      <div className='management-header'>
        <h1 className='fira-code'>Course Management</h1>
        <Button text={'Add Course'} action={() => toggleModal('add', true)} />
      </div>

      {/* Add Course Modal */}
      {modals.add && (
        <>
          <div className='overlay' onClick={() => toggleModal('add', false)} />
          <div className='modal'>
            <button className='authpage-close' onClick={() => toggleModal('add', false)}><FaX /></button>
            <h2>Add New Course</h2>

            <form onSubmit={handleSubmit}>
              <div className='form-group'>
                <label>Title:</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
              <div className='form-group'>
                <label>Color:</label>
                <select name="color" value={formData.color} onChange={handleInputChange} required>
                  <option value="">Select Color</option>
                  <option value="orange">Orange</option>
                  <option value="green">Green</option>
                  <option value="blue">Blue</option>
                </select>
              </div>
              <div className='form-group'>
                <label>Description:</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required />
              </div>
              <div className='modal-buttons'>
                <Button type="submit" text="Add Course" />
                <Button text="Cancel" outline={true} action={() => toggleModal('add', false)} />
              </div>
            </form>
          </div>
        </>
      )}

      <ManagementTable
        items={courses}
        onRowClick={handleCourseClick}
        renderNoItems={renderNoItems}
      />

      {/* Course Details and Edit Modal */}
      {modals.courseDetails && selectedCourse && (
        <>
          <div className='overlay' onClick={() => toggleModal('courseDetails', false)} />
          <div className='information-modal'>
            <button className='authpage-close' onClick={() => toggleModal('courseDetails', false)}><FaX /></button>

            {isEditing ? (
              <form onSubmit={handleSubmit}>
                <h2>Edit Course</h2>
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
                  <label>Color:</label>
                  <select name="color" value={formData.color} onChange={handleInputChange} required>
                    <option value="">Select Color</option>
                    <option value="orange">Orange</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                  </select>
                </div>
                <div className='form-group'>
                  <label>Description:</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} required />
                </div>
                <div className='modal-buttons'>
                  <Button type="submit" text="Update Course" />
                  <Button text="Cancel" outline={true} action={() => setIsEditing(false)} />
                </div>
              </form>
            ) : (
              <>
                <h1>{selectedCourse.title}</h1>
                <div className='row-availability-edit'>
                  <span className={`availability-tag ${selectedCourse.available ? "available" : "unavailable"}`}>
                    {selectedCourse.available ? "Available" : "Unavailable"}
                  </span>
                  <Button text="Edit" action={handleEdit} />
                </div>
                <p><strong>Lessons Count:</strong> {selectedCourse.lessonCount}</p>
                <p><strong>Tests Count:</strong> {selectedCourse.testCount}</p>
                <p><strong>Color:</strong> {selectedCourse.color}</p>
                <p><strong>Description:</strong> {selectedCourse.description}</p>
                <hr className='modal-divider' />
                <div className='modal-buttons'>
                  <Button text="Manage Course Content" action={() => onSelectCourse(selectedCourse)} />
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
            <p>Are you sure you want to delete this course?</p>
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

export default CourseManagement;
