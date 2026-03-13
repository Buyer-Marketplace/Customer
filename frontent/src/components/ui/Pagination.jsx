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
      button: 'p-1.5 min-w-[32px] h-8 text-sm',
      icon: 16,
    },
    md: {
      button: 'p-2 min-w-[40px] h-10 text-base',
      icon: 18,
    },
    lg: {
      button: 'p-2.5 min-w-[48px] h-12 text-lg',
      icon: 20,
    },
  };

  const buttonBaseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-xl
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <nav className="flex items-center justify-center gap-2 mt-8" aria-label="Pagination">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${buttonBaseClasses} ${sizes[size].button} border-2 border-gray-300 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border disabled:hover:bg-transparent`}
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
                className={`${sizes[size].button} inline-flex items-center justify-center text-gray-500 dark:text-gray-400`}
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
                    ? 'bg-primary-600 text-white border-2 border-primary-600 hover:bg-primary-700 shadow-md'
                    : 'border-2 border-gray-300 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border text-gray-700 dark:text-gray-300'
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
        className={`${buttonBaseClasses} ${sizes[size].button} border-2 border-gray-300 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-border disabled:hover:bg-transparent`}
        aria-label="Next page"
      >
        <IoChevronForward size={sizes[size].icon} />
      </button>
    </nav>
  );
};

export default Pagination;