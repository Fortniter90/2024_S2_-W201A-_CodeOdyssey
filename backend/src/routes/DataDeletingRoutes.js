import express from 'express';
import { deleteCourse, deleteLesson, deleteTest } from '../controller/DataDeletingManagement.js';

const deleteRouter = express.Router();

deleteRouter.delete('/courses/:courseId', async (req, res) => {
  const { courseId } = req.params;
  try {
    await deleteCourse(courseId);
    res.status(200).send({ messsage: 'Course successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
});

deleteRouter.delete('/courses/:courseId/lessons/:lessonId', async (req, res) => {
  const { courseId, lessonId } = req.params;
  try {
    deleteLesson(courseId, lessonId);
    res.status(200).send({ messsage: 'Lesson successfully deleted' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting lesson' });
  }
});

deleteRouter.delete('/courses/:courseId/lessons/:lessonId/tests/:testId', async (req, res) => {
  const { courseId, lessonId, testId } = req.params;
  try {
    deleteTest(courseId, lessonId, testId);
    res.status(200).send({ messsage: 'Test successfully deleted' });
  } catch (error) {
    res.status(500).send({ message: 'Error deleting test' });
  }
});

export default deleteRouter;


