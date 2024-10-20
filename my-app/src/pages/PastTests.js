import { useEffect, useState } from 'react';
import './PastTests.css';
import { useAuth } from '../context/AuthContext';
import { fetchUsersAnswers } from '../utils/dataFetching';
import NavigationBar from '../components/NavigationBar';
import Feedback from '../components/Feedback';
import Footer from '../components/Footer';

function PastTest() {
  const { currentuser, isAuthenticated, usersId, usersName, usersCourses } = useAuth();    // Extracting user info
  const [answersData, setAnswersData] = useState([]);
  const [testsData, setTestsData] = useState({});
  const [lessonsData, setLessonsData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnswerData = async () => {
      if (usersId) { // Ensure usersId is available before fetching data
        try {
          const { answers, allTests, allLessons } = await fetchUsersAnswers(usersId);
          setAnswersData(answers);
          setTestsData(allTests);
          setLessonsData(allLessons);
        } catch (error) {
          setError(error.message); // Set error message if fetch fails
        }
      }
    };


    fetchAnswerData();
    console.log(answersData);
  }, [usersId]); // Include usersId in the dependency array


  if (error) {
    return <div>{error}</div>;
  }

  if (false) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavigationBar />

      <div className='pasttests'>
        <h1 className='fira-code'>Past Tests</h1>

        <div>


        </div>
      </div>

      <Feedback />
      <Footer />
    </div>
  );
}

export default PastTest;
