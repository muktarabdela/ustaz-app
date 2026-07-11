interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const handlePrev = () => {
    onPageChange(Math.max(1, currentPage - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    onPageChange(Math.min(totalPages, currentPage + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex items-center justify-between mt-4 bg-surface-container-lowest p-4 rounded-xl ambient-shadow">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-outline-variant text-secondary font-button text-button rounded-lg disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 hover:bg-surface-container-low transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        <span className="hidden sm:inline">Prev</span>
      </button>

      <span className="font-label-caps text-label-caps text-on-surface-variant">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-outline-variant text-secondary font-button text-button rounded-lg disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 hover:bg-surface-container-low transition-colors"
      >
        <span className="hidden sm:inline">Next</span>
        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
      </button>
    </div>
  );
}
