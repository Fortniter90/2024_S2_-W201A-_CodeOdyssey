import admin from '../config/Firebase.js';
const db = admin.firestore(); // Get Firestore instance from adminconst db = admin.firestore(); // Get Firestore instance from admin

// Recursive function to delete all documents in a collection or subcollection
const deleteCollection = async (collectionRef, batchSize = 100) => {
  const query = collectionRef.limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(query, resolve, reject, 0);
  });
};

// Helper function to delete documents 
const deleteQueryBatch = async (query, resolve, reject, deletedCount) => {
  const snapshot = await query.get();

  // If there are no documents end the process
  if (snapshot.size === 0) {
    resolve(deletedCount);
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
    deleteQueryBatch(query, resolve, reject, deletedCount + snapshot.size);
  });
};

const removeCourseFromUsers = async (courseId) => {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();

  snapshot.forEach(async (userDoc) => {
    const userData = userDoc.data();
    const courses = userData.courses || {}; // Initialize an empty object if courses is not present

    // Check if the courseId exists as a key in the courses map
    if (courseId in courses) {
      const updatedCourses = { ...courses };
      delete updatedCourses[courseId]; // Remove the course from the map

      try {
        // Update the user document with the updated courses map
        await usersRef.doc(userDoc.id).update({ courses: updatedCourses });
        console.log(`Course ${courseId} removed from user ${userDoc.id}`);
      } catch (error) {
        console.error(`Error updating user ${userDoc.id} during course deletion:`, error);
      }
    }
  });
};

const removeLessonsFromUsers = async (courseId, lessonId) => {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();

  snapshot.forEach(async (userDoc) => {
    const userData = userDoc.data();
    const courses = userData.courses || {};

    // Check if the course exists in the user's courses map
    if (courseId in courses) {
      const course = { ...courses[courseId] };
      const lessons = course.lessons || {};

      // Check if the lesson exists and delete the specific lesson by lessonId
      if (lessonId in lessons) {
        delete lessons[lessonId]; // Remove the lesson 
      }

      // Update the user's courses if the lesson was deleted
      course.lessons = lessons;
      const updatedCourses = { ...courses, [courseId]: course };

      try {
        // Update the user document with the updated courses and lessons map
        await usersRef.doc(userDoc.id).update({ courses: updatedCourses });
        console.log(`Lesson ${lessonId} for course ${courseId} removed from user ${userDoc.id}`);
      } catch (error) {
        console.error(`Error updating user ${userDoc.id} during lesson deletion:`, error);
      }
    }
  });
};

// Function to delete a course

// Function to delete a course
export const deleteCourse = async (courseId) => {
  try {
    const courseRef = db.collection('courses').doc(courseId);
    const lessonsRef = courseRef.collection('lessons');

    await removeCourseFromUsers(courseId);

    // Get all lessons first to delete their associated tests
    const lessonsSnapshot = await lessonsRef.get();

    for (const lessonDoc of lessonsSnapshot.docs) {
      const lessonId = lessonDoc.id;
      const testsRef = lessonsRef.doc(lessonId).collection('tests');

      // Delete all tests for the current lesson
      const deletedTestsCount = await deleteCollection(testsRef);
      console.log(`Deleted ${deletedTestsCount} tests from lesson ${lessonId}`);

      // Delete the lesson itself after deleting its tests
    }

    // Delete all lessons
    const deletedLessonsCount = await deleteCollection(lessonsRef);
    console.log(`Deleted ${deletedLessonsCount} lessons`);

    // Finally, delete the course
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
    const testsRef = lessonRef.collection('tests');
    await removeLessonsFromUsers(courseId, lessonId);

    // Delete all tests
    const deletedTestsCount = await deleteCollection(testsRef);

    // Delete lesson
    await lessonRef.delete();

    // Decrement the lessonCount in the course document
    const courseRef = db.doc(`courses/${courseId}`);
    await courseRef.update({
      lessonCount: admin.firestore.FieldValue.increment(-1), // Decrement lessonCount by 1
      testCount: admin.firestore.FieldValue.increment(-deletedTestsCount), // Decrement testCount by the amount of tests deleted 
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
