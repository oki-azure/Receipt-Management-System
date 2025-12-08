export interface Transaction {
    id: string;
    vendor: string;
    amount: number;
    category: string;
    date: string;
}

export interface Category {
    id: string;
    name: string;
    color: string;
}

export interface Tag {
    id: string;
    name: string;
    count: number;
}

export interface Receipt {
    id: string;
    transactionId: string; // Link to Transaction
    fileUrl: string;
    uploadedAt: string;
    notes?: string;
    tags?: string[];
    imageUrl?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface ApiError {
    message: string;
    statusCode?: number;
}

export interface StatsCardProps {
    label: string;
    value: string | number;
    change: number; // percentage change
    comparisonLabel?: string; // e.g. "vs. last month"
}

export interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}