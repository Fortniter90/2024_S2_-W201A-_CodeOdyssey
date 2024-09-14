import React, { useState } from 'react';
import CourseManagement from '../components/CourseManagement'
import './DeveloperDashboard.css'
import LessonManagement from '../components/LessonManagement';
import TestManagement from '../components/TestManagement';
import { Link } from 'react-router-dom';


const DeveloperDashboard = () => {
    const [activeTab, setActiveTab] = useState('courses');

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
                <div className='developer-tabs'>
                    <button className={`developer-tabs-button roboto-bold ${activeTab == 'courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>Courses</button>
                    <button className={`developer-tabs-button roboto-bold ${activeTab == 'lessons' ? 'active' : ''}`} onClick={() => setActiveTab('lessons')}>Lessons</button>
                    <button className={`developer-tabs-button roboto-bold ${activeTab == 'tests' ? 'active' : ''}`} onClick={() => setActiveTab('tests')}>Tests</button>
                </div>

                <div className='developer-management'>
                    <div>Developer Dashboard -- account name -- <Link to={'/'}>go to home page</Link></div>
                    {managementTab()}
                </div>
            </div>
        </div>
    );
};

export default DeveloperDashboard;