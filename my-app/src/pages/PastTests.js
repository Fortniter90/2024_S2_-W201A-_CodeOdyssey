import { useEffect, useState } from 'react';
import './PastTests.css';
import { fetchUserAnswer, fetchTests, fetchLessons } from '../utils/DataFetching';
import NavigationBarUser from '../components/NavigationBarUser';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

function PastTest() {
  const { currentuser, isAuthenticated, usersId, usersName, usersCourses } = useAuth();    // Extracting user info
  const [answersData, setAnswersData] = useState([]);
  const [testsData, setTestsData] = useState({});
  const [lessonsData, setLessonsData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAnswerData = async () => {
      try {
        // Fetch all answers for the user
        const answersCollection = collection(db, `users/${usersId}/answers`);
        const answersSnapshot = await getDocs(answersCollection);

        // Map over the documents to create an array of answer data
        const answers = answersSnapshot.docs.map(doc => ({
          id: doc.id, // Store the document ID
          ...doc.data(), // Spread the answer data
        }));

        setAnswersData(answers);

        if (answers.length > 0) {
          const firstAnswer = answers[0];

          // Fetch all tests for the course and lesson
          const allTests = await fetchTests(firstAnswer.courseId, firstAnswer.lessonId);
          setTestsData(allTests);

          // Fetch lesson data
          const allLessons = await fetchLessons(firstAnswer.courseId);
          setLessonsData(allLessons);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data.");
      }
    };

    if (usersId) { // Ensure usersId is available before fetching data
      getAnswerData();
    }
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
