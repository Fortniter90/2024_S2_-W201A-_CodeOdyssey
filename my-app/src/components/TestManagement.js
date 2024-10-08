import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';
import DatabaseTable from './DatabaseTable';
import Button from './Button';
import './DatabaseManagement.css';
import { fetchTests } from '../utils/dataFetching';
import { FaMagnifyingGlass } from 'react-icons/fa6';

// Management for the test collection in the database
const TestManagement = ({ selectedCourse, selectedLesson }) => {
  // State for tests
  const [tests, setTests] = useState([]);

  // States controling filtering and searching
  const [filter, setFilter] = useState('all');        // Control the filter dropdown
  const [searchTerm, setSearchTerm] = useState('');   // Hold the search term for filtering admins
  
  useEffect(() => {
    console.log(selectedCourse);

    // Fetch lessons whenever a new course is selected
    if (selectedCourse && selectedLesson) {
      loadTests();
    }
  }, [selectedCourse, selectedLesson]);

  // Fetch all lessons for the course
  const loadTests = async () => {
    try {
      const testList = await fetchTests(selectedCourse.id, selectedLesson.id);
      setTests(Object.values(testList));
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };
  
  // Handle opening the "Add Course" modal
  const handleAdd = () => {
    console.log("yes");
  };
  

  // Filter lessons based on filter (availability) and search term
  const filteredTests = tests.filter((test) => {
    // Match the lesson title with search term (case-insensitive)
    const matchesSearch = test.question.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by availability
    const matchesFilter =
      filter === 'all' ||
      (filter === 'available' && test.available) ||
      (filter === 'unavailable' && !test.available);

    return matchesSearch && matchesFilter;
  });



  return (
    <div className='management roboto-regular'>
      {/* Header section */}
      <div className='management-header'>
        <h1 className='fira-code'>{selectedLesson.number}. {selectedLesson.title}</h1>
        <Button onClick={() => handleAdd()} text="Add Test" />
      </div>

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

      {/* Displaying the list of lessons as rows */}
      <div className='management-list'>
        {filteredTests.length > 0 ? (
          filteredTests.map((test) => (
            <div 
              className='management-row' 
              key={test.id}
              onClick={() => console.log("clicked")}
            >
              <div className='management-title'>{test.number}. {test.question}</div>

              <div className='management-list-right'>
                <div className='management-availability roboto-bold'>{test.available ? "AVAILABLE" : "UNAVAILABLE"}</div>
              </div>
            </div>
          ))
        ) : (
          <p>No Lessons available</p>
        )}
      </div>
    </div>
  );
};

export default TestManagement;
