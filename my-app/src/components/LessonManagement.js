import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, writeBatch } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../config/firebase';
import DatabaseTable from './DatabaseTable';
import Button from './Button';
import './DatabaseManagement.css';

const LessonManagement = () => {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [formData, setFormData] = useState({ title: '', content: '', number: '' });
  const [editingLesson, setEditingLesson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

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

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchLessons(selectedCourse);
    }
  }, [selectedCourse]);

  const shiftLessonNumbers = async (courseId, newNumber) => {
    const batch = writeBatch(db);
    const lessonsToShift = lessons.filter(lesson => lesson.number >= newNumber);

    lessonsToShift.forEach(lesson => {
      const lessonRef = doc(db, `courses/${courseId}/lessons`, lesson.id);
      batch.update(lessonRef, { number: lesson.number + 1 });
    });

    await batch.commit();
  };

  const getNextLessonNumber = () => {
    if (lessons.length === 0) {
      return 1; 
    }
  
    const lastLesson = lessons.reduce((prev, current) => (prev.number > current.number ? prev : current));
  
    return lastLesson.number + 1;
  };  

  const handleAdd = () => {
    const nextLessonNumber = getNextLessonNumber();
    setFormData({ title: '', content: '', number: nextLessonNumber });
    setEditingLesson(null);
    setIsModalOpen(true);
  };  

  const handleSave = async () => {
    if (!formData.title || !formData.content || !formData.number || !selectedCourse) {
      setErrorMessage('All fields must be filled out!');
      return;
    }

    const lessonNumber = parseInt(formData.number, 10);

    try {
      if (editingLesson) {
        const lessonRef = doc(db, `courses/${selectedCourse}/lessons`, editingLesson.id);
        await updateDoc(lessonRef, formData);
        setSuccessMessage('Lesson updated successfully!');

      } else {
        await shiftLessonNumbers(selectedCourse, lessonNumber);

        await addDoc(collection(db, `courses/${selectedCourse}/lessons`), {
          ...formData,
          number: lessonNumber,
        });

        setSuccessMessage('Lesson added successfully!');
      }

      setIsModalOpen(false);
      setFormData({ title: '', content: '', number: '' });
      setEditingLesson(null);
      setErrorMessage('');
      fetchLessons(selectedCourse);

    } catch (error) {
      console.error('Error saving lesson:', error);
      setErrorMessage('Error saving lesson. Please try again.');
    }
  };

  const handleEdit = (lesson) => {
    setFormData({ title: lesson.title, content: lesson.content, number: lesson.number });
    setEditingLesson(lesson);
    setIsModalOpen(true);
  };

  const handleDelete = async (lessonId) => {
    try {
      await deleteDoc(doc(db, `courses/${selectedCourse}/lessons`, lessonId));
      setSuccessMessage('Lesson deleted successfully!');
      fetchLessons(selectedCourse);
    } catch (error) {
      console.error('Error deleting lesson:', error);
      setErrorMessage('Error deleting lesson. Please try again.');
    }
  };

  return (
    <div className='management roboto-regular'>
      <div className='management-header'>
          <h1 className='roboto-bold'>Lesson Management</h1>
          <Button text={'Add New Lesson'} action={handleAdd}/>
      </div>

      <div className='table-filter'>
        <h3>Course Selection: </h3>
          <select className='roboto-regular' onChange={(e) => setSelectedCourse(e.target.value)} value={selectedCourse}>
            <option>Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
      </div>
      

      <DatabaseTable
        title="Lesson"
        data={lessons}
        columns={[
          { header: 'Lesson Number', key: 'number' },
          { header: 'Lesson Title', key: 'title' },
          { header: 'Content', key: 'content' }
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        totalItems={lessons.length}
      />

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
              placeholder="Lesson Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <textarea
              placeholder="Lesson Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
            <Button text={editingLesson ? 'Update Lesson' : 'Add Lesson'} action={handleSave} />
            <Button text="Cancel" type="outline" action={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default LessonManagement;
