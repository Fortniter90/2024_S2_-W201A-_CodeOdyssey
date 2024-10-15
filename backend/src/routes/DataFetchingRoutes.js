import express from 'express';
import { fetchCourses, fetchTests, fetchLessons, fetchAllUsers, fetchUserAnswer, fetchUserCourseProgress, fetchAdminUsers, fetchUserAnswers } from '../controller/DataFetchManagement.js';

const fetchRouter = express.Router();

// Route to fetch all courses
fetchRouter.get('/course', async (req, res) => {
  console.log("fetching courses");
  try {
    const courses = await fetchCourses();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});

// Route to fetch all users
fetchRouter.get('/users', async (req, res) => {
  try {
    const users = await fetchAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });

  }
});

// Route to fetch lessons based on course ID
fetchRouter.get('/:courseId/lessons', async (req, res) => {
  const { courseId } = req.params;
  try {
    const lessons = await fetchLessons(courseId);
    res.status(200).json(lessons);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lessons', error: error.message });
  }
});

// Route to fetch tests based on course ID and lesson ID
fetchRouter.get('/:courseId/lessons/:lessonId/tests', async (req, res) => {
  const { courseId, lessonId } = req.params;
  try {
    const tests = await fetchTests(courseId, lessonId);
    res.status(200).json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tests', error: error.message });
  }
});

// Route to fetch user course progress
fetchRouter.get('/users/:userId/courses/:courseId/progress', async (req, res) => {
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

// Route to fetch all admins
fetchRouter.get('/users/admin', async (req, res) => {
  try {
    const adminUsers = await fetchAdminUsers();
    res.status(200).json(adminUsers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin users', error: error.message });
  }
});

// Route to fetch a users answers
fetchRouter.get('/users/:userId/answers', async (req, res) => {
  const { userId } = req.params;
  try {
    const userAnswers = await fetchUserAnswers(userId);
    res.status(200).json(userAnswers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin users', error: error.message });
  }
});

// Route to fetch a user answer
fetchRouter.get('/users/:userId/answers/:answer', async (req, res) => {
  const { userId, answer } = req.params;
  try {
    const userAnswer = await fetchUserAnswer(userId, answer);
    res.status(200).json(userAnswer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin users', error: error.message });
  }
});



export default fetchRouter;
