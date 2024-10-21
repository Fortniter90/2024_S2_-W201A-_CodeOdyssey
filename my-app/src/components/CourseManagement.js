import { useState, useEffect } from 'react';
import { fetchCourses } from '../utils/dataFetching';
import { saveCourse, updateCourse } from '../utils/dataSaving';
import { deleteCourse } from '../utils/dataDeleting';
import ManagementTable from './ManagementTable';

// Component to manage course data
const CourseManagement = ({ onSelectCourse }) => {

  // States handling course data
  const [courses, setCourses] = useState([]);   // List of courses
  const [formData, setFormData] = useState({    // Data for adding and editing course data
    title: '',
    color: '',
    description: ''
  });

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

  // Prepare form for editing
  const handleEdit = (course) => {
    // Set form data for selected course
    setFormData({
      title: course.title,
      color: course.color,
      description: course.description,
      available: course.available
    });
  };

  // Handle new course and course update
  const handleSubmit = async (course, isEditing) => {
    const courseData = {
      ...formData,
      lessonCount: isEditing ? course.lessonCount : 0,   // Keep original lesson count
      testCount: isEditing ? course.testCount : 0,       // Keep original test count
      available: formData.available || true,
    };

    try {
      if (isEditing) {
        await updateCourse(course.id, courseData);
      } else {
        await saveCourse(courseData);
      }

      loadCourses();  // Refresh course list
      setFormData({ title: '', color: '', description: '' }); // Reset form data

    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} course:`, error);
    }
  };

  // Handle course deletion
  const handleDelete = async (course) => {
    try {
      await deleteCourse(course.id); // Delete the selected course
      loadCourses();  // Refresh course list after deletion

    } catch (error) {
      console.error('Error deleting course:', error); // Log any errors during deletion
    }
  };

  // Render add course form
  const courseAdd = () => {
    return (
      <>
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
      </>
    );
  };

  // Render course details form
  const courseDetails = (course) => {
    return (
      <>
        <div className='row-availability-edit'>
          <span className={`availability-tag ${course.available ? "available" : "unavailable"}`}>
              {course.available ? "Available" : "Unavailable"}
          </span>
        </div>

        <p><strong>Lessons Count:</strong> {course.lessonCount}</p>
        <p><strong>Tests Count:</strong> {course.testCount}</p>
        <p><strong>Color:</strong> {course.color}</p>
        <p><strong>Description:</strong> {course.description}</p>
      </>
    );
  };

  // Render course editing form
  const courseEditing = () => {
    return (
      <>
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
      </>
    );
  };

  return (
    <ManagementTable
      type={'Course'}
      items={courses}
      onSelectItem={onSelectCourse}
      itemAdd={courseAdd}
      itemDetails={courseDetails}
      itemEditing={courseEditing}
      itemSubmit={handleSubmit}
      itemEdit={handleEdit}
      itemDelete={handleDelete}
    />
  );
};

export default CourseManagement;