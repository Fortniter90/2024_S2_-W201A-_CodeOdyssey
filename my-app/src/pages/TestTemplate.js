import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NavigationBarUser from '../components/NavigationBarUser';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { fetchLessons, fetchTests } from '../utils/dataFetching';
import HintSystem from '../components/HintSystem';
import CodeEditor from '../components/CodeEditor';
import CompilerComponent from '../components/SubmitCode';
import { useAuth } from '../context/AuthContext';
import { saveUserAnswers } from '../utils/dataSaving';
import './TestTemplate.css';
import Button from '../components/Button';


const TestTemplate = () => {
  const { courseId, lessonId } = useParams();
  const { usersId } = useAuth();  // Get the user ID from the Auth context

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
      setLanguage(coursesCollection[courseId].language);
    } catch (error) {
      console.error('Error fetching course language:', error);
    }
  };

  const currentTest = tests ? tests[currentTestIndex] : null;

  // Toggle showing the correct answer
  const handleShowAnswer = () => setShowAnswer(true);
  const handleHideAnswer = () => setShowAnswer(false);

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
      const success = await saveUserAnswers(usersId, courseId, lessonId, tests, userAnswers);
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
      <NavigationBarUser />

      <div className='go-back-link roboto-medium' onClick={goToCourse}>
        <FaArrowLeftLong />
        Go Back
      </div>

      <div className='lessontemplate-header'>
        {/* Display the lesson ID and status */}
        <h2 className={`tag tag-blue roboto-bold`}>Lesson {lesson.number}</h2>
        <h1 className='title fira-code'>{lesson.title}</h1>
      </div>

      <div className='test-container'>

        <div className='test-header'>
          <h2 className='roboto-medium'>Question {currentTest.number}. {currentTest.question}</h2>
          <HintSystem hint={currentTest.hint} testId={currentTest.number} />
        </div>

        <CodeEditor onCodeChange={handleUserInputChange} code={userAnswers[currentTestIndex] || ''} />
        <CompilerComponent code={userAnswers[currentTestIndex] || ''} answer={currentTest.requiredOutput} language={language} />

        <div className='test-answer'>
          {showAnswer ? (
            <div className='answer'>
              <Button text={'HIDE ANSWER'} action={handleHideAnswer} />
              <h3>Correct Answer:</h3>
              <pre>{currentTest.answer}</pre>
            </div>
          ) : (
            <div className='answer'>
              <Button text={'SHOW ANSWER'} action={handleShowAnswer} />
            </div>
          )}
        </div>

        <div className='test-navigation'>
          {currentTestIndex !== 0 && <Button text={'PREVIOUS QUESTION'} outline={true} action={handlePreviousTest} />}
          {currentTestIndex === tests.length - 1 ?
            <Button text={'SAVE AND FINISH'} action={saveAnswers} /> :
            <Button text={'NEXT QUESTION'} action={handleNextTest} />
          }
        </div>

        {isCorrect !== null && (
          <div className="result">
            {isCorrect ? <p>Correct!</p> : <p>Incorrect. Please Try Again!</p>}
          </div>
        )}
      </div>

    </div>
  );
};

export default TestTemplate;
