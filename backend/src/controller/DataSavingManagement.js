import admin from '../config/Firebase.js';
const db = admin.firestore(); // Get Firestore instance from adminconst db = admin.firestore(); // Get Firestore instance from admin

// Function to add a new course
export const saveCourse = async (courseData) => {
  try {
    const newCourseRef = db.collection('courses');
    await newCourseRef.add(courseData); // Save course to database
  } catch (error) {
    console.error('Error saving course:', error);
    throw error;
  }
};

// Function to update a pre-existing course
export const updateCourse = async (courseId, updatedCourseData) => {
  try {
    const courseRef = db.collection('courses').doc(courseId);
    await courseRef.update(updatedCourseData); // Update course in database
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

// Function to add a new lesson
export const saveLesson = async (courseId, lessonData) => {
  try {
    const courseRef = db.collection('courses').doc(courseId);
    const lessonsRef = courseRef.collection('lessons');

    // Add the new lesson document to the lessons subcollection
    const newLessonRef = await lessonsRef.add(lessonData);

    // Increment the testCount in the course and lesson documents
    await courseRef.update({
      lessonCount: admin.firestore.FieldValue.increment(1), // Increment testCount by 1
    });

    return { id: newLessonRef.id };
  } catch (error) {
    throw new Error(`Error saving lesson: ${error.message}`);
  }
};

// Function to update a pre-existing lesson
export const updateLesson = async (courseId, lessonId, lessonData) => {
  try {
    const lessonRef = db.collection('courses').doc(courseId).collection('lessons').doc(lessonId);
    await lessonRef.update(lessonData); // Update lesson in database
  } catch (error) {
    console.error('Error updating lesson:', error);
    throw error;
  }
};

// Function to add a new test
export const saveTest = async (courseId, lessonId, testData) => {
  try {
    const newTestRef = db.collection('courses').doc(courseId).collection('lessons').doc(lessonId).collection('tests');
    await newTestRef.add(testData);

    // Increment the testCount in the course and lesson documents
    const courseRef = db.collection('courses').doc(courseId);
    const lessonRef = db.collection('courses').doc(courseId).collection('lessons').doc(lessonId);

    await courseRef.update({
      testCount: admin.firestore.FieldValue.increment(1), // Increment testCount by 1
    });
    await lessonRef.update({
      testCount: admin.firestore.FieldValue.increment(1), // Increment testCount by 1
    });
  } catch (error) {
    console.error('Error saving test:', error);
    throw error;
  }
};

// Function to update a pre-existing test
export const updateTest = async (courseId, lessonId, testId, testData) => {
  try {
    const testRef = db.collection('courses').doc(courseId).collection('lessons').doc(lessonId).collection('tests').doc(testId);
    await testRef.update(testData);
  } catch (error) {
    console.error('Error updating test:', error);
    throw error;
  }
};

// Function to update the user's lesson progress
export const updateUserLessons = async (userId, levels, lesson, courseId) => {
  try {
    // Filter and collect the IDs of all completed lessons up to the current lesson
    const completedLessons = levels
      .filter(level => level.number <= lesson.number)
      .map(level => level.id);

    // Find the index of the current lesson and determine the next lesson, if any
    const currentLessonIndex = levels.findIndex(level => level.id === lesson.id);
    const nextLesson = levels[currentLessonIndex + 1];

    // Reference the user's document in the 'users' collection
    const userRef = db.collection('users').doc(userId);

    // Update the user's progress in the Firestore document, updating completed lessons
    // and setting the current lesson to the next one (or null if no next lesson)
    await userRef.update({
      [`courses.${courseId}.completedLessons`]: completedLessons,
      [`courses.${courseId}.currentLesson`]: nextLesson ? nextLesson.id : null
    });
  } catch (error) {
    console.error('Error updating current lesson:', error);
    throw error;
  }
};

// Function to initialize or update user course data if it doesn't already exist
export const updateUserCourseData = async (userId, courseId) => {
  try {
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get(); // Retrieve the user's data

    if (userSnap.exists) {
      const userData = userSnap.data();
      const userCourses = userData.courses || {};

      // If the user doesn't have data for the specific course, initialize it with empty values
      if (!userCourses[courseId]) {
        await userRef.update({
          [`courses.${courseId}`]: {
            currentLesson: '',
            completedLessons: []
          }
        });
      }
    } else {
      console.error('User not found');
    }
  } catch (error) {
    console.error('Error updating user course data:', error);
    throw error;
  }
};

// Function to save user's test answers in Firestore
export const saveUserAnswers = async (usersId, courseId, lessonId, tests, userAnswers) => {
  console.log('Saving answers for user:', usersId); // Log for tracking
  try {
    // Loop through each test and save the user's answer
    for (let i = 0; i < tests.length; i++) {
      const answerData = {
        courseId,
        lessonId,
        testId: tests[i].id,
        userAnswer: userAnswers[i],
      };

      console.log('Saving answer data:', answerData);

      // Add the answer to the 'answers' subcollection for the user, generating a unique document ID
      const docRef = await db.collection('users').doc(usersId).collection('answers').add(answerData);
      console.log('Document written with ID:', docRef.id); // Log the document ID
    }

    return true;
  } catch (error) {
    console.error('Error saving answers:', error);
    throw new Error('Failed to save answers. Please try again.');
  }
};

// Function to submit user feedback to Firestore
export const submitFeedback = async (userId, userEmail, feedback) => {
  try {
    // Add the feedback to the 'feedback' collection with the user's ID, email, and feedback content
    await db.collection('feedback').add({
      userId: userId,
      email: userEmail,
      feedback: feedback,
    });

  } catch (error) {
    console.error('Error submitting feedback:', error.message);
    throw new Error('Failed to submit feedback');
  }
};
;
