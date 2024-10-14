import { useState } from "react";
import Button from "./Button";
import "./ManagementTable.css";
import { FaMagnifyingGlass } from "react-icons/fa6";

const ManagementTable = ({  
    items,
    onRowClick,
    renderNoItems,
}) => {

    // States controlling filtering and searching
    const [filter, setFilter] = useState('all');        // Control the filter dropdown
    const [searchTerm, setSearchTerm] = useState('');   // Hold the search term for filtering courses

    // States controlling pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;

    // Calculate the index range for the current page for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    
    // Filter items based on the search term and filter type
    const filteredItems = items.filter((item) => {
        const title = item.title ? item.title.toLowerCase() : ''; // Safely access title
        const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter =
        filter === 'all' ||
        (filter === 'available' && item.available) ||
        (filter === 'unavailable' && !item.available);
    
        return matchesSearch && matchesFilter;
    });
    
    // Replace currentItems with filteredItems
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);


    return (
        <div className='management-list-table'>
            {/* Filtering and searching for items */}
            <div className='management-filters'>
                <div className='filter-dropdown'>
                {/* Dropdown for filtering by availability */}
                <select 
                    className='filter-select' 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">Show All</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                </select>
                </div>

                <div className='search-container roboto-regular'>
                <FaMagnifyingGlass className='search-icon' />
                <input 
                    type='text' 
                    placeholder='Type to search' 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                />
                </div>
            </div>

            {/* List of items */}
            <div className='management-list'>
                {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                        <div
                            className='management-row'
                            key={item.id}
                            onClick={() => onRowClick(item)} // Handle row click
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

            {/* Pagination buttons */}
            <div className='pagination'>
                <Button
                    text="Previous"
                    disabled={currentPage === 1}
                    action={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                />
                <span>
                    Page {currentPage} of {Math.ceil(items.length / itemsPerPage)}
                </span>
                <Button
                    text="Next"
                    disabled={currentPage === Math.ceil(items.length / itemsPerPage)}
                    action={() => setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(items.length / itemsPerPage)))}
                />
            </div>
        </div>
    );
}

export default ManagementTable;