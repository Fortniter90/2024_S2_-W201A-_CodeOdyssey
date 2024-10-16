import admin from '../config/Firebase.js';
const db = admin.firestore(); // Get Firestore instance from adminconst db = admin.firestore(); // Get Firestore instance from admin


async function createUser(email, password, name) {
  try {

    // Create a new user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      emailVerified: false,
      password: password,
      disabled: false,
      displayName: name,
    });
    console.log(userRecord.displayName);
    // Save user details to Firestore
    await db.collection('users').doc(userRecord.uid).set({
      name: name,
      courses: {},
    });

    console.log('Successfully created new user:', userRecord.uid);
  } catch (error) {
    console.error('Error creating new user:', error); // Log the error details
    throw new Error(`Failed to create user: ${error.message}`); // Throw a more specific error message
  }
}

async function deleteUser(uid) {
  try {
    const docRef = doc(db, 'users', uid); // Reference to Firestore document
    // Deletes the user's document from Firestore
    await deleteDoc(docRef);
    await deleteUser(uid);
  } catch (error) {
    console.log('Error deleting user:', error);
  }
}

async function revokeTokensAndLogTimestamp(uid) {
  try {
    // Revoke the refresh tokens for the user
    await admin.auth().revokeRefreshTokens(uid);

    // Fetch the updated user record
    const userRecord = await admin.auth().getUser(uid);

    // Convert tokensValidAfterTime to a timestamp in seconds
    const timestamp = new Date(userRecord.tokensValidAfterTime).getTime() / 1000;

    // Log the timestamp when the tokens were revoked
    console.log(`Tokens revoked at: ${timestamp}`);
  } catch (error) {
    // Handle any errors during the process
    console.error('Error revoking tokens:', error);
  }
};

async function loadUserData(uid) {
  try {
    const userDocRef = db.collection('users').doc(uid); // Use Firestore Admin SDK's collection and doc methods

    const userDocSnap = await userDocRef.get(); // Use get() to fetch the document

    if (userDocSnap.exists) { // Check if the document exists
      const userData = userDocSnap.data();
      console.log("User data fetched:", userData);

      if (userData.courses) {
        return userData.courses; // Return courses if they exist
      } else {
        throw new Error("Courses not found in document for userId: " + uid);
      }
    } else {
      throw new Error("No user document found for userId: " + uid);
    }
  } catch (error) {
    throw new Error("Error fetching user data from Firestore: " + error.message);
  }
}

export { createUser, deleteUser, revokeTokensAndLogTimestamp, loadUserData };

