import admin from '../config/Firebase.js';
const db = admin.firestore(); // Get Firestore instance from adminconst db = admin.firestore(); // Get Firestore instance from admin

// Function to create a new user with some presets
async function createUser(email, password, name) {
  try {

    // Create a new user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      emailVerified: false,
      password: password,
      disabled: false,
      displayName: name,
      isAdmin: false,
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/codeodysseydatabase.appspot.com/o/profile_pictures%2Fdefaultprofilepic.png?alt=media&token=1a7119e5-c0a0-4d88-8433-bc7018602490',
    });
    // Save user details to Firestore
    await db.collection('users').doc(userRecord.uid).set({
      courses: {},
    });

    console.log('Successfully created new user:', userRecord.uid);
  } catch (error) {
    console.error('Error creating new user:', error); // Log the error details
    throw new Error(`Failed to create user: ${error.message}`); // Throw a more specific error message
  }
}

// Function to delete a user
async function deleteUser(uid) {
  try {
    await admin.auth().deleteUser(uid);
    const userDocRef = admin.firestore().collection('users').doc(uid);
    await userDocRef.delete();

    console.log(`Successfully deleted user and Firestore document for UID: ${uid}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error(`Failed to delete user: ${error.message}`);
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
    throw new Error('Error revoking tokens:', error);
  }
};

// Function to load user's data
async function loadUserData(uid) {
  try {
    const userDocRef = db.collection('users').doc(uid); // Use Firestore Admin SDK's collection and doc methods
    const userDocSnap = await userDocRef.get(); // Use get() to fetch the document

    if (userDocSnap.exists) { // Check if the document exists
      const userData = userDocSnap.data();
      console.log("User data fetched:", userData);

      const result = {};

      // Check if courses exist and add to the result
      if (userData.courses) {
        result.courses = userData.courses;
      } else {
        throw new Error("Courses not found in document for userId: " + uid);
      }

      // Check if isAdmin exists and add to the result only if true
      if (userData.isAdmin) {
        result.isAdmin = userData.isAdmin;
      }

      return result;

    } else {
      throw new Error("No user document found for userId: " + uid);
    }

  } catch (error) {
    throw new Error("Error fetching user data from Firestore: " + error.message);
  }
}

// Function to update user's profile picture
async function updateProfilePicture(uid, picture) {
  try {
    const userRecord = await admin.auth().updateUser(uid, {
      photoURL: picture
    });

    console.log("Successfully updated user's profile picture:", userRecord.photoURL);
  } catch (error) {
    console.error('Error updating profile picture:', error);
  }
}

// Function to update user's username
async function updateUsername(uid, name) {
  try {
    await admin.auth().updateUser(uid, {
      displayName: name
    });
    console.log("Successfully updated user's username",);
  } catch (error) {
    console.error('Error updating username:', error);
  }
}

// Function to update a user's admin status
export const setAdminStatus = async (userId, isAdmin) => {
  try {
    const userRef = db.collection('users').doc(userId);
    await userRef.update({ isAdmin: isAdmin });
    console.log(`Successfully updated admin status for user ${userId}`);
  } catch (error) {
    console.error('Error updating admin status:', error.message);
    throw new Error('Failed to update admin status');
  }
};

export { createUser, deleteUser, revokeTokensAndLogTimestamp, loadUserData, updateUsername, updateProfilePicture };
