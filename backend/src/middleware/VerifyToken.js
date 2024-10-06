import admin from '../config/Firebase'; // Import Firebase config

// Middleware to verify the Firebase ID token
export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;  // Attach the decoded token to the request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
