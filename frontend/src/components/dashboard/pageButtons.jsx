import { useMemo } from "react";

const PageButtons = ({
  currentPage,
  setCurrentPage,
  rowsPerPage,
  totalCompanies,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCompanies / rowsPerPage));

  const getPageButtons = useMemo(() => {
    const buttons = [];
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    buttons.push(1); // Always show first page

    if (currentPage > 4) buttons.push("dots-left");

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(i);
    }

    if (currentPage < totalPages - 3) buttons.push("dots-right");

    buttons.push(totalPages);

    return buttons;
  }, [currentPage, totalPages]);

  return (
    <div className="flex justify-center mt-2 gap-2">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => p - 1)}
        className="px-3 py-1 rounded bg-gray-200 text-sm disabled:opacity-50"
      >
        «
      </button>
      {getPageButtons.map((btn) =>
        btn === "dots-left" || btn === "dots-right" ? (
          <span key={btn} className="px-2 text-gray-500 select-none">
            …
          </span>
        ) : (
          <button
            key={`page-${btn}`}
            onClick={() => setCurrentPage(btn)}
            className={`px-3 py-1 rounded text-sm ${
              currentPage === btn ? "bg-[#150958] text-white" : "bg-gray-100"
            }`}
          >
            {btn}
          </button>
        )
      )}
      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => p + 1)}
        className="px-3 py-1 rounded bg-gray-200 text-sm disabled:opacity-50"
      >
        »
      </button>
    </div>
  );
};

export default PageButtons;
