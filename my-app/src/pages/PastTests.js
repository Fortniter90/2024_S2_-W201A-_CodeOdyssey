import { useEffect, useState } from 'react';
import './PastTests.css';
import NavigationBarUser from '../components/NavigationBarUser';
import { useAuth } from '../context/AuthContext';
import { fetchUsersAnswers } from '../utils/dataFetching';

function PastTest() {
  const { currentUser } = useAuth();    // Extracting user info
  const [answersData, setAnswersData] = useState([]);
  const [testsData, setTestsData] = useState({});
  const [lessonsData, setLessonsData] = useState({});
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
        } catch (err) {
          setError(err.message);  // Set the error message from the caught error
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchAnswerData();
  }, [currentUser]);

  // Handle the loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle error case
  if (error) {
    return <div>{error}</div>;
  }

  // Handle case where answersData is empty or user is not authenticated
  if (!answersData.length) {
    return <div>No answers available</div>;
  }

  return (
    <div>
      <NavigationBarUser />
      <h1>User Answer Details</h1>
      {answersData.map((answerData) => {
        const testData = testsData.find(test => test.id === answerData.testId);
        const lessonData = lessonsData.find(lesson => lesson.id === answerData.lessonId);

        return (
          <div key={answerData.testId}>
            <h2>{lessonData?.title || 'Lesson not available'}</h2>
            {testData ? (
              <div>
                <p><strong>Test Question:</strong> {testData.question}</p>
                <p><strong>Correct Answer:</strong> {testData.answer}</p>
              </div>
            ) : (
              <p>Test data not available</p>
            )}
            <p><strong>User Answer:</strong> {answerData.userAnswer}</p>
          </div>
        );
      })}
    </div>
  );
}

export default PastTest;

