import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { addTransaction, updateTransaction, getTransactionById } from '../utils/transactions';
import { addReceipt, updateReceipt, getReceiptById } from '../utils/receipts';
import { type Transaction, type Receipt } from '../types';

const UploadReceipt: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // receipt id if editing
    const isEdit = Boolean(id);

    // Form state
    const [vendor, setVendor] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [notes, setNotes] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [transactionId, setTransactionId] = useState<string | null>(null);

    // Pre-fill form if editing
    useEffect(() => {
        if (isEdit && id) {
            const receipt = getReceiptById(id);
            if (receipt) {
                const transaction = getTransactionById(receipt.transactionId);
                if (transaction) {
                    setTransactionId(transaction.id);
                    setVendor(transaction.vendor);
                    setAmount(transaction.amount.toString());
                    setDate(transaction.date);
                    setCategory(transaction.category);
                }
                setNotes(receipt.notes || '');
                setFileUrl(receipt.fileUrl);
            }
        }
    }, [isEdit, id]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFileUrl(file.name); // dummy flow: store file name
            console.log('Selected file:', file.name);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!vendor || !amount || !date || !category) {
            alert("Please fill out all required fields.");
            return;
        }

        if (isEdit && id && transactionId) {
            // Update existing Transaction
            const updatedTransaction: Transaction = {
                id: transactionId,
                vendor,
                amount: parseFloat(amount),
                category,
                date,
            };
            updateTransaction(updatedTransaction);

            // Update existing Receipt
            const updatedReceipt: Receipt = {
                id,
                transactionId,
                fileUrl: fileUrl || 'placeholder.pdf',
                uploadedAt: new Date().toISOString(),
                notes,
                tags: [],
            };
            updateReceipt(updatedReceipt);
            navigate(`/receipts/${updatedReceipt.id}`);
        } else {
            // Create new Transaction
            const newTransaction: Transaction = {
                id: uuid(),
                vendor,
                amount: parseFloat(amount),
                category,
                date,
            };
            addTransaction(newTransaction);

            // Create new Receipt
            const newReceipt: Receipt = {
                id: uuid(),
                transactionId: newTransaction.id,
                fileUrl: fileUrl || 'placeholder.pdf',
                uploadedAt: new Date().toISOString(),
                notes,
                tags: [],
            };
            addReceipt(newReceipt);
            navigate('/receipts');
        }
    };

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    {isEdit ? 'Edit Receipt' : 'Upload New Receipt'}
                </h1>
                <p className="text-custom-gray">
                    {isEdit
                        ? 'Update your receipt details and save changes.'
                        : 'Add your receipt details and upload a file.'}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Dropzone */}
                <div className="flex flex-col space-y-6">
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center transition-colors hover:border-primary hover:bg-primary/5">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                        </div>
                        <p className="text-lg font-bold text-slate-900">Upload Your Receipt Image</p>
                        <p className="text-sm text-gray-500">Drag & drop a file here or click to browse</p>
                        <p className="mt-1 text-xs text-gray-400">Supports: JPG, PNG, PDF</p>
                        <input
                            type="file"
                            accept=".jpg,.png,.pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="fileInput"
                        />
                        <label
                            htmlFor="fileInput"
                            className="mt-6 rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-gray-200 cursor-pointer"
                        >
                            Browse Files
                        </label>
                        {fileUrl && (
                            <p className="mt-2 text-xs text-gray-600">Selected: {fileUrl}</p>
                        )}
                    </div>
                </div>

                {/* Form */}
                <div className="rounded-xl border border-gray-200 bg-white">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h2 className="text-lg font-bold text-slate-900">
                            {isEdit ? 'Edit Receipt Details' : 'Add Receipt Details'}
                        </h2>
                    </div>
                    <form className="space-y-5 p-6" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-900">Vendor/Store Name</label>
                            <input
                                type="text"
                                value={vendor}
                                onChange={(e) => setVendor(e.target.value)}
                                placeholder="Enter store name"
                                required
                                className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-900">Total Amount</label>
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="e.g., 25.99"
                                    required
                                    className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-900">Purchase Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-900">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                            >
                                <option value="">Select category</option>
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
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add a short description..."
                                className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                            ></textarea>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90"
                            >
                                {isEdit ? 'Save Changes' : 'Save Receipt'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadReceipt;