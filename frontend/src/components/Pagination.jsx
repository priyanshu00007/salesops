import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, limit, total, onPageChange }) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
    pages.push(i);
  }

  return (
    <div className="mt-6 flex items-center justify-between">
      <p className="text-sm text-gray-600">
        Showing {Math.min((page - 1) * limit + 1, total)}–{Math.min(page * limit, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages[0] > 1 && <span className="px-2 text-gray-400">...</span>}
        {pages.map(p => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`min-w-[2rem] rounded-lg px-3 py-1.5 text-sm font-medium ${p === page ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {p}
          </button>
        ))}
        {pages[pages.length - 1] < totalPages && <span className="px-2 text-gray-400">...</span>}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
