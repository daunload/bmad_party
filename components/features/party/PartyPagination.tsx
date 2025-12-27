import Link from 'next/link';

interface PartyPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function PartyPagination({ currentPage, totalPages }: PartyPaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="flex items-center justify-center space-x-2" aria-label="페이지네이션">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={`/parties?page=${currentPage - 1}`}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          이전
        </Link>
      ) : (
        <span className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
          이전
        </span>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-sm text-gray-500">
              ...
            </span>
          );
        }

        const pageNum = page as number;
        const isCurrentPage = pageNum === currentPage;

        return (
          <Link
            key={pageNum}
            href={`/parties?page=${pageNum}`}
            className={`rounded-md px-3 py-2 text-sm font-medium ${
              isCurrentPage
                ? 'bg-black text-white'
                : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
            aria-current={isCurrentPage ? 'page' : undefined}
          >
            {pageNum}
          </Link>
        );
      })}

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={`/parties?page=${currentPage + 1}`}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          다음
        </Link>
      ) : (
        <span className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
          다음
        </span>
      )}
    </nav>
  );
}

