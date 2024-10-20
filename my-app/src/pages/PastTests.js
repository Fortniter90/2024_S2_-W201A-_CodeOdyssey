import { useEffect, useState } from 'react';
import './PastTests.css';
import { useAuth } from '../context/AuthContext';
import { fetchCourses, fetchUsersAnswers } from '../utils/dataFetching';
import NavigationBar from '../components/NavigationBar';
import Feedback from '../components/Feedback';
import Footer from '../components/Footer';
import PastTestsCourse from '../components/PastTestsCourse';
import PastTestsLesson from '../components/PastTestsLesson';
import PastTestsTest from '../components/PastTestsTest';
import { FaArrowLeftLong } from 'react-icons/fa6';

function PastTest() {
  const { currentUser, isAuthenticated, usersCourses } = useAuth(); // Extracting user info

  const [activeTab, setActiveTab] = useState('dashboard'); // State to track the currently active tab
  const [selectedCourse, setSelectedCourse] = useState(null); // Store the selected course
  const [selectedLesson, setSelectedLesson] = useState(null); // Store the selected lesson

  const [answersData, setAnswersData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [testsData, setTestsData] = useState([]);
  const [lessonsData, setLessonsData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnswerData = async () => {
      if (!isAuthenticated) return;

      try {
        const { answers, allTests, allLessons } = await fetchUsersAnswers(currentUser.uid);
        setAnswersData(answers);
        setTestsData(allTests);
        setLessonsData(allLessons);
        console.log('answers:', allLessons);
      } catch (error) {
        setError(error.message); // Set error message if fetch fails
      }
    };

    fetchAnswerData();
  }, [currentUser, isAuthenticated]); // Include usersId in the dependency array

  // Function to render the appropriate management component based on the active tab
  const managementTab = () => {
    switch (activeTab) {
      case 'courses':
        return <PastTestsCourse onSelectCourse={handleSelectCourse} />;
      case 'lessons':
        return (
          <PastTestsLesson course={selectedCourse} lessons={lessonsData[selectedCourse]} onSelectLesson={handleSelectLesson} />
        );
      case 'tests':
        return (
          <PastTestsTest course={selectedCourse} lesson={selectedLesson} tests={testsData[selectedLesson]} />
        );
      default:
        return <PastTestsCourse courses={usersCourses} onSelectCourse={handleSelectCourse} />;
    }
  };

  // Function to handle course selection
  const handleSelectCourse = (courseId) => {
    setSelectedCourse(courseId);
    setActiveTab('lessons'); // Switch to lessons tab
  };

  // Function to handle lesson selection
  const handleSelectLesson = (lessonId) => {
    setSelectedLesson(lessonId);
    setActiveTab('tests'); // Switch to tests tab
  };

  // Function to handle going back in the tabs
  const handleGoBack = () => {
    if (activeTab === 'tests') {
      setActiveTab('lessons'); // Go back to lessons
      setSelectedLesson(null); // Reset selected lesson
    } else if (activeTab === 'lessons') {
      setActiveTab('courses'); // Go back to courses
      setSelectedCourse(null); // Reset selected course
    } 
    // If already on courses, do nothing or handle accordingly
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <NavigationBar />

      <div className='pasttests'>
        <h1 className='fira-code'>Past Tests</h1>

        <div className='pasttests-container'>
          {activeTab != 'courses' && (
            <div className='previous-link roboto-medium' onClick={handleGoBack}>
              <FaArrowLeftLong />
              Previous
            </div>
          )}
        
          <div className='pasttests-content'>
            {managementTab()}
          </div>
        </div>
      </div>

      <Feedback />
      <Footer />
    </div>
  );
}

export default PastTest;
