import React, { useState } from 'react';
import CourseManagement from '../components/CourseManagement'
import './DeveloperDashboard.css'
import LessonManagement from '../components/LessonManagement';
import TestManagement from '../components/TestManagement';
import { Link } from 'react-router-dom';

// DeveloperDashboard to allow developers to easily manage course, lesson, and test information
const DeveloperDashboard = () => {
    const [activeTab, setActiveTab] = useState('courses'); // State to track the currently active tab

    // Function to render the appropriate management component based on the active tab
    const managementTab = () => {
        switch (activeTab) {
            case 'courses':
                return <CourseManagement/>;
            case 'lessons':
                return <LessonManagement/>;
            default: 
                return <TestManagement/>;
        }
    };

    return (
        <div className='developer-dashboard'>
            <div className='page-content'>
                {/* Tab buttons for selecting Courses, Lessons, or Tests management */}
                <div className='developer-tabs'>
                    <button className={`developer-tabs-button roboto-bold ${activeTab == 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>Courses</button>
                    <button className={`developer-tabs-button roboto-bold ${activeTab == 'lessons' ? 'active' : ''}`} onClick={() => setActiveTab('lessons')}>Lessons</button>
                    <button className={`developer-tabs-button roboto-bold ${activeTab == 'tests' ? 'active' : ''}`} onClick={() => setActiveTab('tests')}>Tests</button>
                </div>

                {/* Display the appropriate management component based on the active tab */}
                <div className='developer-management'>
                    <div>Developer Dashboard -- account name -- <Link to={'/'}>go to home page</Link></div>
                    {managementTab()}
                </div>
            </div>
        </div>
    );
};

export default DeveloperDashboard;