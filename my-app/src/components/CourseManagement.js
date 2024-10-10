import { useState, useEffect } from 'react';
import { FaX } from 'react-icons/fa6';
import { fetchCourses } from '../utils/DataFetching';
import { saveCourse, updateCourse } from '../utils/DataSaving';
import { deleteCourse } from '../utils/DataDeleting';
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
  const [addModalActive, setAddModalActive] = useState(false);                                // Add course
  const [courseModalActive, setCourseModalActive] = useState(false);                          // Course details
  const [confirmationModalActive, setConfirmationModalActive] = useState(false);              // Success confirmation
  const [deleteConfirmationModalActive, setDeleteConfirmationModalActive] = useState(false);  // Delete confirmation

  // States controling course status
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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from event target
    setFormData(prev => ({ ...prev, [name]: value })); // Update formData state
  };

  // Handle course addition
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const newCourse = {
      ...formData,
      available: false,
      lessonCount: 0,
      testCount: 0
    };

    try {
      await saveCourse(newCourse);  // Save the new course
      setAddModalActive(false);     // Close the add course modal

      setFormData({ title: '', color: '', description: '' }); // Reset form data
      
      // Load courses and add the new course at the top
      const courseList = await fetchCourses();
      setCourses([newCourse, ...Object.values(courseList)]); // Add new course at the top
      
    } catch (error) {
      console.error('Error adding course:', error); // Log any errors during course addition
    }
  };

  // Handle course selection for editing and viewing details
  const handleCourseClick = (course) => {
    setSelectedCourse(course);  // Set the selected course
    setCourseModalActive(true); // Open the course details modal
  };

  // Handle course deletion
  const handleDelete = async () => {
    try {
      await deleteCourse(selectedCourse.id);    // Delete the selected course
      setDeleteConfirmationModalActive(false);  // Close delete confirmation modal
      setCourseModalActive(false);              // Close course details
      setConfirmationModalActive(true);         // Show success confirmation
      loadCourses();                            // Refresh course list after deletion

    } catch (error) {
      console.error('Error deleting course:', error); // Log any errors during deletion
    }
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
  
  // Handle course update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    const updatedCourse = {
      ...formData,
      lessonCount: selectedCourse.lessonCount,  // Keep original lesson count
      testCount: selectedCourse.testCount       // Keep original test count
    };
  
    try {
      await updateCourse(selectedCourse.id, updatedCourse); // Update course with new data
      setCourseModalActive(false);      // Close course details modal
      setIsEditing(false);              // Exit editing mode
      setSelectedCourse(null);          // Clear selected course
      loadCourses();                    // Refresh course list                    
      setConfirmationModalActive(true); // Show success confirmation modal

    } catch (error) {
      console.error('Error updating course:', error); // Log any errors during update
    }
  };
  


  // Render message if no courses are available
  const renderNoItems = () => <div>No courses available.</div>;

  return (
    <div className='management roboto-regular'>
      <div className='management-header'>
        <h1 className='fira-code'>Course Management</h1>
        <Button text={'Add Course'} action={() => setAddModalActive(true)} />
      </div>

      {/* Modal for adding a new course */}
      {addModalActive && (
        <>
          <div className='overlay' onClick={() => setAddModalActive(false)} />
          <div className='modal'>
            <button className='authpage-close' onClick={() => setAddModalActive(false)}><FaX /></button>
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
                  <Button text="Cancel" outline={true} action={() => setAddModalActive(false)} />
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

      {/* Course information modal */}
      {courseModalActive && selectedCourse && (
        <>
          <div className='overlay' onClick={() => setCourseModalActive(false)} />
          <div className='information-modal'>
            <button className='authpage-close' onClick={() => setCourseModalActive(false)}><FaX /></button>
            
            {isEditing ? (
              <form onSubmit={handleUpdateSubmit}>
                <h2>Edit Course</h2>
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
                  Availability:
                  <select
                    name="available"
                    value={formData.available} // Bind the availability state
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Availability</option>
                    <option value={true}>Available</option>
                    <option value={false}>Unavailable</option>
                  </select>
                </label>
                <label>
                  Color:
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Color</option>
                    <option value="orange">Orange</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                  </select>
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
                <div className='row-lesson-test'>
                  <p><strong>Lessons Count:</strong> {selectedCourse.lessonCount}</p>
                  <p><strong>Tests Count:</strong> {selectedCourse.testCount}</p>
                </div>
                <p><strong>Color:</strong> {selectedCourse.color}</p>
                <p><strong>Description:</strong> {selectedCourse.description}</p>
                <hr className='modal-divider' />
                <div className='modal-buttons'>
                  <Button text="Manage Course Content" action={() => onSelectCourse(selectedCourse)} />
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
            <p>Are you sure you want to delete this course?</p>
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

export default CourseManagement;