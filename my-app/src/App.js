import './App.css';
import CourseHeadings from './components/CourseHeadings';

function App() {
  return (
    <div>
      <div className="Course">
        <CourseHeadings name="Python" 
        info="Some text explaining the language."
        backgroundColor="green"/>
      </div>
      
      <div className="Course">
        <CourseHeadings name="JavaScript" 
        info="Some text explaining the language."
        backgroundColor="orange"/>
      </div>
      
      <div className="Course">
        <CourseHeadings name="C" 
        info="Some text explaining the language."
        backgroundColor="blue"/>
      </div>
    </div>
  );
}

export default App;
