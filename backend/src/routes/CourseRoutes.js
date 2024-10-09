import express from 'express';
import {
  fetchCourses,
  fetchLessons,
  fetchTests,
  fetchUserCourseProgress,
} from '../controllers/DataManagement.js'; // Update this path based on your project structure

const courseRouter = express.Router();

// Route to fetch all courses
courseRouter.get('/course', async (req, res) => {
  try {
    const courses = await fetchCourses();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});

// Route to fetch lessons based on course ID
courseRouter.get('/:courseId/lessons', async (req, res) => {
  const { courseId } = req.params;
  try {
    const lessons = await fetchLessons(courseId);
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lessons', error: error.message });
  }
});

// Route to fetch tests based on course ID and lesson ID
courseRouter.get('/:courseId/lessons/:lessonId/tests', async (req, res) => {
  const { courseId, lessonId } = req.params;
  try {
    const tests = await fetchTests(courseId, lessonId);
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tests', error: error.message });
  }
});

// Route to fetch user course progress
courseRouter.get('/users/:userId/courses/:courseId/progress', async (req, res) => {
  const { userId, courseId } = req.params;
  try {
    const progress = await fetchUserCourseProgress(userId, courseId);
    if (progress) {
      res.status(200).json(progress);
    } else {
      res.status(404).json({ message: 'Course progress not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user course progress', error: error.message });
  }
});


// Update course

// Delete course
router.delete('/:courseId', deleteCourse);
export default courseRouter;
