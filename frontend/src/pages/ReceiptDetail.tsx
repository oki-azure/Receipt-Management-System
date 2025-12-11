import React, { useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getReceiptById, deleteReceipt } from '../utils/receipts';
import { getTransactionById, deleteTransaction } from '../utils/transactions';


const ReceiptDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [scale, setScale] = React.useState(1);
    const [rotation, setRotation] = React.useState(0);

    const receipt = id ? getReceiptById(id) : null;
    const transaction = receipt ? getTransactionById(receipt.transactionId) : null;

    const containerRef = useRef<HTMLDivElement>(null);

    if (!receipt || !transaction) {
        return (
            <div className="mx-auto max-w-6xl">
                <p className="text-gray-500">Receipt not found.</p>
                <Link to="/receipts" className="text-primary hover:underline">
                    Back to Receipts
                </Link>
            </div>
        );
    }

    const handleDelete = () => {
        deleteReceipt(receipt.id);
        deleteTransaction(receipt.transactionId);
        navigate('/receipts');
    };

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


    return (
        <div className="mx-auto max-w-6xl">
            {/* Breadcrumbs */}
            <div className="mb-6 flex items-center gap-2 text-sm font-medium">
                <Link to="/receipts" className="text-gray-500 hover:text-primary">Receipts</Link>
                <span className="text-gray-400">/</span>
                <span className="text-slate-900">{transaction.vendor}</span>
            </div>

            {/* Header */}
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">{transaction.vendor}</h1>
                    <p className="text-gray-500">Receipt from your visit on {transaction.date}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(`/receipts/${receipt.id}/edit`)}
                        className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-gray-300"
                    >
                        Edit Receipt
                    </button>
                    <button
                        onClick={handleDelete}
                        className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-bold text-danger hover:bg-red-50"
                    >
                        Delete
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
                                <p className="text-2xl font-bold text-primary">${transaction.amount.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Merchant</p>
                                <p className="text-sm font-medium text-slate-900">{transaction.vendor}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="text-sm font-medium text-slate-900">{transaction.date}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Category</p>
                                <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-700">
                                    {transaction.category}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 border-t border-gray-100 pt-6">
                            <h4 className="mb-2 text-sm font-bold text-slate-900">Notes</h4>
                            <p className="text-sm text-gray-500">{receipt.notes || 'No notes added.'}</p>
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
                                    href={receipt.fileUrl}
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