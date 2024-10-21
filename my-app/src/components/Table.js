import { FaEllipsisVertical } from "react-icons/fa6";
import './Table.css';

// Table to load specified data from firestore
const Table = ({  
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

  // Function to render cell content based on key or data type
  const renderCellContent = (key, value) => {
    if (key === 'content' && typeof value === 'object') {
      return value.content;
    }
    return value;
  };
  
  return (
    <div className="table-container roboto-regular">
      <table className="management-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.header}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
  
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <tr key={item.id}>
                {columns.map((col, index) => (
                  <td key={index}>{renderCellContent(col.key, item[col.key])}</td>
                ))}
                <td>
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
            <tr>
              <td colSpan={columns.length + 1}>No items available</td>
            </tr>
          )}
        </tbody>
      </table>
  
      <div className="pagination">
        <div className="pagination-info">
          Showing {itemsStart} to {itemsEnd} of {totalItems} items
        </div>
        
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
  
        <div className="page-numbers">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={currentPage === index + 1 ? 'current' : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
  
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;