// src/utils/receipts.ts
import { type Receipt } from '../types';

// Get all receipts
export const getReceipts = (): Receipt[] => {
    const receipts = localStorage.getItem('receipts');
    return receipts ? JSON.parse(receipts) : [];
};

// Save receipts
const saveReceipts = (receipts: Receipt[]) => {
    localStorage.setItem('receipts', JSON.stringify(receipts));
};

// Add a new receipt
export const addReceipt = (receipt: Receipt) => {
    const receipts = getReceipts();
    receipts.push(receipt);
    saveReceipts(receipts);
};

// Get a receipt by ID
export const getReceiptById = (id: string): Receipt | undefined => {
    const receipts = getReceipts();
    return receipts.find(r => r.id === id);
};

// Update a receipt
export const updateReceipt = (updated: Receipt) => {
    const receipts = getReceipts().map(r => (r.id === updated.id ? updated : r));
    saveReceipts(receipts);
};

// Delete a receipt
export const deleteReceipt = (id: string) => {
    const receipts = getReceipts().filter(r => r.id !== id);
    saveReceipts(receipts);
};