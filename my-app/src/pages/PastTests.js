import { useEffect, useState } from 'react';
import './PastTests.css';
import { fetchUserAnswer, fetchTests, fetchLessons } from '../utils/DataFetching';

function PastTest() {
  const [answersData, setAnswersData] = useState([]);
  const [testsData, setTestsData] = useState({});
  const [lessonsData, setLessonsData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAnswerData = async () => {
      try {
        // Array of answer IDs to fetch
        const answerIds = ["TUdD7CP9EVbbwsc2gUsY", "nrJnhgnEyAVG4WjVOTZx"];
        
        // Fetch answers data
        const answersPromises = answerIds.map(id => fetchUserAnswer("lRBv2UvYYYPipLGH97p6W0L6DB62", id));
        const answers = await Promise.all(answersPromises);
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
        setError("Error fetching data.");
      }
    };

    getAnswerData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (answersData.length === 0 || Object.keys(testsData).length === 0 || Object.keys(lessonsData).length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
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