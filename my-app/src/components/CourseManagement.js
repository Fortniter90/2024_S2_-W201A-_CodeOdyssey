import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import Button from './Button';
import DatabaseTable from './DatabaseTable';
import './DatabaseManagement.css';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [editingCourse, setEditingCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const rowsPerPage = 5;

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      const coursesCollection = collection(db, 'courses');
      const courseSnapshot = await getDocs(coursesCollection);
      const courseList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(courseList);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Fetch courses when the component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle opening form to add a new course
  const handleAdd = () => {
    setFormData({ title: '', description: '' });
    setEditingCourse(null);
    setIsModalOpen(true); 
  };

  // Save a new course or update an existing one
  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      setErrorMessage('All fields must be filled out!');
      return;
    }

    try {
      // If editing, update the existing course
      if (editingCourse) {
        const courseRef = doc(db, 'courses', editingCourse.id); 
        await updateDoc(courseRef, { ...formData });
        setSuccessMessage('Course updated successfully!');

      } 
      else {
        // If adding a new course, create a new document
        await addDoc(collection(db, 'courses'), { ...formData });
        setSuccessMessage('Course added successfully!');
      }

      //Close modal
      setIsModalOpen(false);

      // Reset data form and clear states
      setFormData({ title: '', description: '' });
      setEditingCourse(null);
      setErrorMessage('');

      fetchCourses();

    } catch (error) {
      console.error('Error saving course:', error);
      setErrorMessage('Error saving course. Please try again.');
    }
  };

  // Handle editing an existing course
  const handleEdit = (course) => {
    setFormData({ title: course.title, description: course.description });
    setEditingCourse(course);
    setIsModalOpen(true);
  };

  // Handle deleting a course
  const handleDelete = async (courseId) => {
    try {
      const lessonsQuery = query(collection(db, 'lessons'), where('courseId', '==', courseId));
      const lessonSnapshot = await getDocs(lessonsQuery);

      if (!lessonSnapshot.empty) {
        setErrorMessage('Cannot delete this course. Remove associated lessons first.');
        return;
      }

      await deleteDoc(doc(db, 'courses', courseId));
      setSuccessMessage('Course deleted successfully!');

      fetchCourses();
      
    } catch (error) {
      console.error('Error deleting course:', error);
      setErrorMessage('Error deleting course. Please try again.');
    }
  };

  return (
    <div className='management roboto-regular'>
      {/* Header section */}
      <div className='management-header'>
          <h1 className='roboto-bold'>Course Management</h1>
          <Button text={'Add New Course'} action={handleAdd}/>
      </div>
      
      {/* Table displaying the list of courses */}
      <DatabaseTable
        title="Course"
        data={courses}
        columns={[
          { header: 'Course Title', key: 'title' },
          { header: 'Description', key: 'description' },
          { header: 'Lessons Count', key: 'lessonCount' },
          { header: 'Tests Count', key: 'testCount' },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        totalItems={courses.length}
      />

      {/* Modal for adding or editing courses */}
      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal'>
            <h2>{editingCourse ? 'Update Course' : 'Add New Course'}</h2>
            
            <input
              type="text"
              placeholder="Course Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <textarea
              placeholder="Information"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          
            <Button text={editingCourse ? 'Update Course' : 'Add Course'} action={handleSave} />
            <Button text="Cancel" type="outline" action={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Error and success message display */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default CourseManagement;
