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
    id: number;
    vendor_name: string;
    total_amount: number;
    purchase_date: string; // ISO date string
    category: string;
    notes?: string;
    user_id: number;
    created_at?: string; // only present on POST response
    fileUrl?: string;
    imageUrl?: string;
}


export interface Transaction { }

export interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
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
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    deleteAccount: () => void;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
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

export interface Notification {
    id: number;
    title: string;
    message: string;
    createdAt: number;
    type: "success" | "info" | "warning";
    read: boolean;
}

export interface NotificationContextType {
    notifications: Notification[];
    notifyReceipt: (action: "added" | "updated" | "deleted", name: string, amount?: string) => void;
    notifyCategory: (action: "added" | "updated" | "deleted", name: string) => void;
    notifyTag: (action: "added" | "updated" | "deleted", name: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
    hasNewNotification: boolean;
}