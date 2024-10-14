import React, { useState } from 'react';
import CourseManagement from '../components/CourseManagement';
import './DeveloperDashboard.css';
import LessonManagement from '../components/LessonManagement';
import TestManagement from '../components/TestManagement';
import CodeOdysseyLogo from '../components/assets/CodeOdysseyLogo';
import { Link } from 'react-router-dom';
import { FaBookBookmark, FaDesktop, FaFilePen, FaFolderClosed, FaHouse, FaUsers, FaTurnUp } from 'react-icons/fa6';
import AdminManagement from '../components/AdminManagement';
import ManagementDashboard from '../components/ManagementDashboard';

// DeveloperDashboard to allow developers to easily manage course, lesson, and test information
const DeveloperDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard'); // State to track the currently active tab
    const [selectedCourse, setSelectedCourse] = useState(null); // Store the selected course
    const [selectedLesson, setSelectedLesson] = useState(null); // Store the selected course

    // Handle course selection
    const handleCourseSelect = (course) => {
        setSelectedCourse(course);
        setActiveTab('lessons'); // Switch to lessons tab when course is selected
    };

    // Handle lesson selection
    const handleLessonSelect = (lesson) => {
        setSelectedLesson(lesson);
        setActiveTab('tests'); // Switch to lessons tab when course is selected
    };

    // Function to render the appropriate management component based on the active tab
    const managementTab = () => {
        switch (activeTab) {
            case 'dashboard':
                return <ManagementDashboard />;
            case 'courses':
                return <CourseManagement onSelectCourse={handleCourseSelect} />;
            case 'lessons':
                return (
                    <LessonManagement 
                        selectedCourse={selectedCourse} 
                        onSelectLesson={handleLessonSelect} // Pass the handler to select lesson
                    />
                );
            case 'tests':
                return (
                    <TestManagement 
                        selectedCourse={selectedCourse} 
                        selectedLesson={selectedLesson} 
                    />
                );
            case 'admin':
                return <AdminManagement />;
            default: 
                return <ManagementDashboard />;
        }
    };

    // Function to handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (tab !== 'lessons' && tab != 'tests') {
            setSelectedCourse(null); // Reset selected course when switching away from lessons
        }
        if (tab != 'tests') {
            setSelectedLesson(null); // Reset selected lesson when switching tabs
        }
    };

    return (
        <div className='developer-dashboard'>
            <div className='page-content'>
                {/* Tab buttons for selecting Courses, Lessons, or Tests management */}
                <div className='developer-left'>
                    <CodeOdysseyLogo width='10vw' darkBackground={true} />

                    <div className='developer-tabs'>
                        <button className={`roboto-bold ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => handleTabChange('dashboard')}>
                            <FaDesktop /> Dashboard
                        </button>

                        <button className={`roboto-bold ${activeTab === 'courses' ? 'active' : ''}`} onClick={() => handleTabChange('courses')}>
                            <FaFolderClosed /> Courses
                        </button>

                        {/* Conditionally render the Lessons tab if a course is selected */}
                        {selectedCourse && (
                            <button className={`roboto-bold ${activeTab === 'lessons' ? 'active' : ''}`} onClick={() => handleTabChange('lessons')}>
                                {/* Arrow indicator */}
                                <span className={`arrow-indicator ${activeTab === 'lessons' ? 'active' : ''}`}>
                                    <FaTurnUp style={{ transform: 'rotate(90deg)' }} />
                                </span>
                                <FaBookBookmark /> Lessons
                            </button>
                        )}

                        {/* Conditionally render the Tests tab if a course and lesson are selected */}
                        {selectedLesson && (
                            <button className={`roboto-bold ${activeTab === 'tests' ? 'active' : ''}`} onClick={() => handleTabChange('tests')}>
                                {/* Arrow indicator */}
                                <span className={`arrow-indicator ${activeTab === 'tests' ? 'active' : ''}`}>
                                    <FaTurnUp style={{ transform: 'rotate(90deg)' }} />
                                </span>
                                <FaFilePen /> Tests
                            </button>
                        )}

                        <button className={`roboto-bold ${activeTab === 'admin' ? 'active' : ''}`} onClick={() => handleTabChange('admin')}>
                            <FaUsers /> Admin
                        </button>
                    </div>
                </div>

                {/* Display the appropriate management component based on the active tab */}
                <div className='developer-management'>
                    <div className='developer-navbar roboto-medium'>
                        <Link to={'/'} className='home'><FaHouse /> Return to Home Page</Link>
                        <p>Account Name</p>
                    </div>
                    
                    {managementTab()}
                </div>
            </div>
        </div>
    );
};

export default DeveloperDashboard;
