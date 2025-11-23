export interface Transaction {
    id: string;
    vendor: string;
    amount: number;
    category: string;
    date: string;
    status: 'Approved' | 'Pending' | 'Rejected' | 'Reimbursed';
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
