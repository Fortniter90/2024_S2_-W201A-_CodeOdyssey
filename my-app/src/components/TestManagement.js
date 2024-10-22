import { useState, useEffect } from 'react';
import { fetchTests } from '../utils/dataFetching';
import { saveTest, updateTest } from '../utils/dataSaving';
import { deleteTest } from '../utils/dataDeleting';
import ManagementTable from './ManagementTable';


// Component to manage test data
const TestManagement = ({ selectedCourse, selectedLesson }) => {

  // States handling course data
  const [tests, setTests] = useState([]);   // List of tests
  const [formData, setFormData] = useState({    // Data for adding and editing test data
    number: '',
    question: '',
    answer: '',
    requiredOutput: '',
    hint: '',
    constraints: []
  });

  // Load tests component on mount
  useEffect(() => {
    loadTests();
  }, [selectedCourse, selectedLesson]);

  // Fetch all of the tests for the lesson
  const loadTests = async () => {
    try {
      const testList = await fetchTests(selectedCourse.id, selectedLesson.id);  // Fetch list of tests
      setTests(Object.values(testList));                                        // Update the state with the fetches tests

    } catch (error) {
      console.error('Error loading courses:', error); // Log any errors during data fetching
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from event target
    setFormData(prev => ({ ...prev, [name]: value })); // Update formData state
  };

  const handleCheckboxChange = (e, constraint) => {
    const { checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      constraints: {
        ...prevData.constraints,
        [constraint]: checked
      }
    }));
  };

  // Prepare form for editing
  const handleEdit = (test) => {
    // Set form data for selected course
    setFormData({
      number: test.number,
      question: test.question,
      answer: test.answer,
      requiredOutput: test.requiredOutput,
      hint: test.hint,
      available: test.available,
      constraints: test.constraints
    });
  };

  // Handle course addition
  const handleSubmit = async (test, isEditing) => {
    const testNumber = parseInt(formData.number, 10);
    const newTest = {
      ...formData,
      available: true
    };

    try {
      if (isEditing) {
        if (testNumber !== test.number) {
          await shiftTestNumbers(test.number, false); // Shift down
          await shiftTestNumbers(testNumber); // Shift up
        }

        await updateTest(selectedCourse.id, selectedLesson.id, test.id, newTest);
      }
      else {
        await shiftTestNumbers(testNumber);
        await saveTest(selectedCourse.id, selectedLesson.id, newTest);
      }

      loadTests(); // Refresh test list
      setFormData({ number: '', question: '', answer: '', requiredOutput: '', hint: '', constraints: [] }); // Reset form data

    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} test:`, error);
    }
  };

  // Shift lesson numbers if a new lesson is inserted
  const shiftTestNumbers = async (newNumber, increment = true) => {
    const testsToShift = tests.filter(test => (increment ? test.number >= newNumber : test.number > newNumber));

    // Update each lesson number individually
    for (const test of testsToShift) {
      const currentNumber = parseInt(test.number, 10);
      const updatedTestData = {
        ...test,
        number: increment ? currentNumber + 1 : currentNumber - 1
      };

      try {
        await updateTest(selectedCourse.id, selectedLesson.id, test.id, updatedTestData);
      } catch (error) {
        console.error('Error shifting lesson number:', error);
      }
    }
  };

  // Handle lesson deletion
  const handleDelete = async (test) => {
    try {
      await deleteTest(selectedCourse.id, selectedLesson.id, test.id);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait one second
      loadTests();  // Refresh test list after deletion

    } catch (error) {
      console.error('Error deleting test:', error); // Log any errors during deletion
    }
  };

  // Render add course form
  const testAdd = () => {
    return (
      <>
        <div className='form-group'>
          <label>Test Number:</label>
          <input type="number" name="number" value={formData.number} onChange={handleInputChange} required />
        </div>

        <div className='form-group'>
          <label>Question:</label>
          <input type="text" name="question" value={formData.question} onChange={handleInputChange} required />
        </div>

        <div classname='form-group'>
          <label>answer:</label>
          <textarea name='answer' value={formData.answer} onChange={handleInputChange} required />
        </div>

        <div classname='form-group'>
          <label>Required Output:</label>
          <textarea name='requiredOutput' value={formData.requiredOutput} onChange={handleInputChange} required />
        </div>

        <div className='form-group'>
          <label>Hint:</label>
          <input type="text" name="hint" value={formData.hint} onChange={handleInputChange} />
        </div>

        <div className='form-group'>
          <label>
            <input type="checkbox" name="constraints-print" checked={formData.constraints?.print || false} onChange={(e) => handleCheckboxChange(e, 'print')} />
            Print Constraint
          </label>
        </div>

        <div className='form-group'>
          <label>
            <input type="checkbox" name="constraints-loop" checked={formData.constraints?.loop || false} onChange={(e) => handleCheckboxChange(e, 'loop')} />
            Loop Constraint
          </label>
        </div>
      </>
    );
  };

  // Render course details form
  const testDetails = (test) => {
    return (
      <>
        <div className='row-availability-edit'>
          <span className={`availability-tag ${test.available ? "available" : "unavailable"}`}>
            {test.available ? "Available" : "Unavailable"}
          </span>
        </div>

        <div className='row-lesson-test'>
          <p><strong>Number:</strong> {test.number}</p>
          <p><strong>Question:</strong> {test.question}</p>
          <p><strong>Answer:</strong> {test.answer}</p>
          <p><strong>Hint:</strong> {test.hint}</p>
        </div>
      </>
    );
  };

  // Render course editing form
  const testEditing = () => {
    return (
      <>
        <div className='form-group'>
          <label>Test Number:</label>
          <input type="number" name="number" value={formData.number} onChange={handleInputChange} required />
        </div>

        <div className='form-group'>
          <label>Question:</label>
          <input type="text" name="question" value={formData.question} onChange={handleInputChange} required />
        </div>

        <div className='form-group'>
          <label>Answer:</label>
          <textarea name="answer" value={formData.answer} onChange={handleInputChange} required />
        </div>

        <div className='form-group'>
          <label>Required Output:</label>
          <textarea name='requiredOutput' value={formData.requiredOutput} onChange={handleInputChange} required />
        </div>

        <div className='form-group'>
          <label>Hint:</label>
          <input type="text" name="hint" value={formData.hint} onChange={handleInputChange} />
        </div>

        <div className='form-group'>
          <label>
            <input type="checkbox" name="constraints-print" checked={formData.constraints?.print || false} onChange={(e) => handleCheckboxChange(e, 'print')} />
            Print Constraint
          </label>
        </div>

        <div className='form-group'>
          <label>
            <input type="checkbox" name="constraints-loop" checked={formData.constraints?.loop || false} onChange={(e) => handleCheckboxChange(e, 'loop')} />
            Loop Constraint
          </label>
        </div>
      </>
    );
  };

  return (
    <ManagementTable
      type={'Test'}
      items={tests}
      itemAdd={testAdd}
      itemDetails={testDetails}
      itemEditing={testEditing}
      itemSubmit={handleSubmit}
      itemEdit={handleEdit}
      itemDelete={handleDelete}
    />
  );
};

export default TestManagement;
