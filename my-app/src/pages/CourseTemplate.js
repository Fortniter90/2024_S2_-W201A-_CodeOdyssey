import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

const CourseTemplate = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    const fetchCourse = async () => {
      const courseRef = doc(db, 'courses', courseId);
      const courseSnap = await getDoc(courseRef);

      if (courseSnap.exists()) {
        setCourse({ id: courseSnap.id, ...courseSnap.data() });
      } else {
        console.error('Course not found');
      }
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    const fetchLessons = async () => {
        const lessonsCollection = collection(db, `courses/${courseId}/lessons`);
        const lessonSnapshot = await getDocs(lessonsCollection);
        const lessonList = lessonSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLessons(lessonList);
    };
    fetchLessons();
  }, [courseId]);

  if (!course) {
    return <div>Loading course information...</div>;
  }

  return (
    <div>
      <Link to={'../'}>Back</Link>

      <h1>Showing Course: {course.title}</h1>
      <p><strong>Description:</strong> {course.description}</p>

      <h2>Lessons for {course.title}</h2>

      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link to={`/course/${courseId}/lesson/${lesson.id}`}>
              <h3>{lesson.title}</h3>
              <p><strong>Lesson Number:</strong> {lesson.number}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseTemplate;

