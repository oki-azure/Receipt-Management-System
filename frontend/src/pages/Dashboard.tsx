import React, { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Link } from 'react-router-dom';
import { type Transaction } from '../types';
import { getTransactions } from '../utils/transactions';
import { DashboardFilter } from '../components/Dashboard/DashboardFilter';
import { StatsCard } from '../components/Dashboard/StatsCard';



const Dashboard: React.FC = () => {
    // const [filter, setFilter] = React.useState<'week' | 'month' | 'year'>('month');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [totalSpending, setTotalSpending] = useState<number>(0);
    const [monthlySpending, setMonthlySpending] = useState<number>(0); // this month only
    const [spendingChange, setSpendingChange] = useState<number>(0);
    const [totalReceipts, setTotalReceipts] = useState<number>(0); // this month count
    const [receiptsChange, setReceiptsChange] = useState<number>(0);
    const [averageTransaction, setAverageTransaction] = useState<number>(0);
    const [averageChange, setAverageChange] = useState<number>(0);
    const [activeFilter, setActiveFilter] = useState<"week" | "month" | "year" | "all">("month");



    const filterByMonth = (transactions: Transaction[], month: number, year: number) => {
        return transactions.filter(txn => {
            const d = new Date(txn.date);
            return d.getMonth() === month && d.getFullYear() === year;
        });
    };

    useEffect(() => {
        setTransactions(getTransactions());
    }, []);

    // Transform Data for Line Chart
    const lineData = useMemo(() => {
        const grouped: Record<string, number> = {};

        transactions.forEach((t) => {
            const date = new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
            grouped[date] = (grouped[date] || 0) + t.amount;
        });

        return Object.entries(grouped).map(([name, value]) => ({ name, value }));
    }, [transactions]);

    // Transform Data for Pie Chart
    const pieData = useMemo(() => {
        const grouped: Record<string, number> = {};

        transactions.forEach((t) => {
            grouped[t.category] = (grouped[t.category] || 0) + t.amount;
        });

        const colors = ["#137fec", "#16a34a", "#f59e0b", "#dc2626", "#617589"];

        return Object.entries(grouped).map(([name, value], i) => ({
            name,
            value,
            color: colors[i % colors.length],
        }));
    }, [transactions]);

    useEffect(() => {
        const sum = transactions.reduce((acc, txn) => acc + (txn.amount ?? 0), 0);
        setTotalSpending(sum);

        // Month boundaries
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

        const thisMonthTxns = filterByMonth(transactions, thisMonth, thisYear);
        const lastMonthTxns = filterByMonth(transactions, lastMonth, lastMonthYear);

        // Spending
        const thisSpending = thisMonthTxns.reduce((acc, t) => acc + (t.amount ?? 0), 0);
        const lastSpending = lastMonthTxns.reduce((acc, t) => acc + (t.amount ?? 0), 0);
        setMonthlySpending(thisSpending);
        setSpendingChange(lastSpending > 0 ? ((thisSpending - lastSpending) / lastSpending) * 100 : 0);

        // Receipts (count)
        const thisReceipts = thisMonthTxns.length;
        const lastReceipts = lastMonthTxns.length;
        setTotalReceipts(thisReceipts);
        setReceiptsChange(lastReceipts > 0 ? ((thisReceipts - lastReceipts) / lastReceipts) * 100 : 0);

        // Average transaction
        const thisAvg = thisMonthTxns.length > 0 ? thisSpending / thisMonthTxns.length : 0;
        const lastAvg = lastMonthTxns.length > 0 ? lastSpending / lastMonthTxns.length : 0;
        setAverageTransaction(thisAvg);
        setAverageChange(lastAvg > 0 ? ((thisAvg - lastAvg) / lastAvg) * 100 : 0);
    }, [transactions]);


    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-custom-gray">Here's a summary of your spending activity.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="space-y-6">
                        <DashboardFilter active={activeFilter} onChange={setActiveFilter} />
                    </div>
                    <Link to="/upload" className="flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-bold text-black hover:bg-success/90">
                        <span className="material-symbols-outlined">add_circle</span>
                        Upload Receipt
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <p className="text-sm font-medium text-custom-gray">Total Spending (This Month)</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">${monthlySpending.toFixed(2)}</p>
                    <div
                        className={`mt-1 flex items-center gap-1 text-sm font-medium ${spendingChange >= 0 ? 'text-success' : 'text-danger'
                            }`}
                    >
                        <span className="material-symbols-outlined text-base">
                            {spendingChange >= 0 ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                        {spendingChange.toFixed(1)}% vs. last month
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <p className="text-sm font-medium text-custom-gray">Total Receipts</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{totalReceipts}</p>
                    <div
                        className={`mt-1 flex items-center gap-1 text-sm font-medium ${receiptsChange >= 0 ? 'text-success' : 'text-danger'
                            }`}
                    >
                        <span className="material-symbols-outlined text-base">
                            {receiptsChange >= 0 ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                        {receiptsChange.toFixed(1)}% vs. last month
                    </div>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <p className="text-sm font-medium text-custom-gray">Average Transaction Value</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">${averageTransaction.toFixed(2)}</p>
                    <div
                        className={`mt-1 flex items-center gap-1 text-sm font-medium ${averageChange >= 0 ? 'text-success' : 'text-danger'
                            }`}
                    >
                        <span className="material-symbols-outlined text-base">
                            {averageChange >= 0 ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                        {averageChange.toFixed(1)}% vs. last month
                    </div>
                </div>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                {/* Line Chart */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-3 h-[300px]">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">Spending Over Time</h3>
                    <div className="h-[250px] w-full pb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#137fec" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#137fec" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                    itemStyle={{ color: '#111827', fontWeight: 600 }}
                                />
                                <Line type="monotone" dataKey="value" stroke="#137fec" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart */}
                <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-slate-900">Spending by Category</h3>
                    <div className="relative flex h-[200px] w-full items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-xs text-gray-500">Total</span>
                            <span className="text-xl font-bold text-slate-900">${totalSpending.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        {pieData.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                                <span className="text-gray-600">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="rounded-xl border border-gray-200 bg-white p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
                    <Link to="/receipts" className="text-sm font-semibold text-primary hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-200 text-xs font-semibold text-custom-gray">
                            <tr>
                                <th scope='col' className="px-4 py-3">Vendor</th>
                                <th scope='col' className="px-4 py-3">Amount</th>
                                <th scope='col' className="hidden px-4 py-3 sm:table-cell">Category</th>
                                <th scope='col' className="hidden px-4 py-3 md:table-cell">Date</th>
                                <th scope='col' className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td className="px-4 py-2 text-sm text-gray-700">{transaction.vendor}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{transaction.amount}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{transaction.date}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{transaction.category}</td>
                                </tr>
                            ))}
                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-400">
                                        No receipts yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;