import express from 'express';
import admin from '../config/Firebase.js';
import verifyToken from '../middleware/VerifyToken.js'
import { updateUsername, updateProfilePicture, createUser, deleteUser, revokeTokensAndLogTimestamp, loadUserData } from '../controller/UserManagement.js'; // Adjust import according to your file structure

const authRouter = express.Router();

authRouter.get('/status', async (req, res) => {
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


authRouter.post('/signup', async (req, res) => {
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

authRouter.post('/signout', async (req, res) => {
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

authRouter.delete('/deleteuser', async (req, res) => {
  try {
    const { uid } = req.body;
    await deleteUser(uid);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting user',
      error: error.message,
    });
  }
});

authRouter.put(`/updateusername/:userId`, async (req, res) => {
  console.log("getting username");
  const { userId } = req.params;
  const { name } = req.body;

  try {
    await updateUsername(userId, name);
    res.json({ message: "Username updated" });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating username',
      error: error.message,
    });
  }
});

authRouter.put(`/updateprofilepicture/:userId`, async (req, res) => {
  console.log("getting user Data");
  const { userId } = req.params;
  const { profilePicture } = req.body;
  try {
    await updateProfilePicture(userId, profilePicture);
    res.json({ message: "Profile picture updated" });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating profile picture',
      error: error.message,
    });
  }
});

export default authRouter;
