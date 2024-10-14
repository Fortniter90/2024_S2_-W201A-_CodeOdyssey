import './HeadingsTest.css';
import CourseHeadings from '../components/CourseHeadings';
import { useEffect, useState } from 'react';
import { fetchCourses } from '../utils/DataFetching';

function HeadingsTest() {
  const [courses, setCourses] = useState([]);

  // Load courses component on mount
  useEffect(() => {
    loadCourses();
  }, []);

  // Load all of the courses
  const loadCourses = async () => {
    try {
      const courseList = await fetchCourses();  // Fetch list of courses
      setCourses(Object.values(courseList));    // Update the state with the fetched courses

    } catch (error) {
      console.error('Error loading courses:', error); // Log any errors during data fetching
    }
  };
  

  return (
    <div>
      {courses.length > 0 ? (
        courses.map((course) => (
          <div className='course' key={course.id}>
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

export default HeadingsTest;
