import express from 'express';
import { saveCourse, saveTest, saveLesson, saveUserAnswers, updateTest, updateCourse, updateLesson, updateUserLessons, updateUserCourseData } from '../controller/DataSavingManagement';

const router = express.Router();

// Route to add a new course
router.post('/courses', async (req, res) => {
  try {
    const courseData = req.body;
    await saveCourse(courseData);
    res.status(201).send({ message: 'Course saved successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route to update an existing course
router.put('/courses/:courseId', async (req, res) => {
  const { courseId } = req.params;
  const updatedCourseData = req.body;

  try {
    await updateCourse(courseId, updatedCourseData);
    res.send({ message: 'Course updated successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route to add a new lesson
router.post('/courses/:courseId/lessons', async (req, res) => {
  const { courseId } = req.params;
  const lessonData = req.body;

  try {
    await saveLesson(courseId, lessonData);
    res.status(201).send({ message: 'Lesson saved successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route to update an existing lesson
router.put('/courses/:courseId/lessons/:lessonId', async (req, res) => {
  const { courseId, lessonId } = req.params;
  const lessonData = req.body;

  try {
    await updateLesson(courseId, lessonId, lessonData);
    res.send({ message: 'Lesson updated successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route to add a new test
router.post('/courses/:courseId/lessons/:lessonId/tests', async (req, res) => {
  const { courseId, lessonId } = req.params;
  const testData = req.body;

  try {
    await saveTest(courseId, lessonId, testData);
    res.status(201).send({ message: 'Test saved successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route to update an existing test
router.put('/courses/:courseId/lessons/:lessonId/tests/:testId', async (req, res) => {
  const { courseId, lessonId, testId } = req.params;
  const testData = req.body;

  try {
    await updateTest(courseId, lessonId, testId, testData);
    res.send({ message: 'Test updated successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route to update user lessons
router.put('/users/:userId/lessons', async (req, res) => {
  const { userId } = req.params;
  const { levels, lesson, courseId } = req.body;

  try {
    await updateUserLessons(userId, levels, lesson, courseId);
    res.send({ message: 'User lessons updated successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route to update user course data
router.put('/users/:userId/courses/:courseId', async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    await updateUserCourseData(userId, courseId);
    res.send({ message: 'User course data updated successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Route to save user answers
router.post('/users/:userId/answers', async (req, res) => {
  const { userId } = req.params;
  const { courseId, lessonId, tests, userAnswers } = req.body;

  try {
    await saveUserAnswers(userId, courseId, lessonId, tests, userAnswers);
    res.status(201).send({ message: 'User answers saved successfully' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;

