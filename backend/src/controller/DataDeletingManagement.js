import admin from '../config/Firebase.js';
const db = admin.firestore(); // Get Firestore instance from adminconst db = admin.firestore(); // Get Firestore instance from admin

// Recursive function to delete all documents in a collection or subcollection
const deleteCollection = async (collectionRef, batchSize = 100) => {
  const query = collectionRef.limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(query, resolve, reject);
  });
};

// Helper function to delete documents 
const deleteQueryBatch = async (query, resolve, reject) => {
  const snapshot = await query.get();

  // If there are no documents end the process
  if (snapshot.size === 0) {
    resolve();
    return;
  }

  // Delete documents in a batch
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  // Recursively delete the next batch
  process.nextTick(() => {
    deleteQueryBatch(query, resolve, reject);
  });
};

// Function to delete a course
export const deleteCourse = async (courseId) => {
  try {
    const courseRef = db.collection('courses').doc(courseId);

    // Delete all lessons 
    const lessonsRef = courseRef.collection('lessons');
    await deleteCollection(lessonsRef);

    // Delete all tests 
    const testsRef = courseRef.collection('tests');
    await deleteCollection(testsRef);

    // Delete course
    await courseRef.delete();
    console.log(`Course ${courseId} and its contents were deleted.`);
  } catch (error) {
    console.error('Error deleting course and its contents:', error);
    throw error;
  }
};

// Function to delete a lesson
export const deleteLesson = async (courseId, lessonId) => {
  try {
    const lessonRef = db.doc(`courses/${courseId}/lessons/${lessonId}`);
    const testsRef = courseRef.collection('tests');

    // Delete all tests
    await deleteCollection(testsRef);

    // Delete lesson
    await lessonRef.delete();

    // Decrement the lessonCount in the course document
    const courseRef = db.doc(`courses/${courseId}`);
    await courseRef.update({
      lessonCount: admin.firestore.FieldValue.increment(-1), // Decrement lessonCount by 1
    });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
};

// Function to delete a test
export const deleteTest = async (courseId, lessonId, testId) => {
  try {
    const testRef = db.doc(`courses/${courseId}/lessons/${lessonId}/tests/${testId}`);

    // Delte teset
    await testRef.delete();

    // Decrement the testCount in both the course and lesson documents
    const courseRef = db.doc(`courses/${courseId}`);
    await courseRef.update({
      testCount: admin.firestore.FieldValue.increment(-1), // Decrement testCount by 1
    });

    const lessonRef = db.doc(`courses/${courseId}/lessons/${lessonId}`);
    await lessonRef.update({
      testCount: admin.firestore.FieldValue.increment(-1), // Decrement testCount by 1
    });
  } catch (error) {
    console.error('Error deleting test:', error);
    throw error;
  }
};

// Function to delete feedback
export const deleteFeedback = async (feedbackId) => {
  try {
    const feedbackRef = db.doc(`feedback/${feedbackId}`);

    // Delete feedback
    await feedbackRef.delete();
  } catch (error) {
    console.error('Error deleting feedback:', error);
    throw error;
  }
};
