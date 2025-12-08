import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { addTransaction, updateTransaction, getTransactionById } from '../utils/transactions';
import { addReceipt, updateReceipt, getReceiptById } from '../utils/receipts';
import { type Transaction, type Receipt, type Category, type Tag } from '../types';

const UploadReceipt: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // receipt id if editing
    const isEdit = Boolean(id);

    // Form state
    const [vendor, setVendor] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [receiptTags, setReceiptTags] = React.useState<string[]>([]);
    const [allTags, setAllTags] = React.useState<Tag[]>([]);
    const [newTagInput, setNewTagInput] = React.useState("");
    const [notes, setNotes] = useState('');
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [transactionId, setTransactionId] = useState<string | null>(null);

    // Load categories from LocalStorage on mount
    React.useEffect(() => {
        try {
            const rawCategories = localStorage.getItem("categories");
            const rawTags = localStorage.getItem("tags");

            if (rawCategories) {
                setCategories(JSON.parse(rawCategories));
            } else {
                setCategories([]);
            }

            if (rawTags) {
                setAllTags(JSON.parse(rawTags));
            } else {
                setAllTags([]);
            }
        } catch (err) {
            console.error("Failed to load categories/tags from localStorage:", err);
            setCategories([]);
            setAllTags([]);
        }
    }, []);

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
                setReceiptTags(receipt.tags || []);
                setImagePreview(receipt.imageUrl || null);
            }
        }
    }, [isEdit, id]);

    // to clear fileURL
    /* useEffect(() => {
        const receipts = JSON.parse(localStorage.getItem("receipts") || "[]");
        const updated = receipts.map((r: Receipt) =>
            r.fileUrl === "receipt-template-us-mono-black-750px.png" ? { ...r, fileUrl: null } : r
        );
        localStorage.setItem("receipts", JSON.stringify(updated));
    }, []); */

    const addTag = (tagName: string) => {
        if (!receiptTags.includes(tagName)) {
            setReceiptTags([...receiptTags, tagName]);
        }
        setNewTagInput("");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Save file name for display
        setFileUrl(file.name);

        // Generate preview if it's an image
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null); // PDFs won't preview as images
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
                fileUrl: fileUrl || '',
                uploadedAt: new Date().toISOString(),
                notes,
                tags: receiptTags,
                imageUrl: imagePreview || undefined,
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
                fileUrl: fileUrl || '',
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
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white text-center transition-colors hover:border-primary hover:bg-primary/5 h-[350px]">

                        {imagePreview || fileUrl ? (
                            <div className="relative group w-full flex flex-col items-center justify-center">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Receipt Preview"
                                        className="max-h-64 rounded-lg border border-gray-200 transition-opacity duration-300 group-hover:opacity-50"
                                    />
                                ) : fileUrl?.toLowerCase().endsWith(".pdf") ? (
                                    <div className="flex flex-col items-center transition-opacity duration-300 group-hover:opacity-50">
                                        <span className="material-symbols-outlined text-6xl text-primary">
                                            picture_as_pdf
                                        </span>
                                        <p className="mt-2 text-xs text-gray-600">{fileUrl}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-600">{fileUrl}</p>
                                )}

                                {/* Hidden file input */}
                                <input
                                    type="file"
                                    accept=".jpg,.png,.pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="replaceFileInput"
                                />

                                {/* Overlay controls appear on hover */}
                                <div className="absolute inset-0 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {/* Replace button */}
                                    <label htmlFor="replaceFileInput" className="cursor-pointer">
                                        <span className="material-symbols-outlined text-4xl text-white bg-gray-800/70 rounded-full p-2 hover:bg-gray-700">
                                            edit
                                        </span>
                                    </label>

                                    {/* Remove button */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImagePreview(null);
                                            setFileUrl(null);
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-4xl text-white bg-red-600/80 rounded-full p-2 hover:bg-red-700">
                                            delete
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
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
                            </>
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
                                className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary px-3"
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
                                    className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary px-3"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-900">Purchase Date</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required
                                    className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary px-3"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-900">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                className="w-full rounded-lg border border-gray-500 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-primary focus:outline-none"
                            >
                                <option value="" disabled>
                                    Select category
                                </option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-900">Tags</label>
                            <select
                                value={newTagInput}
                                onChange={(e) => {
                                    setNewTagInput(e.target.value);
                                    addTag(e.target.value)
                                }}
                                className="w-full rounded-lg border border-gray-500 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-primary focus:outline-none"
                            >
                                <option value="" disabled>Select a tag</option>
                                {allTags
                                    .filter((tag) => !receiptTags.includes(tag.name))
                                    .map((tag) => (
                                        <option key={tag.id} value={tag.name}>
                                            {tag.name}
                                        </option>
                                    ))}
                            </select>

                            {/* Show added tags */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {receiptTags.map((tagName) => (
                                    <span
                                        key={tagName}
                                        className="flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
                                    >
                                        {tagName}
                                        <button
                                            type="button"
                                            className="text-gray-400 hover:text-danger"
                                            onClick={() =>
                                                setReceiptTags(receiptTags.filter((t) => t !== tagName))
                                            }
                                        >
                                            <span className="material-symbols-outlined text-sm">close</span>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-900">Notes/Description (Optional)</label>
                            <textarea
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add a short description..."
                                className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary px-3"
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