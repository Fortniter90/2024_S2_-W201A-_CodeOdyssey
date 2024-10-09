import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Assuming you're using environment variables to store paths and secrets
const serviceAccountKeyPath = "codeodysseydatabase-firebase-adminsdk-y8i39-63be9f9f0b.json";

// Read and parse the service account JSON
const serviceAccount = JSON.parse(readFileSync(serviceAccountKeyPath, 'utf-8'));

// Initialize Firebase Admin SDK using the service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://console.firebase.google.com/project/codeodysseydatabase/'
});

export default admin;
export const db = admin.firestore();  // Firestore initialization

