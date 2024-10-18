import Button from './Button';
import './Pagination.css';


// Component to navigate through pages
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className='pagination'>
            {/* Previous page button */}
            <Button
                text="Previous"
                disabled={currentPage === totalPages}
                action={() => handlePageChange(currentPage - 1)}
            />

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={currentPage === index + 1 ? 'active' : ''}
                >
                    {index + 1}
                </button>
            ))}

            {/* Next page button */}
            <Button
                text="Next"
                disabled={currentPage === totalPages}
                action={() => handlePageChange(currentPage + 1)}
            />
        </div>
    );
}

export default Pagination;