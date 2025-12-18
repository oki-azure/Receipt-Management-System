import type { Receipt } from "@/types";

const API_URL = import.meta.env.VITE_API_URL;

// 1. Get all receipts
export const getReceipts = async (token: string): Promise<Receipt[]> => {
    try {
        const res = await fetch(`${API_URL}/receipts`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch receipts");
        return await res.json();
    } catch (err) {
        console.error("Get receipts error:", err);
        return [];
    }
};

// 2. Create a new receipt
export const createReceipt = async (
    receipt: Omit<Receipt, "id" | "created_at">,
    token: string
): Promise<Receipt | null> => {
    try {
        const res = await fetch(`${API_URL}/receipts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(receipt),
        });
        if (!res.ok) throw new Error("Failed to create receipt");
        return await res.json();
    } catch (err) {
        console.error("Create receipt error:", err);
        return null;
    }
};

// 3. Get receipt by ID
export const getReceiptById = async (
    id: number,
    token: string
): Promise<Receipt | null> => {
    try {
        const res = await fetch(`${API_URL}/receipts/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch receipt");
        return await res.json();
    } catch (err) {
        console.error("Get receipt error:", err);
        return null;
    }
};