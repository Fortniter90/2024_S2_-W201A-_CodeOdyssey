import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';
import DatabaseTable from './DatabaseTable';
import Button from './Button';
import './DatabaseManagement.css';

// Management for the test collection in the database
const TestManagement = () => {
  // State for courses, lessons, tests, and selected IDs
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');

  // State for form data and modal management
  const [formData, setFormData] = useState({ number: '', title: '', question: '', answer: '', hint: '' });
  const [editingTest, setEditingTest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for messages and pagination
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Fetching courses
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

  // Fetching lessons based on the selected course
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

  // Fetching tests based on the selected lesson
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

  // Fetching courses when the component first mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetching lessons whenever a course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchLessons(selectedCourse);
    }
  }, [selectedCourse]);

  // Fetching tests whenever a lesson is selected
  useEffect(() => {
    if (selectedLesson) {
      fetchTests(selectedLesson);
    }
  }, [selectedLesson]);

  // Shifting test numbers when a new test is added in between existing tests
  const shiftTestNumbers = async (lessonId, newNumber) => {
    const batch = writeBatch(db);
    const testsToShift = tests.filter(test => test.number >= newNumber);

    testsToShift.forEach(test => {
      const testRef = doc(db, `courses/${selectedCourse}/lessons/${lessonId}/tests`, test.id);
      batch.update(testRef, { number: test.number + 1 });
    });

    await batch.commit();
  };

  // Getting the next available test number for the current lesson
  const getNextTestNumber = () => {
    if (tests.length === 0) {
      return 1; 
    }
  
    const lastTest = tests.reduce((prev, current) => (prev.number > current.number ? prev : current));
  
    return lastTest.number + 1;
  };  

  // Handle opening the modal for adding a new test
  const handleAdd = () => {
    const nextTestNumber = getNextTestNumber();
    setFormData({ number: nextTestNumber, question: '', answer: '', hint: '' }); 
    setEditingTest(null);
    setIsModalOpen(true);
  };  

  // Handle saving a new or edited test
  const handleSave = async () => {
    if ( !formData.number || !formData.question || !formData.answer || !selectedLesson) {
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
      setFormData({ number: '', question: '', answer: '', hint: '' });
      setEditingTest(null);
      setErrorMessage('');
      fetchTests(selectedLesson);
    } catch (error) {
      console.error('Error saving test:', error);
      setErrorMessage('Error saving test. Please try again.');
    }
  };

  // Handle clicking the edit button for a test
  const handleEdit = (test) => {
    setFormData({ number: test.number, title: test.title, question: test.question, answer: test.answer, hint: test.hint });
    setEditingTest(test);
    setIsModalOpen(true);
  };

  // Handle deleting a test
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
      {/* Header section */}
      <div className='management-header'>
        <h1 className='roboto-bold'>Test Management</h1>
        <Button text={'Add New Test'} action={handleAdd} />
      </div>

      {/* Dropdown to select a course for displaying lessons */}
      <div className='table-filter'>
        <h3>Course Selection: </h3>
        <select className='roboto-regular' onChange={(e) => setSelectedCourse(e.target.value)} value={selectedCourse}>
          <option value="">Select Course</option>
          {courses.map(course => (
            <option key={course.id} value={course.id}>{course.title}</option>
          ))}
        </select>
      </div>

      {/* Dropdown to select a lessons for displaying tests */}
      <div className='table-filter'>
        <h3>Lesson Selection: </h3>
        <select className='roboto-regular' onChange={(e) => setSelectedLesson(e.target.value)} value={selectedLesson}>
          <option value="">Select Lesson</option>
          {lessons.map(lesson => (
            <option key={lesson.id} value={lesson.id}>{lesson.title}</option>
          ))}
        </select>
      </div>

      {/* Table displaying the list of courses */}
      <DatabaseTable
        title="Test"
        data={tests}
        columns={[
          { header: 'Test Number', key: 'number' },
          { header: 'Question', key: 'question' },
          { header: 'Answer', key: 'answer' },
          { header: 'Hint', key: 'hint' }
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        totalItems={tests.length}
      />

      {/* Modal for adding or editing lessons */}
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
              placeholder="Question"
              value={formData.question}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
            />
            <textarea
              placeholder="Answer"
              value={formData.answer}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
            />
            <textarea
              placeholder="Hint (optional)"
              value={formData.hint}
              onChange={(e) => setFormData({ ...formData, hint: e.target.value })}
            />

            <Button text={editingTest ? 'Update Test' : 'Add Test'} action={handleSave} />
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

export default TestManagement;
