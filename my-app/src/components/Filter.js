import { useState, useEffect } from 'react';
import { FaMagnifyingGlass } from 'react-icons/fa6';
import './Filter.css';


// Component to filter through searching and a dropdown menu
const Filter = ({ items, setFilteredItems }) => {

    // States controlling filtering and searching
    const [filter, setFilter] = useState('all');        // Control the filter dropdown
    const [searchTerm, setSearchTerm] = useState('');   // Hold the search term for filtering courses


    // Effect to filter items when inputs change
    useEffect(() => {
        filterItems(items);
    }, [items, filter, searchTerm]);

    // Filter items based on the search term and filter type
    const filterItems = (items) => {
        // Filter items based on the search term and filter type
        const filteredItems = items.filter((item) => {
            const title = item.title ? item.title.toLowerCase() : ''; // Safely access title
            const matchesSearch = title.includes(searchTerm.toLowerCase());
            const matchesFilter =
                filter === 'all' ||
                (filter === 'available' && item.available) ||
                (filter === 'unavailable' && !item.available);

            return matchesSearch && matchesFilter;
        });

        setFilteredItems(filteredItems); // Pass the filtered items back to the parent
    };


    return (
        <div className='filter'>
            {/* Dropdown for filtering by availability */}
            <div className='dropdown-container'>
                <select
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">Show All</option>
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                </select>
            </div>

            {/* Search bar */}
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
    );
};

export default Filter;