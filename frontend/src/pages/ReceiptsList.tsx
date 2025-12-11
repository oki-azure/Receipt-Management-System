import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getReceipts } from '../utils/receipts';
import { getTransactionById } from '../utils/transactions';
import { type Receipt, type Transaction, type Category } from '../types';
import { deleteReceipt } from '../utils/receipts';
import { deleteTransaction } from '../utils/transactions';
import Pagination from '../components/ReceiptsListPagination';
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"

const ReceiptsList: React.FC = () => {
    const [selected, setSelected] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [receipts, setReceipts] = useState<Receipt[]>(getReceipts());
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
    const [category, setCategory] = useState<string | null>(null);
    const [showDateDropdown, setShowDateDropdown] = useState(false);
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);

    // join each receipt with its transaction
    const joinedReceipts = receipts.map((receipt) => {
        const transaction: Transaction | undefined = getTransactionById(receipt.transactionId);
        return {
            id: receipt.id,
            date: transaction?.date || '',
            vendor: transaction?.vendor || '',
            category: transaction?.category || '',
            amount: transaction?.amount || 0,
        };
    });

    const filteredReceipts = joinedReceipts.filter((r) => {
        const matchesSearch =
            r.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.amount.toString().includes(searchTerm);

        const receiptDate = r.date ? new Date(r.date) : null;
        const inDateRange =
            (!dateRange[0] || (receiptDate && receiptDate >= dateRange[0])) &&
            (!dateRange[1] || (receiptDate && receiptDate <= dateRange[1]));

        const inCategory = !category || r.category === category;

        return matchesSearch && inDateRange && inCategory;
    });


    const toggleSelection = (id: string) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(s => s !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const toggleAll = () => {
        if (selected.length === receipts.length) {
            setSelected([]);
        } else {
            setSelected(receipts.map(r => r.id));
        }
    };

    const handleBulkDelete = () => {
        selected.forEach((id) => {
            const receipt = receipts.find((r) => r.id === id);
            if (receipt) {
                deleteReceipt(receipt.id);
                deleteTransaction(receipt.transactionId);
            }
        });
        setSelected([]);

        // Refresh the receipts state directly instead of reloading
        const updatedReceipts = getReceipts();
        setReceipts(updatedReceipts); // <-- use a state hook for receipts

    };


    const totalItems = filteredReceipts.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    useEffect(() => {
        setCurrentPage((p) => Math.min(p, totalPages));
    }, [totalPages]);

    const paginatedReceipts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filteredReceipts.slice(start, end);
    }, [filteredReceipts, currentPage]);

    useEffect(() => {
        const stored = localStorage.getItem("categories");
        if (stored) {
            try {
                setCategories(JSON.parse(stored));
            } catch (err) {
                console.error("Failed to parse categories from LocalStorage", err);
            }
        }
    }, []);


    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">All Receipts</h1>
                    <p className="text-custom-gray">View, search, filter, and manage all your receipts.</p>
                </div>
                <Link to="/upload" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90">
                    <span className="material-symbols-outlined">add</span>
                    Upload Receipt
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="rounded-xl border border-gray-200 bg-white">
                <div className="border-b border-gray-200 p-4">
                    <div className="mb-4 flex items-center rounded-lg bg-gray-100 px-3 py-2">
                        <span className="material-symbols-outlined text-gray-500">search</span>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by merchant, item, or amount..."
                            className="ml-2 w-full bg-transparent border-none text-sm text-slate-900 placeholder-gray-500 focus:ring-0"
                        />
                    </div>

                    <div className="flex gap-2 overflow-visible">
                        {/* Date Range Filter */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDateDropdown(!showDateDropdown)}
                                className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-gray-200"
                            >
                                Date Range <span className="material-symbols-outlined text-sm">expand_more</span>
                            </button>
                            {showDateDropdown && (
                                <div className="absolute left-0 top-full mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg p-3 z-50">
                                    <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                                    <input
                                        type="date"
                                        className="w-full border rounded px-2 py-1 text-sm mb-2"
                                        onChange={(e) => setDateRange([new Date(e.target.value), dateRange[1]])}
                                    />
                                    <label className="block text-xs text-gray-500 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        className="w-full border rounded px-2 py-1 text-sm"
                                        onChange={(e) => setDateRange([dateRange[0], new Date(e.target.value)])}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Category Filter */}
                        <div className="relative">
                            <button
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-gray-200"
                            >
                                Category <span className="material-symbols-outlined text-sm">expand_more</span>
                            </button>
                            {showCategoryDropdown && (
                                <div className="absolute left-0 top-full mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg p-2 z-50">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                setCategory(cat.name);
                                                setShowCategoryDropdown(false);
                                            }}
                                            className={`block w-full text-left px-2 py-1 text-sm rounded hover:bg-gray-100 ${category === cat.name ? "bg-primary/10 text-primary" : ""
                                                }`}
                                            style={{ color: cat.color }} // optional: use category color
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* Clear Filters */}
                        {(dateRange[0] || dateRange[1] || category || searchTerm) && (
                            <button
                                onClick={() => {
                                    setDateRange([null, null]);
                                    setCategory(null);
                                    setSearchTerm("");
                                }}
                                className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-gray-200"
                            >
                                Clear Filters <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Bulk Actions */}
                {selected.length > 0 && (
                    <div className="flex items-center justify-between bg-gray-50 px-4 py-2">
                        <button onClick={handleBulkDelete} className="flex items-center gap-1 rounded-lg bg-danger px-3 py-1.5 text-sm font-bold text-white hover:bg-danger/90">
                            <span className="material-symbols-outlined text-sm">delete</span>
                            Delete Selected
                        </button>
                    </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase text-gray-500">
                            <tr>
                                <th scope="col" className="px-6 py-3 w-10">
                                    <input
                                        type="checkbox"
                                        checked={selected.length === receipts.length && receipts.length !== 0}
                                        onChange={toggleAll}
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                        readOnly
                                    />
                                </th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Merchant</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3 text-right">Amount</th>
                                <th scope="col" className="px-6 py-3 text-right"></th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {paginatedReceipts.length > 0 ? (
                                paginatedReceipts.map((receipt) => (
                                    <tr key={receipt.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selected.includes(receipt.id)}
                                                onChange={() => toggleSelection(receipt.id)}
                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                            {receipt.date}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{receipt.vendor}</td>
                                        <td className="px-6 py-4 text-slate-600">{receipt.category}</td>
                                        <td className="px-6 py-4 text-right font-mono text-slate-900">
                                            ${receipt.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link
                                                        to={`/receipts/${receipt.id}`}
                                                        className="text-gray-400 hover:text-slate-900"
                                                    >
                                                        <span className="material-symbols-outlined">visibility</span>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>View</p>
                                                </TooltipContent>
                                            </Tooltip>

                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-4 text-center text-sm text-gray-500"
                                    >
                                        {receipts.length === 0
                                            ? "No receipts added yet, add some receipts."
                                            : "No receipts match your search."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
};

export default ReceiptsList;