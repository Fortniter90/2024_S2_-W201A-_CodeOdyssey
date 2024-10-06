import express from 'express';
import { verifyToken } from '../middleware/VerifyToken'; // Import the middleware
import admin from '../config/Firebase.js'; // Import Firebase config

const router = express.Router();

router.get('/user', verifyToken, async (req, res) => {

});

router.get('/status', verifyToken, (req, res) => {

});

router.get('/login', verifyToken, async (req, res) => {

});

router.get('/signup', verifyToken, async (req, res) => {

});

router.get('/signout', verifyToken, async (req, res) => {

});

export default router;
