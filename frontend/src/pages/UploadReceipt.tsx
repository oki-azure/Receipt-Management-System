import React from 'react';
import { useNavigate } from 'react-router-dom';

const UploadReceipt: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Upload New Receipt</h1>
                <p className="text-custom-gray">Add your receipt details and upload a file.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="flex flex-col space-y-6">
                    {/* Dropzone */}
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center transition-colors hover:border-primary hover:bg-primary/5">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900">Upload Your Receipt Image</p>
                        <p className="text-sm text-gray-500">Drag & drop a file here or click to browse</p>
                        <p className="mt-1 text-xs text-gray-400">Supports: JPG, PNG, PDF</p>
                        <button className="mt-6 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-gray-200">
                            Browse Files
                        </button>
                    </div>

                    {/* Progress Card */}
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="mb-3 flex items-center gap-4">
                            <div
                                className="h-12 w-12 rounded-lg bg-cover bg-center"
                                style={{
                                    backgroundImage:
                                        'url("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80")',
                                }}
                            ></div>
                            <div className="flex-1">
                                <div className="mb-1 flex justify-between text-sm">
                                    <span className="font-medium text-slate-900">uploading_receipt.jpg</span>
                                    <span className="text-slate-900">75%</span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-gray-200">
                                    <div className="h-2 w-3/4 rounded-full bg-primary"></div>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">1.2MB of 1.6MB</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-success">
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                            Upload Complete!
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="rounded-xl border border-gray-200 bg-white">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="text-lg font-bold text-slate-900">Add Receipt Details</h2>
                    </div>
                    <form className="space-y-5 p-6" onSubmit={(e) => { e.preventDefault(); navigate('/receipts'); }}>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-900">Vendor/Store Name</label>
                            <input
                                type="text"
                                placeholder="Enter store name"
                                className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-900">Total Amount</label>
                                <input
                                    type="text"
                                    placeholder="e.g., 25.99"
                                    className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-900">Purchase Date</label>
                                <input
                                    type="date"
                                    defaultValue="2023-10-27"
                                    className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-900">Category</label>
                            <select className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary">
                                <option>Food</option>
                                <option>Travel</option>
                                <option>Office Supplies</option>
                                <option>Utilities</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-900">Notes/Description (Optional)</label>
                            <textarea
                                rows={3}
                                placeholder="Add a short description..."
                                className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                            ></textarea>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-slate-900">Reimbursable</label>
                            <label className="relative inline-flex cursor-pointer items-center">
                                <input type="checkbox" className="peer sr-only" />
                                <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20"></div>
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => navigate(-1)} className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-gray-200">
                                Cancel
                            </button>
                            <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90">
                                Save Receipt
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadReceipt;
