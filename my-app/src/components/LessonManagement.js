import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';
import DatabaseTable from './DatabaseTable';
import Button from './Button';
import './DatabaseManagement.css';

const LessonManagement = () => {
  // State for courses, lessons, and selected IDs
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  // State for form data and modal management
  const [formData, setFormData] = useState({ number: '', title: '', content: [] });
  const [editingLesson, setEditingLesson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for messages and pagination
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Fetch all courses from Firestore
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

  // Fetch lessons for the selected course from Firestore
  const fetchLessons = async (courseId) => {
    if (!courseId) return;

    try {
      const lessonsCollection = query(collection(db, `courses/${courseId}/lessons`), orderBy('number'));
      const lessonSnapshot = await getDocs(lessonsCollection);
      const lessonList = lessonSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLessons(lessonList);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  // Load courses
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch lessons when the selected course changes
  useEffect(() => {
    if (selectedCourse) {
      fetchLessons(selectedCourse);
    }
  }, [selectedCourse]);

  // Shift lesson numbers if a new lesson is inserted
  const shiftLessonNumbers = async (courseId, newNumber, increment=true) => {
    const batch = writeBatch(db);
    const lessonsToShift = lessons.filter(lesson => (increment ? lesson.number >= newNumber : lesson.number > newNumber));

    lessonsToShift.forEach(lesson => {
      const lessonRef = doc(db, `courses/${courseId}/lessons`, lesson.id);
      batch.update(lessonRef, { number: increment ? lesson.number + 1 : lesson.number - 1 });
    });

    await batch.commit();
  };

  // Get the next lesson number in the sequence
  const getNextLessonNumber = () => {
    if (lessons.length === 0) {
      return 1; 
    }
  
    const lastLesson = lessons.reduce((prev, current) => (prev.number > current.number ? prev : current));
    return lastLesson.number + 1;
  };  

  // Open the modal for adding a new lesson
  const handleAdd = () => {
    const nextLessonNumber = getNextLessonNumber();
    setFormData({ number: nextLessonNumber, title: '', desciprtion: '', content: [] });
    setEditingLesson(null);
    setIsModalOpen(true);
  };  

  // Save a new or edited lesson
  const handleSave = async () => {
    if (!formData.number || !formData.title || !formData.description || !selectedCourse) {
      setErrorMessage('All fields must be filled out!');
      return;
    }

    const lessonNumber = parseInt(formData.number, 10);

    try {
      if (editingLesson) {
        const lessonRef = doc(db, `courses/${selectedCourse}/lessons`, editingLesson.id);

        if (lessonNumber !== editingLesson.number) {
          await shiftLessonNumbers(selectedCourse, editingLesson.number, false); // Shift down
          await shiftLessonNumbers(selectedCourse, lessonNumber); // Shift up
        }

        await updateDoc(lessonRef, formData);
        setSuccessMessage('Lesson updated successfully!');

      } 
      else {
        await shiftLessonNumbers(selectedCourse, lessonNumber);
        await addDoc(collection(db, `courses/${selectedCourse}/lessons`), {
          ...formData,
          number: lessonNumber,
        });

        setSuccessMessage('Lesson added successfully!');
      }

      setIsModalOpen(false);
      setFormData({ number: '', title: '', desciprtion: '', content: [] });
      setEditingLesson(null);
      setErrorMessage('');

      fetchLessons(selectedCourse);

    } catch (error) {
      console.error('Error saving lesson:', error);
      setErrorMessage('Error saving lesson. Please try again.');
    }
  };

  // Handle lesson edit by populating form with selected lesson data
  const handleEdit = (lesson) => {
    setFormData({ number: lesson.number, title: lesson.title, description: lesson.description, content: lesson.content });
    setEditingLesson(lesson);
    setIsModalOpen(true);
  };

  // Handle lesson deletion
  const handleDelete = async (lessonId) => {
    try {
      // Get the lesson number to shift others
      const lessonToDelete = lessons.find(lesson => lesson.id === lessonId);
  
      if (lessonToDelete) {
        await deleteDoc(doc(db, `courses/${selectedCourse}/lessons`, lessonId));
        await shiftLessonNumbers(selectedCourse, lessonToDelete.number, false); // Shift down
  
        setSuccessMessage('Lesson deleted successfully!');
        fetchLessons(selectedCourse);
      }
  
    } catch (error) {
      console.error('Error deleting lesson:', error);
      setErrorMessage('Error deleting lesson. Please try again.');
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
  

  return (
    <div className='management roboto-regular'>
      {/* Header section with title and Add New Lesson button */}
      <div className='management-header'>
          <h1 className='roboto-bold'>Lesson Management</h1>
          <Button text={'Add New Lesson'} action={handleAdd}/>
      </div>

      {/* Dropdown to select a course for displaying lessons */}
      <div className='table-filter'>
        <h3>Course Selection: </h3>
          <select className='roboto-regular' onChange={(e) => setSelectedCourse(e.target.value)} value={selectedCourse}>
            <option>Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
      </div>
      
      {/* Table displaying the lessons of the selected course */}
      <DatabaseTable
        title="Lesson"
        data={lessons}
        columns={[
          { header: 'Lesson Number', key: 'number' },
          { header: 'Title', key: 'title' },
          { header: 'Description', key: 'description' },
          { header: 'Content', key: 'content' }
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        totalItems={lessons.length}
        renderCell={(key, value) => {
          if (key === 'content') {
            return typeof value === 'object' ? JSON.stringify(value) : value;
          }
          return value;
        }}
      />

      {/* Modal for adding or editing lessons */}
      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal'>
            <h2>{editingLesson ? 'Update Lesson' : 'Add New Lesson'}</h2>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">Select Course</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Lesson Number"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            />
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <textarea
              placeholder="Lesson Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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

            <Button text={editingLesson ? 'Update Lesson' : 'Add Lesson'} action={handleSave} />
            <Button text="Cancel" type="outline" action={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}

      {/* Display error or success messages */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default LessonManagement;
