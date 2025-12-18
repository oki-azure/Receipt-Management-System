import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReceipt } from '../utils/receipts';
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon } from "lucide-react"
import { useNotifications } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';

const UploadReceipt: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useAuth();

    // Form state
    const [vendor, setVendor] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [notes, setNotes] = useState('');
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);

    // Date Picker
    const [open, setOpen] = React.useState(false)

    // Notifications
    const { notifyReceipt } = useNotifications();

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        const newReceipt = {
            vendor_name: vendor,
            total_amount: parseFloat(amount),
            purchase_date: date,
            category,
            notes,
            user_id: 12, // or derive from context user.id
        };

        const created = await createReceipt(newReceipt, token);
        if (created) {
            // redirect to details page
            notifyReceipt('added', newReceipt.vendor_name);
            navigate(`/receipts/${created.id}`);
        }
    };

    return (
        <div className="mx-auto max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Upload New Receipt</h1>
                <p className="text-custom-gray">Add your receipt details and upload a file.</p>
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
                                    className="mt-6 rounded-lg bg-gray-300 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-gray-200 cursor-pointer"
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
                        <h2 className="text-lg font-bold text-slate-900">Add Receipt Details</h2>
                    </div>
                    <form className="space-y-5 p-6" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-900">Vendor/Store Name</label>
                            <Input
                                type="text" placeholder='Enter Vendor/Store Name'
                                value={vendor}
                                onChange={(e) => setVendor(e.target.value)}
                                required
                                className='border-gray-500'
                            ></Input>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-900">Total Amount</label>
                                <Input
                                    type='text'
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="e.g., 25.99"
                                    required
                                    className="border-gray-500"
                                ></Input>
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="date" className="text-sm font-medium text-slate-900">
                                    Purchase Date
                                </label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="date"
                                            className="w-48 justify-between font-normal border-gray-500"
                                        >
                                            {date ? date : "Select date"}
                                            <CalendarIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto overflow-hidden p-0"
                                        side="bottom"
                                        align="start"
                                        avoidCollisions={false}
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={date ? new Date(date) : undefined}
                                            onSelect={(d) => {
                                                if (d) {
                                                    const iso = d.toISOString().split("T")[0];
                                                    setDate(iso);
                                                }
                                                setOpen(false);
                                            }}
                                            disabled={(d) => {
                                                const today = new Date();
                                                return d > today;
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-900">Category</label>
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                required
                                placeholder="Enter category"
                                className="w-full rounded-lg border border-gray-500 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-primary focus:ring-primary focus:outline-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-900">Notes/Description (Optional)</label>
                            <Textarea
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add a short description..."
                                className="border-gray-500"
                            >
                            </Textarea>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                onClick={() => navigate(-1)}
                                className="rounded-lg bg-gray-300  px-4 py-2 text-sm font-bold text-slate-900 hover:bg-gray-200 cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90 cursor-pointer"
                            >
                                Save Receipt
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UploadReceipt;