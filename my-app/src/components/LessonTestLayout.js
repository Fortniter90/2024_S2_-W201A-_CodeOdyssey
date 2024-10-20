import { FaArrowLeftLong } from "react-icons/fa6";
import "./LessonTestLayout.css"

// Component for the header of lessons and tests
const LessonTestLayout = ({ lesson, goTo, content }) => {
    return (
        <div className='lessontestlayout'>
            {/* Display the button to go back */}
            <div className='go-back-link roboto-medium' onClick={goTo}>
                <FaArrowLeftLong />
                Go Back
            </div>

            {/* Display the lesson number and status */}
            <div className='lessontestlayout-header'>
                <h2 className='roboto-bold'>Lesson {lesson.number}</h2>
                <h1 className='fira-code'>{lesson.title}</h1>
            </div>

            {content}
        </div>
    )
}

export default LessonTestLayout;