import { useEffect, useState } from 'react';
import './PastTests.css';
import { fetchUserAnswer, fetchTests, fetchLessons } from '../utils/DataFetching';
import NavigationBarUser from '../components/NavigationBarUser';
import { useAuth } from '../context/AuthContext';
import { fetchUserAnswerData } from '../utils/DataFetching';

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
                const { answers, allTests, allLessons } = await fetchUserAnswerData(usersId);
                setAnswersData(answers);
                setTestsData(allTests);
                setLessonsData(allLessons);
            } catch (error) {
                setError(error.message); // Set error message if fetch fails
            }
        }
    };

    fetchAnswerData();
}, [usersId]); // Include usersId in the dependency array
  

  if (error) {
    return <div>{error}</div>;
  }

  if (answersData.length === 0 || Object.keys(testsData).length === 0 || Object.keys(lessonsData).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavigationBarUser />

      <h1>User Answer Details</h1>
      {answersData.map((answerData, index) => {
        const testData = testsData[answerData.testId];
        const lessonData = lessonsData[answerData.lessonId];

        return (
          <div key={answerData.testId}>
            <h2>{lessonData.title}</h2>
            {testData && (
              <div>
                <p><strong>Test Question:</strong> {testData.question}</p>
                <p><strong>Correct Answer:</strong> {testData.answer}</p>
              </div>
            )}
            <p><strong>User Answer:</strong> {answerData.userAnswer}</p>
          </div>
        );
      })}
    </div>
  );
}

export default PastTest;