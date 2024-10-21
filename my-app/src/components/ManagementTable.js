import { useState } from "react";
import Button from "./Button";
import Filter from "./Filter";
import Pagination from "./Pagination";
import Modal from "./Modal";
import "./ManagementTable.css";
import './DatabaseManagement.css';

const ManagementTable = ({  
    type="Item", 
    items,
    onSelectItem, 
    itemAdd,
    itemDetails,
    itemEditing,
    itemSubmit, 
    itemEdit,
    itemDelete, 
}) => {

    const [filteredItems, setFilteredItems] = useState(items);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;
    
    
    // Replace currentItems with filteredItems
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // States controling modal visibility
    const [modals, setModals] = useState({
        add: false,
        details: false,
        success: false,
        delete: false,
    })


    const [selectedItem, setSelectedItem] = useState(null);
    const [isEditing, setIsEditing] = useState(false);


    // Handle course selection for editing and viewing details
    const handleItemClick = (item) => {
      setSelectedItem(item);          // Set the selected item
      toggleModal('details', true); // Open the details modal
    };

    // Handle modal visibility
    const toggleModal = (modalName, state) => {
      setModals((prev) => ({ ...prev, [modalName]: state })); // Change state of given modal
  
      if (state == false) {
        setIsEditing(false); // Set editing mode
      }
    }

    // Handle preparing an item for editing
    const handleEdit = () => {
        itemEdit(selectedItem);
        setIsEditing(true);
    }

    // Handle submitting a new or updated item
    const handleSubmit = () => {
        itemSubmit(selectedItem, isEditing);
        setIsEditing(false);
    }

    // Handle deleteing an item
    const handleDelete = () => {
        itemDelete(selectedItem);
    }


    // Render message if no items are available
    const renderNoItems = () => <div>No items available.</div>;


    return (
        <div className='management roboto-regular'>
            <div className='management-header'>
                <h1 className='fira-code'>{type} Management</h1>
                <Button text={`Add ${type}`} action={() => toggleModal('add', true)} />
            </div>

            {/* Add Item Modal */}
            <Modal 
                isOpen={modals.add}
                onClose={() => toggleModal('add', false)}
                title={`Add New ${type}`}
                children={
                    <form onSubmit={(e) => { 
                        e.preventDefault();
                        handleSubmit(selectedItem, isEditing); 
                        toggleModal('add', false);
                    }}>
                    
                    {itemAdd()}
                    
                    <div className='modal-buttons'>
                        <Button type="submit" text="Add Course" />
                        <Button text="Cancel" outline={true} action={() => toggleModal('add', false)} />
                    </div>
                    </form>
                }
            />

            <div className='management-list-table'>
                <Filter
                    items={items}
                    setFilteredItems={setFilteredItems}
                />

                {/* List of items */}
                <div className='management-list'>
                    {currentItems.length > 0 ? (
                        currentItems.map((item) => (
                            <div
                                className='management-row'
                                key={item.id}
                                onClick={() => handleItemClick(item)} // Handle row click
                            >
                                <div className='management-title'>{item.title || item.question}</div>
                                <div className='management-list-right'>
                                    <div className='management-availability roboto-bold'>
                                        {item.available ? 'AVAILABLE' : 'UNAVAILABLE'}
                                    </div>
                                    <div className='management-counts'>
                                        {item.lessonCount !== undefined && <span>Lessons: {item.lessonCount || 0}</span>}
                                        {item.testCount !== undefined && <span>Tests: {item.testCount || 0}</span>}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        renderNoItems() // Call the function to render no items message
                    )}
                </div>
            </div>
            
            {/* Course Details and Edit Modal */}
            {selectedItem && (
                <Modal
                    isOpen={modals.details}
                    onClose={() => toggleModal('details', false)}
                    title={isEditing ? `Edit ${type}` : selectedItem.title}
                    children={
                        <>
                            {isEditing ? (
                                <form onSubmit={(e) => { 
                                    e.preventDefault();
                                    handleSubmit(selectedItem, isEditing); 
                                }}>
                                    {itemEditing()}

                                    <div className='modal-buttons'>
                                        <Button type="submit" text={`Update ${type}`} />
                                        <Button text="Cancel" outline={true} action={() => setIsEditing(false)} />
                                    </div>
                                </form>
                            ) : (
                                <>
                                    {itemDetails(selectedItem)}

                                    <hr className='modal-divider' />
                                    
                                    <div className='modal-buttons'>
                                        {onSelectItem ? <Button text={`Manage ${type} Content`} action={() => onSelectItem(selectedItem)} /> : <></>}
                                        
                                        <Button text={`Edit ${type}`} action={() => handleEdit(selectedItem)} />
                                        <Button text="Delete" outline={true} action={() => { toggleModal('details', false); toggleModal('delete', true) }} />
                                    </div>
                                </>
                            )}
                        </>
                    }
                    isCentered={false}
                />
            )}

            {/* Success Confirmation Modal */}
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
                        <p>Are you sure you want to delete this {type.toLocaleLowerCase()}?</p>
                        
                        <div className='modal-buttons'>
                            <Button text="Delete" action={() => { handleDelete(selectedItem); toggleModal('delete', false); toggleModal('success', true) }} />
                            <Button text="Cancel" outline={true} action={() => toggleModal('delete', false)} />
                        </div>
                    </>
                }
            />

            {/* Page navigation controls */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
}

export default ManagementTable;