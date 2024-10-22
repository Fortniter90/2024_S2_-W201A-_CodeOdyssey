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

  const [activeTab, setActiveTab] = useState('courses'); // State to track the currently active tab
  const [selectedCourse, setSelectedCourse] = useState(null); // Store the selected course
  const [selectedLesson, setSelectedLesson] = useState(null); // Store the selected lesson

  const [answersData, setAnswersData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [testsData, setTestsData] = useState([]);
  const [lessonsData, setLessonsData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnswerData = async () => {
      if (currentUser && currentUser.uid) { // Wait for currentUser to be available
        try {
          const usersAnswers = await fetchUsersAnswers(currentUser.uid);
          console.log(usersAnswers);
          setAnswersData(usersAnswers.answers);
          setTestsData(usersAnswers.allTests);
          setLessonsData(usersAnswers.allLessons);

          console.log(lessonsData);
        } catch (err) {
          setError(err.message);  // Set the error message from the caught error
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchAnswerData();
  }, [currentUser]); // Include usersId in the dependency array

  // Function to render the appropriate management component based on the active tab
  const managementTab = () => {
    switch (activeTab) {
      case 'courses':
        return <PastTestsCourse onSelectCourse={handleSelectCourse} />;
      case 'lessons':
        return (
          <PastTestsLesson selectedCourse={selectedCourse} lessonsData={lessonsData} onSelectLesson={handleSelectLesson} />
        );
      case 'tests':
        return (
          <PastTestsTest testsData={testsData} answersData={answersData} />
        );
      default:
        return <PastTestsCourse onSelectCourse={handleSelectCourse} />;
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

  // Handle error case
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