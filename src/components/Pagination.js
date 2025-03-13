import React from 'react';
import '../styles/Pagination.css';

const Pagination = ({ storiesPerPage, totalStories, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalStories / storiesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="pagination-container">
      <ul className="pagination">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button 
            onClick={() => currentPage > 1 && paginate(currentPage - 1)} 
            className="page-link"
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
        </li>
        
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${number === currentPage ? 'active' : ''}`}>
            <button
              onClick={() => paginate(number)}
              className="page-link"
            >
              {number}
            </button>
          </li>
        ))}
        
        <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
          <button 
            onClick={() => currentPage < pageNumbers.length && paginate(currentPage + 1)} 
            className="page-link"
            disabled={currentPage === pageNumbers.length}
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;