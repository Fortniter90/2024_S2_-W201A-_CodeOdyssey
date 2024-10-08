import React, { useState, useEffect } from 'react';
import { fetchUserEmailByUID, loadAdmins, fetchAllUsers, setAdminStatus } from '../utils/dataFetching';
import { FaMagnifyingGlass, FaX, FaEllipsisVertical, FaEllipsis } from 'react-icons/fa6';
import Button from './Button';
import './DatabaseManagement.css';

// Database Management Dashboard Component
const ManagementDashboard = () => {
    

    return (
        <div className='management roboto-regular'>
            <div className='management-header'>
                <h1 className='fira-code'>Developer Dashboard</h1>
            </div>

            
        </div>
    );
};

export default ManagementDashboard;
