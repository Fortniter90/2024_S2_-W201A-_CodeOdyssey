
// Middleware to verify the Firebase ID token
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    console.log(token);
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log(decodedToken);
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export default verifyToken; // Use default export
