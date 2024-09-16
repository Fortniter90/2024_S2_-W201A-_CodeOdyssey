import { FaEllipsisVertical } from "react-icons/fa6";
import './DatabaseTable.css';

const DatabaseTable = ({  
    data,
    columns,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    totalItems,
    onEdit,
    onDelete
}) => {
    
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / rowsPerPage);
    const indexOfLastItem = currentPage * rowsPerPage;                  // Index of last item on current page
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;             // Index of first item on current page
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem); // Get only items for current page
    const itemsStart = (currentPage - 1) * rowsPerPage + 1;             // Starting index of displayed items
    const itemsEnd = Math.min(currentPage * rowsPerPage, totalItems);   // Ending index of displayed items

    return (
        <div className="table-container roboto-regular">
            {/* Render table */}
            <table className="management-table">
                <thead>
                    <tr>
                        {/* Map through columns array to render each column header */}
                        {columns.map((col, index) => (
                            <th key={index}>{col.header}</th>
                        ))}
                        <th>Actions</th> {/* Extra column for action buttons */}
                    </tr>
                </thead>

                <tbody>
                    {/* Check if there are items for the current page */}
                    {currentItems.length > 0 ? (
                        currentItems.map((item) => (
                            <tr key={item.id}>
                                {/* Map through columns array to render data for each column */}
                                {columns.map((col, index) => (
                                    <td key={index}>{item[col.key]}</td>
                                ))}
                                <td>
                                    {/* Edit and delete buttons with a dropdown menu */}
                                    <div className="menu-container">
                                        <button className="menu-trigger"><FaEllipsisVertical /></button>
                                        <div className="menu">
                                            <button onClick={() => onEdit(item)}>Edit</button>
                                            <button onClick={() => onDelete(item.id)}>Delete</button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        // Row indicating no items are available
                        <tr>
                            <td colSpan={columns.length + 1}>No items available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination controls */}
            <div className="pagination">
                <div className="pagination-info">
                    Showing {itemsStart} to {itemsEnd} of {totalItems} items
                </div>
                
                {/* Previous button */}
                <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>

                {/* Page numbers */}
                <div className="page-numbers">
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={currentPage === index + 1 ? 'current' : ''}>
                            {index + 1}
                        </button>
                    ))}
                </div>

                {/* Nest button */}
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default DatabaseTable;