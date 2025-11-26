import { type Transaction } from '../types';

// Get all transactions
export const getTransactions = (): Transaction[] => {
    const transactions = localStorage.getItem('transactions');
    return transactions ? JSON.parse(transactions) : [];
};

// Save transactions
const saveTransactions = (transactions: Transaction[]) => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
};

// Add a new transaction
export const addTransaction = (transaction: Transaction) => {
    const transactions = getTransactions();
    transactions.push(transaction);
    saveTransactions(transactions);
};

// Get a transaction by ID
export const getTransactionById = (id: string): Transaction | undefined => {
    const transactions = getTransactions();
    return transactions.find(t => t.id === id);
};

// Update a transaction
export const updateTransaction = (updated: Transaction) => {
    const transactions = getTransactions().map(t => (t.id === updated.id ? updated : t));
    saveTransactions(transactions);
};

// Delete a transaction
export const deleteTransaction = (id: string) => {
    const transactions = getTransactions().filter(t => t.id !== id);
    saveTransactions(transactions);
};