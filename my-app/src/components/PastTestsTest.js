import { useAuth } from "../context/AuthContext";
import './PastTestsTest.css';

const PastTestsTest = ({ testsData, answersData }) => {
    const { isAuthenticated } = useAuth();
   
    if (!isAuthenticated) return;

    return (
        <>
            {testsData.map((test) => {
                const userAnswer = answersData.find(answer => answer.testId === test.id)?.userAnswer;

                return (
                    <div className="pasttest-test" key={test.id}>
                        <p className='roboto-medium'>{test.number}. {test.question}</p>

                        <pre>{userAnswer ? userAnswer : "No answer provided"}</pre>

                        <hr />
                    </div>
                )
            })}
        </>
    );
};

export default PastTestsTest;