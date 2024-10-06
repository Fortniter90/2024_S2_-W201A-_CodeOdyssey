// Import required modules using ES6 syntax
import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Assuming you're using environment variables to store paths and secrets
const serviceAccountKeyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH;

// Read and parse the service account JSON
const serviceAccount = JSON.parse(readFileSync(serviceAccountKeyPath, 'utf-8'));

// Initialize Firebase Admin SDK using the service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
});

// Export the initialized Firebase admin instance for use in other modules
export default admin;

