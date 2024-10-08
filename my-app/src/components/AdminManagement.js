import React, { useState, useEffect } from 'react';
import { fetchUserEmailByUID, loadAdmins, fetchAllUsers, setAdminStatus } from '../utils/dataFetching';
import { FaMagnifyingGlass, FaX, FaEllipsisVertical, FaEllipsis } from 'react-icons/fa6';
import Button from './Button';
import './DatabaseManagement.css';

// Admin Management Component
const AdminManagement = () => {
    // States holding users
    const [allUsers, setAllUsers] = useState([]);                           // Hold all users
    const [adminUsers, setAdminUsers] = useState([]);                       // Hold admin users
    
    // States controling filtering and searching
    const [searchTerm, setSearchTerm] = useState('');                       // Hold the search term for filtering admins
    const [modalSearchTerm, setModalSearchTerm] = useState('');             // Search term in modal for adding admins
    const [filteredUsers, setFilteredUsers] = useState([]);                 // Hold filtered users based on search term

    // States managing modal and dropdown visibility
    const [modalActive, setModalActive] = useState(false);                  // Manage visibility of the modal for adding admins
    const [dropdownVisible, setDropdownVisible] = useState(null);           // Manage which dropdown is visible

    // States handling admin removal
    const [confirmationVisible, setConfirmationVisible] = useState(false);  // Control the visibility of the confirmation modal
    const [adminToRemove, setAdminToRemove] = useState(null);               // Track the admin being removed


    // Load all users when the component mounts
    useEffect(() => {
        const loadAllUsers = async () => {
            const users = await fetchAllUsers(); // Fetch all users from the backend
            setAllUsers(users);
        };

        const fetchAdmins = async () => {
            const adminUsers = await loadAdmins(); // Fetch admin users
            setAdminUsers(adminUsers); 
        };

        loadAllUsers();
        fetchAdmins();
    }, []); // Runs once when the component mounts

    // Handle opening the add admin modal
    const handleAdd = () => {
        setModalActive(true); // Set modal to active to show it
        setModalSearchTerm(''); // Clear the search term in the modal
        // Filter non-admin users to show in the modal
        const nonAdminUsers = allUsers.filter(user => !adminUsers.some(admin => admin.id === user.id));
        setFilteredUsers(nonAdminUsers); // Update filtered users for the modal
    };

    // Handle search input changes in the modal
    const handleModalSearchChange = (e) => {
        setModalSearchTerm(e.target.value); // Update the modal search term state
        // Filter all users based on the search term, excluding admin users
        const results = allUsers.filter(user =>
            user.name.toLowerCase().includes(e.target.value.toLowerCase()) && 
            !adminUsers.some(admin => admin.id === user.id)
        );
        setFilteredUsers(results); // Update filtered users based on the search
    };

    // Handle adding an admin
    const handleAddAdmin = async (userId) => {
        try {
            await setAdminStatus(userId, true); // Set the user as an admin
            setModalActive(false); // Close the modal
            // Optionally, refresh the list of admins
            const updatedAdminUsers = await loadAdmins(); // Fetch updated admin users
            const usersWithEmails = await Promise.all(
                updatedAdminUsers.map(async (user) => {
                    const email = await fetchUserEmailByUID(user.id); // Fetch email for each updated admin
                    return { ...user, email }; // Return the user object with email
                })
            );
            setAdminUsers(usersWithEmails); // Update state with the new admin users
        } catch (error) {
            console.error("Error adding admin:", error); // Log any error that occurs
        }
    };

    // Handle removing an admin
    const handleRemoveAdmin = (userId) => {
        setAdminToRemove(userId);       // Set the admin ID to remove
        setConfirmationVisible(true);   // Show confirmation dialog for removal
    };

    // Confirm the removal of an admin
    const confirmRemoveAdmin = async () => {
        if (adminToRemove) {
            await setAdminStatus(adminToRemove, false); // Set the admin status to false (remove admin)
            setConfirmationVisible(false); // Close the confirmation dialog
            // Refresh admin users after removal
            const updatedAdminUsers = await loadAdmins(); // Fetch updated admin users
            const usersWithEmails = await Promise.all(
                updatedAdminUsers.map(async (user) => {
                    const email = await fetchUserEmailByUID(user.id); // Fetch email for each updated admin
                    return { ...user, email }; // Return the user object with email
                })
            );
            setAdminUsers(usersWithEmails); // Update state with the new admin users
        }
    };

    // Toggle the visibility of the dropdown for each admin
    const handleDropdownToggle = (userId) => {
        setDropdownVisible(dropdownVisible === userId ? null : userId); // Toggle dropdown visibility
    };

    // Filter admin users based on the search term
    const filteredAdminUsers = adminUsers.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) // Check if admin name includes search term
    );


    return (
        <div className='management roboto-regular'>
            <div className='management-header'>
                <h1 className='fira-code'>Member Admin</h1>
                <Button text={'Add Admin'} action={handleAdd} />
            </div>

            <div className='management-filters'>
                <div className='search-container roboto-regular'>
                    <input 
                        type='text' 
                        placeholder='Search by name...' 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                    />
                    <FaMagnifyingGlass className='search-icon' />
                </div>
            </div>

            {modalActive && (
                <>
                    <div className='overlay' onClick={() => setModalActive(false)} />
                    <div className='modal'>
                        <button className='authpage-close' onClick={() => setModalActive(false)}><FaX /></button>
                        <h2>Add New Admin Account</h2>
                        <div className='modal-search-container roboto-regular'>
                            <input 
                                type='text' 
                                placeholder='Search by name...' 
                                value={modalSearchTerm} 
                                onChange={handleModalSearchChange} 
                            />
                            <FaMagnifyingGlass className='search-icon' />
                        </div>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <div 
                                    key={user.id} 
                                    className='modal-item' 
                                    onClick={() => handleAddAdmin(user.id)}
                                >
                                    {user.name}
                                </div>
                            ))
                        ) : (
                            <div className='modal-default'>No users shown. The user may already be an admin.</div>
                        )}
                    </div>
                </>
            )}

            <div className='table-container roboto-regular'>
                <table className='management-table'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAdminUsers.length > 0 ? (
                            filteredAdminUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>Profile Picture</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>

                                    {/* Dropdown for actions to perform on row */}
                                    <td>
                                        <div className='dropdown'>
                                            <button className='dropdown-trigger'><FaEllipsis /></button>
                                            <div className='menu'>
                                                <button onClick={() => handleRemoveAdmin(user.id)}>Remove Admin</button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No Admins Available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {confirmationVisible && (
                <div className='confirmation-dialog'>
                    <p>Are you sure you want to remove this admin status?</p>
                    <button onClick={confirmRemoveAdmin}>Yes</button>
                    <button onClick={() => setConfirmationVisible(false)}>No</button>
                </div>
            )}
        </div>
    );
};

export default AdminManagement;
