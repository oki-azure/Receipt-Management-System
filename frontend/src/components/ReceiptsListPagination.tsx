import React from "react";
import { type PaginationProps } from "../types";

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
}) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="flex items-center justify-between border-t border-gray-200 p-4">
            <p className="text-sm text-gray-500">
                Showing <span className="font-semibold text-slate-900">{start}-{end}</span> of{" "}
                <span className="font-semibold text-slate-900">{totalItems}</span>
            </p>
            <div className="flex items-center gap-1">
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    className="rounded-l border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>

                {/* Simple window (first 3 + last). Replace with a sliding window if needed */}
                {[1, 2, 3].filter((p) => p <= totalPages).map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`border px-3 py-1 text-sm ${currentPage === page
                                ? "border-primary bg-primary/10 font-medium text-primary"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {totalPages > 4 && <span className="border border-gray-300 px-3 py-1 text-sm">…</span>}

                {totalPages > 3 && (
                    <button
                        onClick={() => onPageChange(totalPages)}
                        className={`border px-3 py-1 text-sm ${currentPage === totalPages
                                ? "border-primary bg-primary/10 font-medium text-primary"
                                : "border-gray-300 hover:bg-gray-50"
                            }`}
                    >
                        {totalPages}
                    </button>
                )}

                <button
                    disabled={currentPage === totalPages || totalItems === 0}
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    className="rounded-r border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;