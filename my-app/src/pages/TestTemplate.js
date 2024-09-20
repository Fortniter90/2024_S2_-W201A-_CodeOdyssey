import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import TestSystem from './TestSystem';
import NavigationBarUser from '../components/NavigationBarUser';

const TestTemplate = () => {
  const { courseId, lessonId } = useParams();

  return (
    <div>
        <NavigationBarUser />
        <TestSystem courseId={courseId} lessonId={lessonId} />
    </div>
  );
};

export default TestTemplate;