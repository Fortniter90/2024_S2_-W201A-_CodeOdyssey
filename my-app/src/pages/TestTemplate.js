import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCourses, fetchLessons, fetchTests } from '../utils/dataFetching';
import { useAuth } from '../context/AuthContext';
import { saveUserAnswers } from '../utils/dataSaving';
import Button from '../components/Button';
import HintSystem from '../components/HintSystem';
import CodeEditor from '../components/CodeEditor';
import CompilerComponent from '../components/SubmitCode';
import NavigationBar from '../components/NavigationBar';
import LessonTestLayout from '../components/LessonTestLayout';
import Footer from '../components/Footer';
import Feedback from '../components/Feedback';
import './TestTemplate.css';
import TTS from '../components/TTS';

const TestTemplate = () => {
  const { courseId, lessonId } = useParams();
  const { currentUser } = useAuth();  // Get the user ID from the Auth context

  const [lesson, setLesson] = useState(null);
  const [tests, setTests] = useState(null);

  const [currentTestIndex, setCurrentTestIndex] = useState(0); // Track current test index
  const [userAnswers, setUserAnswers] = useState([]); // Track user input for all tests
  const [showAnswer, setShowAnswer] = useState(false); // Show correct answer toggle
  const [isCorrect, setIsCorrect] = useState(null); // Track if user's answer is correct
  const [language, setLanguage] = useState(null);

  const navigate = useNavigate();

  // Fetch lessons and tests when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      await loadLessons();
      await loadTests();
      await fetchLanguage();
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

  // Fetch all of the tests for the lesson
  const loadTests = async () => {
    try {
      const testList = await fetchTests(courseId, lessonId);
      setTests(Object.values(testList));

    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const fetchLanguage = async () => {
    try {
      // Fetch all courses from Firestore
      const coursesCollection = await fetchCourses();

      // Find the course object by its courseId
      const course = coursesCollection.find(item => item.id === courseId);

      if (course) {
        console.log(course.language);
        // If the course is found, set the language
        setLanguage(course.language);
      } else {
        console.error('Course not found for ID:', courseId);
      }
    } catch (error) {
      console.error('Error fetching course language:', error);
    }
  };

  const currentTest = tests ? tests[currentTestIndex] : null;

  // Toggle showing the correct answer
  const handleShowAnswer = () => setShowAnswer(!showAnswer);

  // Moves to the next test, cycling through the list
  const handleNextTest = () => {
    setCurrentTestIndex((prev) => (prev + 1) % tests.length);
    setIsCorrect(null);
    setShowAnswer(false);
  };

  // Moves to the previous test
  const handlePreviousTest = () => {
    setCurrentTestIndex((prev) => (prev - 1 + tests.length) % tests.length);
    setIsCorrect(null);
    setShowAnswer(false);
  };

  const goToCourse = () => {
    if (window.confirm("Are you sure you want to quit the test? All progress will be lost!")) {
      navigate(`/course/${courseId}`);
    }
  }

  const handleUserInputChange = useCallback((newCode) => {
    setUserAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentTestIndex] = newCode;
      return updatedAnswers;
    });
  }, [currentTestIndex]);


  // Function to save answers to Firestore
  const saveAnswers = async () => {
    try {
      const success = await saveUserAnswers(currentUser.uid, courseId, lessonId, tests, userAnswers);
      if (success) {
        alert('Answers saved successfully!');
        navigate(`/course/${courseId}`); // Navigate after saving
      }
    } catch (error) {
      alert(error.message); // Show error message
    }
  };

  if (!tests) return <div>Loading...</div>;

  if (tests.length === 0) return <div>No tests avaliable.</div>;

  // If the lesson is not yet loaded, show a loading message
  if (!lesson) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavigationBar />

      <LessonTestLayout 
        lesson={lesson}
        goTo={goToCourse}
      
        content={
          <div className='test-container'>

          <div className='test-header'>
            <HintSystem hint={currentTest.hint} testId={currentTest.number} />
            <h2 className='roboto-medium'>Question {currentTest.number}. {currentTest.question}</h2>
            <TTS text={`Question ${currentTest.number}. ${currentTest.question}`} />
          </div>

          <CodeEditor onCodeChange={handleUserInputChange} code={userAnswers[currentTestIndex] || ''} />
          
          
          <CompilerComponent 
            code={userAnswers[currentTestIndex] || ''} 
            answer={currentTest.requiredOutput} 
            language={language}
            showAnswer={<Button text={showAnswer ? 'HIDE ANSWER' : 'SHOW ANSWER'} outline={true} action={handleShowAnswer} color={'var(--green-medium)'} backgroundColor={'var(--background-light)'} hoverColor={'var(--green-dark)'} />}
            navigationButtons={
              <>
                {currentTestIndex !== 0 && <Button text={'PREVIOUS QUESTION'} outline={true} action={handlePreviousTest} backgroundColor={'var(--background-light)'} />}
                
                {currentTestIndex === tests.length - 1 ?
                  <Button text={'SAVE AND FINISH'} action={saveAnswers} color={'var(--orange-medium)'} backgroundColor={'var(--background-light)'} hoverColor={'var(--orange-dark)'} /> :
                  <Button text={'NEXT QUESTION'} action={handleNextTest} backgroundColor={'var(--background-light)'} />
                }
              </>
            }
          />

          {isCorrect !== null && (
            <div className="test-result roboto-bold">
              {isCorrect ? <p>Correct!</p> : <p>Incorrect. Please Try Again!</p>}
            </div>
          )}

          {showAnswer && (
            <div className='test-answer'>
              <h2 className='roboto-bold'>Correct Answer</h2>
              <pre>{currentTest.answer}</pre>
            </div>
          )}
        </div>
        }
      />
      <Feedback />
      <Footer />
    </div>
  );
};

export default TestTemplate;