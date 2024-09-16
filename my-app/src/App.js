import './App.css';
import CourseHeadings from './components/CourseHeadings';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './config/firebase'; // Adjust the import according to your firebase config file

function App() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
    try {
      const coursesCollection = collection(db, 'courses');
      const courseSnapshot = await getDocs(coursesCollection);
      const courseList = courseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(courseList);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
    };

    fetchCourses();
    }, []);
  

  return (
    <div>
      {courses.length > 0 ? (
        courses.map((course) => (
          <div className="Course" key={course.id}>
            <CourseHeadings 
              name={course.title} 
              info={course.information} 
              backgroundColor={course.backgroundColor} 
            />
          </div>
        ))
      ) : (
        <p>No courses found.</p> // This will render if the courses array is empty
      )}
    </div>
  );
  
}

export default App;
