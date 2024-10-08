import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "./ProgressBox.css";
import { auth, db } from "../config/firebase"; 

const ProgressBox = () => {
    const [progress1] = useState(5);
    const [progress2, setProgress2] = useState(0); 
    const [totalLessons, setTotalLessons] = useState(0); 

    useEffect(() => {
        const fetchJavaCourseId = async () => {
            const coursesQuery = query(collection(db, "courses"), where("title", "==", "Java"));
            const querySnapshot = await getDocs(coursesQuery);

            if (!querySnapshot.empty) {
                const javaCourseDoc = querySnapshot.docs[0];
                const courseId = javaCourseDoc.id; 

                await fetchTotalLessons(courseId);

                await fetchCompletedLessons(courseId);
            } else {
                console.error("Java course not found.");
            }
        };

        const fetchCompletedLessons = async (courseId) => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const uid = user.uid;

                const userRef = doc(db, "users", uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const userCourses = userData.courses;

                    if (userCourses && userCourses[courseId]) {
                        const completedLessons = userCourses[courseId].completedLessons;
                        setProgress2(completedLessons.length); 
                    } else {
                        console.error("No completed lessons found for Java course.");
                    }
                } else {
                    console.error("No user data found.");
                }
            }
        };

        const fetchTotalLessons = async (courseId) => {
            const lessonsCollection = collection(db, "courses", courseId, "lessons");
            const lessonsSnapshot = await getDocs(lessonsCollection);

            if (!lessonsSnapshot.empty) {
                setTotalLessons(lessonsSnapshot.size); 
            } else {
                console.error("No lessons found for Java course.");
            }
        };

        fetchJavaCourseId();
    }, []);

    return (
        <div className="progress-box">
            <div className="progress-tab">
                <span className="tab-text">PROGRESS</span>
            </div>
            <div className="progress-content">
                <div className="progress-item">
                    <div className="progress-item-box progress-item-box1">
                        <span className="progress-text">Python</span>
                        <div className="progress-completed">
                            <span className="progress-status">Completed 5/10</span>
                        </div>
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar"
                                style={{ width: `${progress1 * 10}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="progress-item">
                    <div className="progress-item-box progress-item-box2">
                        <span className="progress-text">Java</span>
                        <div className="progress-completed">
                            <span className="progress-status">
                                Completed {progress2}/{totalLessons}
                            </span>
                        </div>
                        <div className="progress-bar-container">
                            <div
                                className="progress-bar"
                                style={{ width: totalLessons ? `${(progress2 / totalLessons) * 100}%` : '0%' }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgressBox;