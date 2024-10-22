import React, { useState, useEffect } from 'react';
import { fetchAdminUsers, fetchUsers } from '../utils/dataFetching';
import { setAdminStatus } from '../utils/dataSaving';
import { FaMagnifyingGlass, FaEllipsis } from 'react-icons/fa6';
import Button from './Button';
import './DatabaseManagement.css';
import Modal from './Modal';
import './Filter.css';

// Admin Management Component
const AdminManagement = () => {
  // States holding users
  const [allUsers, setAllUsers] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);

  // State for search terms and filtered users
  const [searchTerm, setSearchTerm] = useState('');
  const [modalSearchTerm, setModalSearchTerm] = useState('');
  const [filteredNonAdminUsers, setFilteredNonAdminUsers] = useState([]);

  // States managing modal visibility and admin removal
  const [modals, setModals] = useState({
    add: false,
    success: false,
    delete: false,
  });
  const [adminToRemove, setAdminToRemove] = useState(null);

  // Load users and admin users when the component mounts
  useEffect(() => {
    const loadUsers = async () => {
      const users = await fetchUsers();
      const admins = await fetchAdminUsers();
      setAllUsers(users);
      setAdminUsers(admins);
    };
    loadUsers();
  }, []);

  // Toggle modal visibility
  const toggleModal = (modalName, state) => {
    setModals((prev) => ({ ...prev, [modalName]: state }));
  };

  // Open the "Add Admin" modal and filter non-admin users
  const handleAdd = () => {
    toggleModal('add', true);
    setModalSearchTerm('');
    filterNonAdminUsers(''); // Filter non-admin users initially when modal opens
  };

  // Filter non-admin users based on the modal search term
  const filterNonAdminUsers = (searchValue) => {
    const nonAdminUsers = allUsers.filter(
      (user) =>
        !adminUsers.some((admin) => admin.id === user.id) &&
        user.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredNonAdminUsers(nonAdminUsers);
  };

  // Handle search input changes in the modal
  const handleModalSearchChange = (e) => {
    const value = e.target.value;
    setModalSearchTerm(value);
    filterNonAdminUsers(value);
  };

  // Handle adding an admin
  const handleAddAdmin = async (userId) => {
    try {
      await setAdminStatus(userId, true);
      toggleModal('add', false);

      const updatedAdmins = await fetchAdminUsers();
      setAdminUsers(updatedAdmins);

    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };

  // Handle removing an admin
  const handleRemoveAdmin = async () => {
    try {
      await setAdminStatus(adminToRemove.id, false)
      const updatedAdmins = await fetchAdminUsers();
      setAdminUsers(updatedAdmins);

    } catch (error) {
      console.error("Error removing admin: ", error);
    }
  };

  // Filter admin users based on the search term
  const filteredAdminUsers = adminUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='management roboto-regular'>
      <div className='management-header'>
        <h1 className='fira-code'>Member Admin</h1>
        <Button text={'Add Admin'} action={handleAdd} />
      </div>

      <div className='filter'>
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

      <Modal
        isOpen={modals.add}
        onClose={() => toggleModal('add', false)}
        title={"Add New Admin"}
      >
        <div className='search-container roboto-regular' style={{ margin: 0 }}>
          <input
            type='text'
            placeholder='Search by name...'
            value={modalSearchTerm}
            onChange={handleModalSearchChange}
          />
          <FaMagnifyingGlass className='search-icon' />
        </div>

        {filteredNonAdminUsers.length > 0 ? (
          filteredNonAdminUsers.map((user) => (
            <div
              key={user.id}
              className='modal-item'
              onClick={() => handleAddAdmin(user.id)}
            >
              {user.name}
            </div>
          ))
        ) : (
          <div className='modal-default'>
            No users available. The user may already be an admin.
          </div>
        )}
      </Modal>

      <div className='table-container roboto-regular'>
        <table className='management-table'>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdminUsers.length > 0 ? (
              filteredAdminUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className='dropdown'>
                      <button className='dropdown-trigger'><FaEllipsis /></button>
                      <div className='menu'>
                        <Button text={"Remove Admin"} action={() => { toggleModal('delete', true); setAdminToRemove(user) }} />
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

      <Modal
        isOpen={modals.success}
        onClose={() => toggleModal('success', false)}
        title={'Success!'}
        children={
          <>
            <p>Action completed successfully.</p>
            <Button text="Close" action={() => toggleModal('success', false)} />
          </>
        }
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={modals.delete}
        onClose={() => toggleModal('delete', false)}
        title={'Delete Confirmation'}
        children={
          <>
            <p>Are you sure you want to remove this user as admin?</p>

            <div className='modal-buttons'>
              <Button text="Delete" action={() => { handleRemoveAdmin(); toggleModal('delete', false); toggleModal('success', true) }} />
              <Button text="Cancel" outline={true} action={() => toggleModal('delete', false)} />
            </div>
          </>
        }
      />
    </div>
  );
};

export default AdminManagement;
