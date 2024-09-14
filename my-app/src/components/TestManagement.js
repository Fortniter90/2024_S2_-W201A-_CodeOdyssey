import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, writeBatch } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../config/firebase';
import DatabaseTable from './DatabaseTable';
import Button from './Button'; // Assuming you have a Button component
import './DatabaseManagement.css';

const TestManagement = () => {
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [formData, setFormData] = useState({ title: '', content: '', number: '' });
  const [editingTest, setEditingTest] = useState(null);
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

  const fetchTests = async (lessonId) => {
    if (!lessonId) return;

    try {
      const testsCollection = query(collection(db, `courses/${selectedCourse}/lessons/${lessonId}/tests`), orderBy('number'));
      const testSnapshot = await getDocs(testsCollection);
      const testList = testSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTests(testList);
    } catch (error) {
      console.error('Error fetching tests:', error);
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

  useEffect(() => {
    if (selectedLesson) {
      fetchTests(selectedLesson);
    }
  }, [selectedLesson]);

  const shiftTestNumbers = async (lessonId, newNumber) => {
    const batch = writeBatch(db);
    const testsToShift = tests.filter(test => test.number >= newNumber);

    testsToShift.forEach(test => {
      const testRef = doc(db, `courses/${selectedCourse}/lessons/${lessonId}/tests`, test.id);
      batch.update(testRef, { number: test.number + 1 });
    });

    await batch.commit();
  };

  const getNextTestNumber = () => {
    if (tests.length === 0) {
      return 1; 
    }
  
    const lastTest = tests.reduce((prev, current) => (prev.number > current.number ? prev : current));
  
    return lastTest.number + 1;
  };  

  const handleAdd = () => {
    const nextTestNumber = getNextTestNumber();
    setFormData({ title: '', content: '', number: nextTestNumber }); 
    setEditingTest(null);
    setIsModalOpen(true);
  };  

  const handleSave = async () => {
    if (!formData.title || !formData.content || !formData.number || !selectedLesson) {
      setErrorMessage('All fields must be filled out!');
      return;
    }

    const testNumber = parseInt(formData.number, 10);

    try {
      if (editingTest) {
        const testRef = doc(db, `courses/${selectedCourse}/lessons/${selectedLesson}/tests`, editingTest.id);
        await updateDoc(testRef, formData);
        setSuccessMessage('Test updated successfully!');

      } else {
        await shiftTestNumbers(selectedLesson, testNumber);

        await addDoc(collection(db, `courses/${selectedCourse}/lessons/${selectedLesson}/tests`), {
          ...formData,
          number: testNumber,
        });

        setSuccessMessage('Test added successfully!');
      }

      setIsModalOpen(false);
      setFormData({ title: '', content: '', number: '' });
      setEditingTest(null);
      setErrorMessage('');
      fetchTests(selectedLesson);
    } catch (error) {
      console.error('Error saving test:', error);
      setErrorMessage('Error saving test. Please try again.');
    }
  };

  const handleEdit = (test) => {
    setFormData({ title: test.title, content: test.content, number: test.number });
    setEditingTest(test);
    setIsModalOpen(true);
  };

  const handleDelete = async (testId) => {
    try {
      await deleteDoc(doc(db, `courses/${selectedCourse}/lessons/${selectedLesson}/tests`, testId));
      setSuccessMessage('Test deleted successfully!');
      fetchTests(selectedLesson);
    } catch (error) {
      console.error('Error deleting test:', error);
      setErrorMessage('Error deleting test. Please try again.');
    }
  };

  return (
    <div className='management roboto-regular'>
      <div className='management-header'>
        <h1 className='roboto-bold'>Test Management</h1>
        <Button text={'Add New Test'} action={handleAdd} />
      </div>

      <div className='table-filter'>
        <h3>Course Selection: </h3>
        <select className='roboto-regular' onChange={(e) => setSelectedCourse(e.target.value)} value={selectedCourse}>
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
      </div>

      <div className='table-filter'>
        <h3>Lesson Selection: </h3>
        <select className='roboto-regular' onChange={(e) => setSelectedLesson(e.target.value)} value={selectedLesson}>
          <option value="">Select Lesson</option>
          {lessons.map(lesson => (
            <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
          ))}
        </select>
      </div>

      <DatabaseTable
        title="Test"
        data={tests}
        columns={[
          { header: 'Test Number', key: 'number' },
          { header: 'Test Title', key: 'title' },
          { header: 'Content', key: 'content' }
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        totalItems={tests.length}
      />

      {isModalOpen && (
        <div className='modal-overlay'>
          <div className='modal'>
            <h2>{editingTest ? 'Update Test' : 'Add New Test'}</h2>
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
            <select
              value={selectedLesson}
              onChange={(e) => setSelectedLesson(e.target.value)}
            >
              <option value="">Select Lesson</option>
              {lessons.map(lesson => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Test Number"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
            />
                        <input
              type="text"
              placeholder="Test Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <textarea
              placeholder="Test Content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
            <Button text={editingTest ? 'Update Test' : 'Add Test'} action={handleSave} />
            <Button text="Cancel" type="outline" action={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}

      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default TestManagement;
