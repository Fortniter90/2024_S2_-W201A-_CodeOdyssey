import admin from '../config/Firebase.js';
const db = admin.firestore(); // Get Firestore instance from adminconst db = admin.firestore(); // Get Firestore instance from admin
const FieldValue = admin.firestore.FieldValue;

// Function to add a new course
export const saveCourse = async (courseData) => {
  try {
    const newCourseRef = db.collection('courses');
    await newCourseRef.add(courseData);
  } catch (error) {
    console.error('Error saving course:', error);
    throw error;
  }
};

// Function to update a pre-existing course
export const updateCourse = async (courseId, updatedCourseData) => {
  try {
    const courseRef = db.collection('courses').doc(courseId);
    await courseRef.update(updatedCourseData);
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

    // Add a timestamp to the lesson data using FieldValue
    lessonData.createdAt = FieldValue.serverTimestamp();

    // Add the new lesson document to the lessons subcollection
    const newLessonRef = await lessonsRef.add(lessonData);

    console.log("Lesson saved with ID:", newLessonRef.id);
    return { id: newLessonRef.id };
  } catch (error) {
    throw new Error(`Error saving lesson: ${error.message}`);
  }
};

// Function to update a pre-existing lesson
export const updateLesson = async (courseId, lessonId, lessonData) => {
  try {
    const lessonRef = db.collection('courses').doc(courseId).collection('lessons').doc(lessonId);
    await lessonRef.update(lessonData);
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
      testCount: FieldValue.increment(1), // Increment testCount by 1
    });
    await lessonRef.update({
      testCount: FieldValue.increment(1), // Increment testCount by 1
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

// Function to update the user's lesson list
export const updateUserLessons = async (userId, levels, lesson, courseId) => {
  try {
    const completedLessons = levels
      .filter(level => level.number <= lesson.number)
      .map(level => level.id);

    const currentLessonIndex = levels.findIndex(level => level.id === lesson.id);
    const nextLesson = levels[currentLessonIndex + 1];

    const userRef = db.collection('users').doc(userId);

    await userRef.update({
      [`courses.${courseId}.completedLessons`]: completedLessons,
      [`courses.${courseId}.currentLesson`]: nextLesson ? nextLesson.id : null
    });
  } catch (error) {
    console.error('Error updating current lesson:', error);
    throw error;
  }
};

// Function to update user course data
export const updateUserCourseData = async (userId, courseId) => {
  try {
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
      const userData = userSnap.data();
      const userCourses = userData.courses || {};

      if (!userCourses[courseId]) {
        await userRef.update({
          [`courses.${courseId}`]: {
            currentLesson: '', // Empty string for currentLesson
            completedLessons: [] // Empty array for completedLessons
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

// Function to save answers to Firestore
export const saveUserAnswers = async (usersId, courseId, lessonId, tests, userAnswers) => {
  if (!usersId) {
    throw new Error('User ID is not available. Please log in.');
  }

  console.log('Saving answers for user:', usersId);

  try {
    for (let i = 0; i < tests.length; i++) {
      const answerData = {
        courseId,
        lessonId,
        testId: tests[i].id,
        userAnswer: userAnswers[i],
      };

      console.log('Saving answer data:', answerData);

      // Automatically generate a unique ID when adding a new answer document
      const docRef = await db.collection('users').doc(usersId).collection('answers').add(answerData);
      console.log('Document written with ID:', docRef.id);
    }

    return true;
  } catch (error) {
    console.error('Error saving answers:', error);
    throw new Error('Failed to save answers. Please try again.');
  }
};
