import React from "react";
import { type StatsCardProps, type Transaction } from "../../types";


export const StatsCard: React.FC<StatsCardProps> = (
    {
        label,
        value,
        change,
        comparisonLabel = "vs. last period",
    }
) => {
    const isPositive = change >= 0;

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-custom-gray">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
            <div
                className={`mt-1 flex items-center gap-1 text-sm font-medium ${isPositive ? "text-success" : "text-danger"
                    }`}
            >
                <span className="material-symbols-outlined text-base">
                    {isPositive ? "arrow_upward" : "arrow_downward"}
                </span>
                {change.toFixed(1)}% {comparisonLabel}
            </div>
        </div>
    );
};

// Sum of amounts
export function calculateTotalSpending(transactions: Transaction[]): number {
    return transactions.reduce((acc, txn) => acc + (txn.amount ?? 0), 0);
}

// Average transaction value
export function calculateAverageTransaction(transactions: Transaction[]): number {
    if (transactions.length === 0) return 0;
    return calculateTotalSpending(transactions) / transactions.length;
}

// Percentage change helper
export function calculateChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
}