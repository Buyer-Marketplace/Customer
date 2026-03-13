import React from 'react';
import { IoChevronBack, IoChevronForward, IoEllipsisHorizontal } from 'react-icons/io5';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  siblingCount = 1,
  showFirstLast = true,
  size = 'md',
}) => {
  const range = (start, end) => {
    let length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
  };

  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
      const showLeftDots = leftSiblingIndex > 2;
      const showRightDots = rightSiblingIndex < totalPages - 2;

      const firstPageIndex = 1;
      const lastPageIndex = totalPages;

      if (!showLeftDots && showRightDots) {
        let leftItemCount = 3 + 2 * siblingCount;
        let leftRange = range(1, leftItemCount);
        return [...leftRange, 'dots', totalPages];
      }

      if (showLeftDots && !showRightDots) {
        let rightItemCount = 3 + 2 * siblingCount;
        let rightRange = range(totalPages - rightItemCount + 1, totalPages);
        return [firstPageIndex, 'dots', ...rightRange];
      }

      if (showLeftDots && showRightDots) {
        let middleRange = range(leftSiblingIndex, rightSiblingIndex);
        return [firstPageIndex, 'dots', ...middleRange, 'dots', lastPageIndex];
      }
    }

    return range(1, totalPages);
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  const sizes = {
    sm: {
      button: 'p-1.5 min-w-[32px] h-8 text-xs',
      icon: 14,
    },
    md: {
      button: 'p-2 min-w-[40px] h-10 text-sm',
      icon: 16,
    },
    lg: {
      button: 'p-2.5 min-w-[48px] h-12 text-base',
      icon: 18,
    },
  };

  const buttonBaseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-green-950
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          ${buttonBaseClasses} ${sizes[size].button} 
          border border-green-700/50 bg-green-900/30 text-green-300
          hover:bg-green-800/50 hover:border-green-600
          disabled:hover:bg-green-900/30 disabled:hover:border-green-700/50
        `}
        aria-label="Previous page"
      >
        <IoChevronBack size={sizes[size].icon} />
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === 'dots') {
            return (
              <span
                key={`dots-${index}`}
                className={`${sizes[size].button} inline-flex items-center justify-center text-green-400`}
              >
                <IoEllipsisHorizontal size={sizes[size].icon} />
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`
                ${buttonBaseClasses} ${sizes[size].button}
                ${
                  currentPage === page
                    ? 'bg-green-600 text-white border border-green-500 hover:bg-green-700 shadow-md'
                    : 'border border-green-700/50 bg-green-900/30 text-green-300 hover:bg-green-800/50 hover:border-green-600'
                }
              `}
              aria-current={currentPage === page ? 'page' : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          ${buttonBaseClasses} ${sizes[size].button}
          border border-green-700/50 bg-green-900/30 text-green-300
          hover:bg-green-800/50 hover:border-green-600
          disabled:hover:bg-green-900/30 disabled:hover:border-green-700/50
        `}
        aria-label="Next page"
      >
        <IoChevronForward size={sizes[size].icon} />
      </button>
    </nav>
  );
};

export default Pagination;