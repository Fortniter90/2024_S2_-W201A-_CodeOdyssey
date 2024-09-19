import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import HintSystem from '../components/HintSystem';

/*
Disregard all code, it is just to test if the hint feature is working properly
Hardcoded course and lesson to test
*/
const HintTest = ({ courseId="WhWBHUFHy6M3eOHSxKfd", lessonId="vMDGQYKRWM8qdh5je5U2" }) => {
  const [tests, setTests] = useState(null);
  const [currentTestIndex, setCurrentTestIndex] = useState(0); // Track current test index

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const testsCollection = collection(db, `courses/${courseId}/lessons/${lessonId}/tests`);
        const testSnapshot = await getDocs(testsCollection);
        const testList = testSnapshot.docs.map((doc) => doc.data());
        setTests(testList);

      } catch (error) {
        console.error('Error fetching tests:', error);
        setTests([]);
      }
    };
    
    fetchTest();
  }, [courseId, lessonId]);

  if (!tests || tests.length === 0) return <div>Loading...</div>;

  const currentTest = tests[currentTestIndex];

  const handleNextTest = () => {
    setCurrentTestIndex((prev) => (prev + 1) % tests.length); 
  };

  const handlePreviousTest = () => {
    setCurrentTestIndex((prev) => (prev - 1 + tests.length) % tests.length); 
  };

  return (
    <div style={{margin: '20px', width: '400px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <h2>{currentTest.number}. {currentTest.question}</h2>

            {/* THIS IS THE ACTUAL CODE THAT LETS IT HAVE THE HINT BUTTON */}
            {/* ADD THIS TO TESTS */}
            <HintSystem hint={currentTest.hint} testId={currentTest.number} />
        </div>
      
        <div>
            <button onClick={handlePreviousTest}>Previous Test</button>
            <button onClick={handleNextTest}>Next Test</button>
        </div>
    </div>
  );
};

export default HintTest;