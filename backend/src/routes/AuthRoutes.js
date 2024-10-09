import express from 'express';
import admin from '../config/Firebase.js';
import verifyToken from '../middleware/VerifyToken.js'
import { createUser, deleteUser, revokeTokensAndLogTimestamp, loadUserData } from '../controller/UserManagement.js'; // Adjust import according to your file structure

const router = express.Router();

router.get('/status', async (req, res) => {
  console.log("check");

  const token = req.headers.authorization?.split('Bearer ')[1]; // Extract the token from the Authorization header

  if (token) {
    try {
      // Verify the token using Firebase Admin SDK
      const user = await admin.auth().verifyIdToken(token);
      res.json({ isAuthenticated: true, user });
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(401).json({ isAuthenticated: false });
    }
  } else {
    // If no token is provided, respond with unauthenticated status
    console.log("Ltoken");
    res.json({ isAuthenticated: false });
  }
});


router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;

  console.log("attemp to signup");

  console.log(email);

  try {
    await createUser(email, password, name);
    res.status(201).json({
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating user",
      error: error.message,
    });
  }
});

router.post('/signout', async (req, res) => {
  try {
    const { user } = req.body;
    // Attempt to revoke tokens for the authenticated user
    await revokeTokensAndLogTimestamp(user.uid); // Assuming uid is available in req.user
    res.json({ message: 'User signed out successfully' });
  } catch (error) {
    console.error('Error during sign out:', error); // Log the error for debugging
    res.status(500).json({
      message: 'Error signing out user',
      error: error.message,
    });
  }
});

router.get('/deleteuser', verifyToken, async (req, res) => {
  console.log("getting");
  try {
    await deleteUser(req.user.uid);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting user',
      error: error.message,
    });
  }
});

router.get(`/userdata/:userId`, async (req, res) => {
  const { userId } = req.params;
  try {
    const courses = await loadUserData(userId);
    res.json({ courses });
  } catch (error) {
    res.status(500).json({
      message: 'Error getting Courses',
      error: error.message,
    });
  }
});



export default router;
