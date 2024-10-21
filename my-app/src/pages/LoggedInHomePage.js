import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchCourses, fetchLessons } from "../utils/dataFetching.js";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import Button from "../components/Button.js";
import Feedback from "../components/Feedback";
import "./LoggedInHomePage.css";
import Footer from "../components/Footer.js";
import NavigationBar from "../components/NavigationBar.js";

const gradients = {
  green: 'linear-gradient(var(--python-light), var(--python-medium), var(--python-dark))',
  orange: 'linear-gradient(var(--java-light), var(--java-medium), var(--java-dark))',
  blue: 'linear-gradient(var(--c-light), var(--c-medium), var(--c-dark))'
};

// Main component for the logged in home page
const LoggedInHomePage = () => {
  // Destructure values from the authentication context
  const { currentUser, isAuthenticated, usersCourses, isAdmin, checkAuthStatus } = useAuth();

  // State variables storing data
  const [courseDetails, setCourseDetails] = useState([]);
  const [lessonDetails, setLessonDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Hook to navigate between different pages

  // Fetch course and lesson data whenever authentication status or user course changes
  useEffect(() => {
    const fetchData = async () => {
      checkAuthStatus();

      // If not authenticated, or if usersCourses is not available, do not attempt to fetch data
      if (!isAuthenticated || !usersCourses || Object.keys(usersCourses).length === 0) {
        setLoading(false);
        return;
      }

      try {
        // Fetch course data first
        const fetchedCourses = await fetchCourses();
        setCourseDetails(fetchedCourses);

        // Fetch lessons for each course the user is enrolled in, only if there are valid courses
        const lessonPromises = Object.keys(usersCourses).map(async (courseId) => {
          const course = fetchedCourses.find(course => course.id === courseId);
          if (course) {
            // Ensure the course exists in fetchedCourses before fetching lessons
            const lessons = await fetchLessons(courseId);
            return { [courseId]: lessons };
          }
          return null; // If no course found, return null to avoid errors
        });

        // Combine lessons data into a single object
        const lessonsData = (await Promise.all(lessonPromises)).reduce((acc, lessons) => {
          return lessons ? { ...acc, ...lessons } : acc;
        }, {});

        setLessonDetails(lessonsData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && usersCourses) {
      fetchData();
    }
  }, [isAuthenticated, usersCourses]); // Depend on usersCourses

  // Redirect to the homepage if not authenticated
  if (!isAuthenticated) return <p>Redirecting to homepage...</p>;

  // Show loading state while data is being fetched
  if (loading) return <p>Loading...</p>;

  // Show an error message if data fetching fails
  if (error) return <p>Error loading data: {error.message}</p>;

  // Navigation helper functions
  const navigateTo = (path) => () => navigate(path);
  const goToCourse = (courseId) => () => navigate(`./course/${courseId}`);
  const goToLesson = (courseId, lessonId) => () => navigate(`./course/${courseId}/lesson/${lessonId}`);

  return (
    <div>
      {/* User navigation bar */}
      <NavigationBar isLoggedIn={isAuthenticated} />

      {/* Content on the home page */}
      <div className='homepage-content'>

        {/* Home page header */}
        <div className='homepage-header'>
          <h1 className='fira-code'>Welcome, {currentUser.displayName || currentUser.name}</h1>

          {/* If the user is an admin, show button to navigate to the developer dashboard */}
          {isAdmin && <Button text="DEVELOPER DASHBOARD" action={navigateTo('/developerdashboard')} backgroundColor={'var(--background-dark)'} />}
        </div>

        {/* Render the "Recent Levels" section */}
        {courseDetails.length > 0 && lessonDetails ? (
          <Section title="RECENT LEVELS" emptyMessage="You Have No Recent Levels" onEmptyClick={navigateTo('./course')}>
            {Object.keys(usersCourses).map(courseId => {
              const course = usersCourses[courseId];
              const courseData = courseDetails.find(course => course.id === courseId) || {};
              const latestLesson = lessonDetails[courseId]?.find(lesson => lesson.id === course.currentLesson) || {};

              return (
                <div
                  className='recent-levels'
                  key={courseId}
                  style={{ backgroundImage: `linear-gradient(var(--${courseData.color}-light), var(--${courseData.color}-medium), var(--${courseData.color}-dark))` }}
                  onClick={goToLesson(courseId, latestLesson.id)}
                >
                  <p className='roboto-medium'>{courseData.title || 'Unknown Course'}</p>
                  <h3 className='fira-code'>{latestLesson.title || 'Unknown Lesson'}</h3>
                </div>
              );
            })}
          </Section>
        ) : (
          <p>No recent levels to display.</p>
        )}

        {/* Render the "Your Courses" section */}
        <Section title="YOUR COURSES" emptyMessage="You Have No Courses" onEmptyClick={navigateTo('./course')}>
          {Object.keys(usersCourses).map(courseId => {
            const courseData = courseDetails.find(course => course.id === courseId) || {};

            return (
              <div
                className='user-courses'
                key={courseId}
                style={{ backgroundImage: `linear-gradient(var(--${courseData.color}-light), var(--${courseData.color}-medium), var(--${courseData.color}-dark))` }}
                onClick={goToCourse(courseId)}
              >
                <h3 className='fira-code'>{courseData.title || 'Unknown Course'}</h3>
              </div>
            );
          })}
        </Section>
      </div>

      <Feedback />
      <Footer />
    </div>
  );
};

// Section component to render a titled section with content or an empty state
const Section = ({ title, children, emptyMessage, onEmptyClick }) => (
  <div className='recent-levels-container'>
    <h2 className='recent-levels-title roboto-bold'>{title}</h2>

    {children.length > 0 ? children : (
      <div className='recent-levels selected-courses-empty' onClick={onEmptyClick}>
        <h3 className='fira-code'>{emptyMessage}</h3>

        <div className='empty-align'>
          <p className='roboto-medium'>Start a new journey today!</p>
          <FaPlus className='faplus' />
        </div>
      </div>
    )}
  </div>
);

export default LoggedInHomePage;

