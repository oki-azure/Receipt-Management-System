import React from 'react';
import { Link, useParams } from 'react-router-dom';

const ReceiptDetail: React.FC = () => {
    const { id } = useParams();

    return (
        <div className="mx-auto max-w-6xl">
            {/* Breadcrumbs */}
            <div className="mb-6 flex items-center gap-2 text-sm font-medium">
                <Link to="/receipts" className="text-gray-500 hover:text-primary">Receipts</Link>
                <span className="text-gray-400">/</span>
                <span className="text-slate-900">Starbucks</span>
            </div>

            {/* Header */}
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Starbucks</h1>
                    <p className="text-gray-500">Receipt from your visit on August 23, 2024</p>
                </div>
                <div className="flex gap-3">
                    <button className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-gray-300">
                        Edit Receipt
                    </button>
                    <button className="rounded-lg px-4 py-2 text-sm font-bold text-danger hover:bg-red-50">
                        Delete
                    </button>
                    <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50">
                        <span className="material-symbols-outlined text-gray-600">more_vert</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                {/* Details Column */}
                <div className="lg:col-span-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-6">
                        <h3 className="mb-6 text-lg font-bold text-slate-900">Receipt Details</h3>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-gray-500">Total Amount</p>
                                <p className="text-2xl font-bold text-primary">$12.50</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Merchant</p>
                                <p className="text-sm font-medium text-slate-900">Starbucks</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date & Time</p>
                                <p className="text-sm font-medium text-slate-900">Aug 23, 2024, 08:15 AM</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Category</p>
                                <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">
                                    Food
                                </span>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="text-sm text-gray-500">Payment Method</p>
                                <p className="text-sm font-medium text-slate-900">Visa **** 4592</p>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-gray-100 pt-6">
                            <h4 className="mb-2 text-sm font-bold text-slate-900">Notes</h4>
                            <p className="text-sm text-gray-500">Morning coffee with the team before the big presentation. Good start to the day.</p>
                        </div>
                    </div>
                </div>

                {/* Image Viewer Column */}
                <div className="lg:col-span-3">
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Receipt Image</h3>
                            <div className="flex gap-2">
                                <button className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100">
                                    <span className="material-symbols-outlined text-xl">zoom_in</span>
                                </button>
                                <button className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100">
                                    <span className="material-symbols-outlined text-xl">zoom_out</span>
                                </button>
                                <button className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100">
                                    <span className="material-symbols-outlined text-xl">rotate_right</span>
                                </button>
                                <button className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100">
                                    <span className="material-symbols-outlined text-xl">download</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center justify-center rounded-lg bg-gray-100 p-4">
                            <img
                                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                                alt="Receipt"
                                className="max-h-[600px] w-auto object-contain shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiptDetail;