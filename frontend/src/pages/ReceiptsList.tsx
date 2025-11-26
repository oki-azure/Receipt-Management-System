import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getReceipts } from '../utils/receipts';
import { getTransactionById } from '../utils/transactions';
import { type Receipt, type Transaction } from '../types';
import { deleteReceipt } from '../utils/receipts';
import { deleteTransaction } from '../utils/transactions';

const ReceiptsList: React.FC = () => {
    const [selected, setSelected] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [receipts, setReceipts] = useState<Receipt[]>(getReceipts());

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

    const filteredReceipts = joinedReceipts.filter(r =>
        r.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.amount.toString().includes(searchTerm)
    );

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
                    <div className="flex gap-2 overflow-x-auto">
                        <button className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-gray-200">
                            Date Range <span className="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                        <button className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-gray-200">
                            Category <span className="material-symbols-outlined text-sm">expand_more</span>
                        </button>
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
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {filteredReceipts.map((receipt) => (
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
                                        <Link
                                            to={`/receipts/${receipt.id}`}
                                            className="text-gray-400 hover:text-slate-900"
                                        >
                                            <span className="material-symbols-outlined">more_horiz</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {/* Empty state */}
                            {filteredReceipts.length === 0 && (
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
                <div className="flex items-center justify-between border-t border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Showing <span className="font-semibold text-slate-900">1-10</span> of <span className="font-semibold text-slate-900">1000</span></p>
                    <div className="flex items-center gap-1">
                        <button className="rounded-l border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">Previous</button>
                        <button className="border border-primary bg-primary/10 px-3 py-1 text-sm font-medium text-primary">1</button>
                        <button className="border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">2</button>
                        <button className="border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">3</button>
                        <button className="border border-gray-300 px-3 py-1 text-sm">...</button>
                        <button className="border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">100</button>
                        <button className="rounded-r border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiptsList;