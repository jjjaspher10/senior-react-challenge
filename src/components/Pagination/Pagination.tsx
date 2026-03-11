"use client";

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  limit,
  total,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(total / limit);

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const generatePages = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (page > 3) pages.push("...");

      const startPage = Math.max(2, page - 1);
      const endPage = Math.min(totalPages - 1, page + 1);

      for (let i = startPage; i <= endPage; i++) pages.push(i);

      if (page < totalPages - 2) pages.push("...");

      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePages();

  return (
    <div className="flex items-center justify-between mt-6">
      {/* Results text */}
      <p className="text-sm text-gray-600">
        Showing {start} to {end} of {total} results
      </p>

      {/* Pagination */}
      <div className="flex items-center border border-gray-400 hover:cursor-pointer rounded rounded shadow-lg">
        {/* Prev */}
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="px-3 py-2 border-r border-gray-400 hover:cursor-pointer hover:bg-gray-100 disabled:opacity-40"
        >
          ‹
        </button>

        {pages.map((p, idx) =>
          p === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-4 py-2 border-r border-gray-400 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-4 py-2 border-r border-gray-400 hover:cursor-pointer ${
                page === p
                  ? "bg-gray-700 text-white font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="px-3 py-2 hover:bg-gray-100 hover:cursor-pointer disabled:opacity-40"
        >
          ›
        </button>
      </div>
    </div>
  );
}