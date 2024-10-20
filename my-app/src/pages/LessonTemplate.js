import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import './LessonTemplate.css';
import Button from '../components/Button';
import { fetchLessons } from '../utils/dataFetching';
import NavigationBar from '../components/NavigationBar';
import LessonTestLayout from '../components/LessonTestLayout';
import Footer from '../components/Footer';
import Feedback from '../components/Feedback';

const LessonTemplate = () => {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const navigate = useNavigate();

  // Fetch lessons and tests when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      await loadLessons();
    };

    fetchData(); // Call the async function
  }, [courseId, lessonId]);

  // Fetch all lessons for the course
  const loadLessons = async () => {
    try {
      const lessonList = await fetchLessons(courseId); // Fetch list of lessons

      // Find the specific lesson that matches the current lessonId
      const selectedLesson = lessonList.find(lesson => lesson.id === lessonId);

      if (selectedLesson) {
        setLesson(selectedLesson); // Update the state with the specific lesson
      } else {
        console.error('Lesson not found');
        setLesson(null); // Clear the lesson state if not found
      }
    } catch (error) {
      console.error('Error loading lessons:', error); // Log any errors during data fetching
    }
  };

  const goToCourse = () => {
    navigate(`/course/${courseId}`);
  }

  const goToTests = () => {
    navigate(`/course/${courseId}/lesson/${lessonId}/test`);
  };

  if (!lesson) return <div>Loading...</div>;

  return (
    <div>
      <NavigationBar />

      <LessonTestLayout
        lesson={lesson}
        goTo={goToCourse}

        content={
          <div className='lessonpage'>
            {lesson.content?.map((item, index) => (
              <div key={index} className='lesson-content roboto-regular'>
                {item.type === 'text' && <p>{item.content}</p>}
                
                {item.type === 'code' && (
                  <div className='example'>
                    <div className='code-example'>
                      <h2>Code Example:</h2>
                      <pre>{item.input}</pre>
                    </div>
                    
                    <div className='code-example'>
                      <h2>Output:</h2>
                      <pre>{item.output}</pre>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div className='lesson-buttons'>
              <Button text={'RETURN TO COURSE'} outline={true} action={goToCourse} backgroundColor={'var(--background-medium)'} />
              <Button text={'GO TO TESTS'} action={goToTests} backgroundColor={'var(--background-medium)'} />
            </div>
          </div>
        }
      />

      <Feedback />
      <Footer />
    </div>
  );
};

export default LessonTemplate;
