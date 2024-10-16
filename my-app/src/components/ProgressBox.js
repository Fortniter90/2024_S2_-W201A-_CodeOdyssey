import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "./ProgressBox.css";
import { auth, db } from "../config/firebase";

const ProgressBox = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const coursesSnapshot = await getDocs(collection(db, "courses"));
            const fetchedCourses = [];

            for (const courseDoc of coursesSnapshot.docs) {
                const courseData = courseDoc.data();
                const courseId = courseDoc.id;
                const auth = getAuth();
                const user = auth.currentUser;

                let completedLessons = 0;
                if (user) {
                    const userDoc = await getDoc(doc(db, "users", user.uid));
                    const userData = userDoc.data();
                    const userCourses = userData?.courses || {};
                    completedLessons = userCourses[courseId]?.completedLessons?.length || 0;
                }

                fetchedCourses.push({
                    id: courseId,
                    title: courseData.title,
                    testCount: courseData.testCount,
                    color: courseData.color,
                    completedLessons,
                });
            }

            setCourses(fetchedCourses);
        };

        fetchCourses();
    }, []);

    return (
        <div className="progress-box">
            <div className="progress-tab">
                <span className="tab-text">PROGRESS</span>
            </div>
            <div className="progress-content">
                {courses.map((course) => (
                    <div className="progress-item" key={course.id}>
                        <div
                            className="progress-item-box"
                            style={{ backgroundColor: course.color }} 
                        >
                            <span className="progress-text">{course.title}</span>
                            <div className="progress-completed">
                                <span className="progress-status">
                                    Completed {course.completedLessons}/{course.testCount}
                                </span>
                            </div>
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{
                                        width: course.testCount
                                            ? `${(course.completedLessons / course.testCount) * 100}%`
                                            : "0%",
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProgressBox;