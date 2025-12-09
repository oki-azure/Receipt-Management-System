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
    profilePic?: string;
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

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoggedIn: boolean;
    isHydrating: boolean;
    login: (email: string, password: string) => boolean;
    signup: (fullName: string, email: string, password: string, confirmPassword: string) => boolean;
    logout: () => void;
    deleteAccount: () => void;
}

export interface Preferences {
    language: string;
    currency: string;
    timezone: string;
    dateFormat: string;
    darkMode: boolean;
}

interface NotificationSetting {
    email: boolean;
    push: boolean;
}export interface Notifications {
    [key: string]: NotificationSetting;
}

export interface Integration {
    name: string;
    icon: string;
    desc: string;
    connected: boolean;
}

export interface BillingHistoryItem {
    date: string;
    desc: string;
    amount: string;
    status: "Paid" | "Pending";
}

export interface PaymentMethod {
    type: string;
    last4: string;
    expiry: string;
}