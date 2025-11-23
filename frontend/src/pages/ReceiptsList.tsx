import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ReceiptsList: React.FC = () => {
    const [selected, setSelected] = useState<string[]>(['1', '2', '3']);

    const receipts = [
        { id: '1', date: 'Oct 26, 2023', vendor: 'Staples', category: 'Office Supplies', amount: 49.99, status: 'Reimbursed' },
        { id: '2', date: 'Oct 25, 2023', vendor: 'Amazon', category: 'Software', amount: 299.00, status: 'Pending' },
        { id: '3', date: 'Oct 24, 2023', vendor: 'Uber', category: 'Travel', amount: 24.50, status: 'Reimbursed' },
        { id: '4', date: 'Oct 22, 2023', vendor: 'Starbucks', category: 'Meals', amount: 8.75, status: 'Rejected' },
        { id: '5', date: 'Oct 20, 2023', vendor: 'Apple Store', category: 'Electronics', amount: 1299.00, status: 'Approved' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Reimbursed':
            case 'Approved':
                return 'bg-green-100 text-green-700';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'Rejected':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const toggleSelection = (id: string) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(s => s !== id));
        } else {
            setSelected([...selected, id]);
        }
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
                        <button className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-gray-200">
                            Status <span className="material-symbols-outlined text-sm">expand_more</span>
                        </button>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selected.length > 0 && (
                    <div className="flex items-center justify-between bg-gray-50 px-4 py-2">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked className="rounded border-gray-300 text-primary focus:ring-primary" readOnly />
                            <span className="text-sm text-gray-600">{selected.length} selected</span>
                        </div>
                        <button className="flex items-center gap-1 rounded-lg bg-danger px-3 py-1.5 text-sm font-bold text-white hover:bg-danger/90">
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
                                <th className="px-6 py-3 w-10">
                                    <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                </th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Merchant</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {receipts.map((receipt) => (
                                <tr key={receipt.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selected.includes(receipt.id)}
                                            onChange={() => toggleSelection(receipt.id)}
                                            className="rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{receipt.date}</td>
                                    <td className="px-6 py-4 text-slate-600">{receipt.vendor}</td>
                                    <td className="px-6 py-4 text-slate-600">{receipt.category}</td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-900">${receipt.amount.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(receipt.status)}`}>
                                            {receipt.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link to={`/receipts/${receipt.id}`} className="text-gray-400 hover:text-slate-900">
                                            <span className="material-symbols-outlined">more_horiz</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Showing <span className="font-semibold text-slate-900">1-10</span> of <span className="font-semibold text-slate-900">1000</span></p>
                    <div className="flex items-center gap-1">
                        <button className="rounded-l border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">Previous</button>
                        <button className="border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">1</button>
                        <button className="border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50">2</button>
                        <button className="border border-primary bg-primary/10 px-3 py-1 text-sm font-medium text-primary">3</button>
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
