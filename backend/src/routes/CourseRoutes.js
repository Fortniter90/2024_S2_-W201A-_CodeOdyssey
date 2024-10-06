import express from 'express';
import { verifyToken } from '../middleware/VerifyToken'; // Import the middleware
import admin from '../config/Firebase.js'; // Import Firebase config

const router = express.Router();

router.get('/courses', verifyToken, async (req, res) => {

});

router.get('/courses/${courseId}/lessons', verifyToken, (req, res) => {

});

router.get('/courses/:courseId/lessons/:lessonId', verifyToken, async (req, res) => {

});

router.get('/courses/:courseId/lessons/:lessonId/tests', verifyToken, async (req, res) => {

});

export default router;
