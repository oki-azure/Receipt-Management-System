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
    count: number;
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
    tags?: Tag[];
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