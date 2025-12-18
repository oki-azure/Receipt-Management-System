import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getReceiptById } from '../utils/receipts';
import { useAuth } from '@/context/AuthContext';
import type { Receipt } from '@/types';
import { Spinner } from '@/components/ui/spinner';


const ReceiptDetail: React.FC = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const [receipt, setReceipt] = useState<Receipt | null>(null);
    const [scale, setScale] = React.useState(1);
    const [rotation, setRotation] = React.useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchReceipt = async () => {
            if (id && token) {
                const data = await getReceiptById(Number(id), token);
                setReceipt(data);
            }
        };
        fetchReceipt();
    }, [id, token]);

    if (!receipt) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner className="w-16 h-16" />
            </div>
        );
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const startX = e.pageX - containerRef.current.offsetLeft;
        const startY = e.pageY - containerRef.current.offsetTop;
        const scrollLeft = containerRef.current.scrollLeft;
        const scrollTop = containerRef.current.scrollTop;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const x = moveEvent.pageX - containerRef.current!.offsetLeft;
            const y = moveEvent.pageY - containerRef.current!.offsetTop;
            containerRef.current!.scrollLeft = scrollLeft - (x - startX);
            containerRef.current!.scrollTop = scrollTop - (y - startY);
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const formatDate = (isoString: string) => {
        const d = new Date(isoString);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = String(d.getFullYear()).slice(-2);
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="mx-auto max-w-6xl">
            {/* Breadcrumbs */}
            <div className="mb-6 flex items-center gap-2 text-sm font-medium">
                <Link to="/receipts" className="text-gray-500 hover:text-primary">Receipts</Link>
                <span className="text-gray-400">/</span>
                <span className="text-slate-900">{receipt.vendor_name}</span>
            </div>

            {/* Header */}
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{receipt.vendor_name}</h1>
                    <p className="text-gray-500">
                        Receipt from your visit on{" "}
                        {new Date(receipt.purchase_date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                        })}
                    </p>
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
                                <p className="text-2xl font-bold text-primary">GH₵{Number(receipt.total_amount).toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Merchant</p>
                                <p className="text-sm font-medium text-slate-900">{receipt.vendor_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="text-sm font-medium text-slate-900">{formatDate(receipt.purchase_date)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Category</p>
                                <p className="text-sm font-medium text-slate-900">{receipt.category}</p>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-gray-500 pt-6">
                            <h4 className="mb-2 text-sm font-bold text-slate-900">Notes</h4>
                            <p className="whitespace-pre-line text-sm text-gray-500">{receipt.notes || 'No notes added.'}</p>
                        </div>
                    </div>
                </div>

                {/* Image Viewer Column */}
                <div className="lg:col-span-3">
                    <div className="rounded-xl border border-gray-200 bg-white p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900">Receipt Image</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setScale(scale + 0.1)}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
                                >
                                    <span className="material-symbols-outlined text-xl">zoom_in</span>
                                </button>
                                <button
                                    onClick={() => setScale(Math.max(0.1, scale - 0.1))}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
                                >
                                    <span className="material-symbols-outlined text-xl">zoom_out</span>
                                </button>
                                <button
                                    onClick={() => setRotation(rotation + 90)}
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
                                >
                                    <span className="material-symbols-outlined text-xl">rotate_right</span>
                                </button>
                                <a
                                    href={'#'}
                                    download
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
                                >
                                    <span className="material-symbols-outlined text-xl">download</span>
                                </a>
                            </div>
                        </div>

                        <div className="flex items-center justify-center rounded-lg bg-gray-100 p-4">
                            {receipt.fileUrl?.toLowerCase().endsWith(".pdf") ? (
                                // PDF preview: icon + filename
                                <div className="flex flex-col items-center">
                                    <span className="material-symbols-outlined text-6xl text-primary">
                                        picture_as_pdf
                                    </span>
                                    <p className="mt-2 text-sm text-gray-600">{receipt.fileUrl}</p>
                                </div>
                            ) : (
                                // Image preview
                                <div className='flex items-center justify-center rounded-lg bg-gray-100 p-4 max-h-[600px] overflow-auto' ref={containerRef} onMouseDown={handleMouseDown}>
                                    <img
                                        src={receipt.imageUrl}
                                        alt="Receipt"
                                        className="max-h-[600px] w-auto object-contain shadow-lg"
                                        style={{ transform: `scale(${scale}) rotate(${rotation}deg)`, transformOrigin: "center center" }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiptDetail;