import { useState, useEffect } from 'react';
import { fetchLessons } from '../utils/dataFetching';
import { saveLesson, updateLesson } from '../utils/dataSaving';
import { deleteLesson } from '../utils/dataDeleting';
import ManagementTable from './ManagementTable';

// Component to manage lesson data
const LessonManagement = ({ selectedCourse, onSelectLesson }) => {

  // States handling lesson data
  const [lessons, setLessons] = useState([]);   // List of lessons
  const [formData, setFormData] = useState({    // Data for adding and editing lesson data
    title: '',
    number: '',
    description: '',
    content: []
  });

  // Fetch lessons when the component mounts
  useEffect(() => {
    loadLessons();
  }, [selectedCourse]);

  // Fetch all lessons for the course
  const loadLessons = async () => {
    try {
      const lessonList = await fetchLessons(selectedCourse.id);   // Fetch list of lessons
      setLessons(Object.values(lessonList));                      // Update the state with the fetched lessons

    } catch (error) {
      console.error('Error loading lessons:', error); // Log any errors during data fetching
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Destructure name and value from event target
    setFormData(prev => ({ ...prev, [name]: value })); // Update formData state
  };

  const addContent = () => {
    setFormData(prev => ({
      ...prev,
      content: [...prev.content, { type: 'text', content: '' }]
    }));
  };

  const removeContent = (index) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== index)
    }));
  };

  const handleContentChange = (index, field, value) => {
    const newContent = [...formData.content];
    newContent[index] = { ...newContent[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
  };

  // Prepare form for editing
  const handleEdit = (lesson) => {
    // Set form data for selected course
    setFormData({
      title: lesson.title,
      number: lesson.number,
      description: lesson.description,
      content: lesson.content
    });
  };

  // Handle lesson addition and updating
  const handleSubmit = async (lesson, isEditing) => {
    const lessonNumber = parseInt(formData.number, 10);
    const newLesson = {
      ...formData,
      testCount: isEditing ? selectedCourse.testCount : 0,    // Keep original test count
      available: false
    };

    try {
      if (isEditing) {
        if (lessonNumber !== lesson.number) {
          await shiftLessonNumbers(lesson.number, false); // Shift down
          await shiftLessonNumbers(lessonNumber); // Shift up
        }

        await updateLesson(selectedCourse.id, lesson.id, newLesson);
      }
      else {
        console.log(selectedCourse.id, newLesson);
        await shiftLessonNumbers(lessonNumber);
        await saveLesson(selectedCourse.id, newLesson);
      }

      loadLessons(); // Refresh lesson list
      setFormData({ title: '', number: '', description: '', content: [] }); // Reset form data

    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} lesson:`, error);
    }
  };

  // Shift lesson numbers if a new lesson is inserted
  const shiftLessonNumbers = async (newNumber, increment = true) => {
    const lessonsToShift = lessons.filter(lesson => (increment ? lesson.number >= newNumber : lesson.number > newNumber));

    // Update each lesson number individually
    for (const lesson of lessonsToShift) {
      const currentNumber = parseInt(lesson.number, 10);
      const updatedLessonData = {
        ...lesson,
        number: increment ? currentNumber + 1 : currentNumber - 1
      };

      try {
        await updateLesson(selectedCourse.id, lesson.id, updatedLessonData);
      } catch (error) {
        console.error('Error shifting lesson number:', error);
      }
    }
  };

  // Handle lesson deletion
  const handleDelete = async (lesson) => {
    try {
      await deleteLesson(selectedCourse.id, lesson.id);
      loadLessons(); // Refresh lesson list after deletion

    } catch (error) {
      console.error('Error deleting lesson:', error); // Log any errors during deletion
    }
  };

  // Render add lesson form
  const lessonAdd = () => {
    return (
      <>
        <div className='form-group'>
          <label>Lesson Number:</label>
          <input type="number" name="number" value={formData.number} onChange={handleInputChange} required />
        </div>

        <div className='form-group'>
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
        </div>

        <div className='form-group'>
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} required />
        </div>

        {/* Dynamic Content Management */}
        <div className='form-group'>
          <label>Content:</label>
          {formData.content.map((item, index) => (
            <div key={index} className='content-item'>
              <div className='form-group'>
                <select
                  value={item.type}
                  onChange={(e) => handleContentChange(index, 'type', e.target.value)}
                >
                  <option value="text">Text</option>
                  <option value="code">Code</option>
                </select>
              </div>

              {item.type === 'text' && (
                <div className='form-group'>
                  <textarea
                    placeholder="Content"
                    value={item.content}
                    onChange={(e) => handleContentChange(index, 'content', e.target.value)}
                  />
                </div>
              )}

              {item.type === 'code' && (
                <div className='form-group'>
                  <textarea
                    placeholder="Code Input"
                    value={item.input}
                    onChange={(e) => handleContentChange(index, 'input', e.target.value)}
                    rows={10}
                  />
                  <textarea
                    placeholder="Code Output"
                    value={item.output}
                    onChange={(e) => handleContentChange(index, 'output', e.target.value)}
                    rows={10}
                  />
                </div>
              )}
              <button onClick={() => removeContent(index)}>Remove</button>
            </div>
          ))}

          <button type="button" onClick={addContent}>Add Content</button>
        </div>
      </>
    );
  };

  // Render lesson details form
  const lessonDetails = (lesson) => {
    return (
      <>
        <div className='row-availability-edit'>
          <span className={`availability-tag ${lesson.available ? "available" : "unavailable"}`}>
            {lesson.available ? "Available" : "Unavailable"}
          </span>
        </div>

        <div className='row-lesson-test'>
          <p><strong>Number:</strong> {lesson.number}</p>
          <p><strong>Description:</strong> {lesson.description}</p>
          <p><strong>Tests Count:</strong> {lesson.testCount}</p>
        </div>
      </>
    );
  };

  // Render lesson editing form
  const lessonEditing = () => {
    return (
      <>
        <div className='form-group'>
          <label>Lesson Number:</label>
          <input type="number" name="number" value={formData.number} onChange={handleInputChange} required />
        </div>

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
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} required />
        </div>

        {/* Dynamic Content Management */}
        <div className='form-group'>
          <label>Content:</label>
          {formData.content.map((item, index) => (
            <div key={index} className='content-item'>
              <div className='form-group'>
                <select
                  value={item.type}
                  onChange={(e) => handleContentChange(index, 'type', e.target.value)}
                >
                  <option value="text">Text</option>
                  <option value="code">Code</option>
                </select>
              </div>

              {item.type === 'text' && (
                <div className='form-group'>
                  <textarea
                    placeholder="Content"
                    value={item.content}
                    onChange={(e) => handleContentChange(index, 'content', e.target.value)}
                  />
                </div>
              )}

              {item.type === 'code' && (
                <div className='form-group'>
                  <textarea
                    placeholder="Code Input"
                    value={item.input}
                    onChange={(e) => handleContentChange(index, 'input', e.target.value)}
                    rows={10}
                  />
                  <textarea
                    placeholder="Code Output"
                    value={item.output}
                    onChange={(e) => handleContentChange(index, 'output', e.target.value)}
                    rows={10}
                  />
                </div>
              )}
              <button onClick={() => removeContent(index)}>Remove</button>
            </div>
          ))}

          <button type="button" onClick={addContent}>Add Content</button>
        </div>
      </>
    );
  };

  return (
    <ManagementTable
      type={'Lesson'}
      items={lessons}
      onSelectItem={onSelectLesson}
      itemAdd={lessonAdd}
      itemDetails={lessonDetails}
      itemEditing={lessonEditing}
      itemSubmit={handleSubmit}
      itemEdit={handleEdit}
      itemDelete={handleDelete}
    />
  );
};

export default LessonManagement;