import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Link } from 'react-router-dom';
import { type Transaction } from '../types';

const data = [
    { name: 'Week 1', value: 1200 },
    { name: 'Week 2', value: 2100 },
    { name: 'Week 3', value: 800 },
    { name: 'Week 4', value: 1600 },
    { name: 'Week 5', value: 2400 },
];

const pieData = [
    { name: 'Groceries', value: 400, color: '#60A5FA' },
    { name: 'Travel', value: 300, color: '#A78BFA' },
    { name: 'Utilities', value: 300, color: '#4ADE80' },
    { name: 'Dining', value: 200, color: '#FBBF24' },
];

const transactions: Transaction[] = [
    { id: '1', vendor: 'Starbucks', amount: 5.75, category: 'Dining', date: 'Oct 26, 2023', status: 'Approved' },
    { id: '2', vendor: 'Amazon', amount: 42.99, category: 'Shopping', date: 'Oct 25, 2023', status: 'Pending' },
    { id: '3', vendor: "Trader Joe's", amount: 88.14, category: 'Groceries', date: 'Oct 24, 2023', status: 'Approved' },
    { id: '4', vendor: 'United Airlines', amount: 345.00, category: 'Travel', date: 'Oct 22, 2023', status: 'Reimbursed' },
    { id: '5', vendor: 'PG&E', amount: 112.30, category: 'Utilities', date: 'Oct 20, 2023', status: 'Approved' },
];

const Dashboard: React.FC = () => {
    // const [filter, setFilter] = React.useState<'week' | 'month' | 'year'>('month');
    
    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-custom-gray">Here's a summary of your spending activity.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden rounded-lg border border-gray-200 bg-white p-1 md:flex">
                        <button className="rounded px-3 py-1 text-sm font-medium text-custom-gray hover:bg-gray-50">This Week</button>
                        <button className="rounded bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">This Month</button>
                        <button className="rounded px-3 py-1 text-sm font-medium text-custom-gray hover:bg-gray-50">This Year</button>
                    </div>
                    <Link to="/upload" className="flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-bold text-white hover:bg-success/90">
                        <span className="material-symbols-outlined">add_circle</span>
                        Upload Receipt
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <p className="text-sm font-medium text-custom-gray">Total Spending (This Month)</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">$4,782.50</p>
                    <div className="mt-1 flex items-center gap-1 text-sm font-medium text-success">
                        <span className="material-symbols-outlined text-base">arrow_upward</span>
                        5.2% vs. last month
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <p className="text-sm font-medium text-custom-gray">Total Receipts</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">124</p>
                    <div className="mt-1 flex items-center gap-1 text-sm font-medium text-success">
                        <span className="material-symbols-outlined text-base">arrow_upward</span>
                        +12 vs. last month
                    </div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <p className="text-sm font-medium text-custom-gray">Average Transaction Value</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">$38.57</p>
                    <div className="mt-1 flex items-center gap-1 text-sm font-medium text-danger">
                        <span className="material-symbols-outlined text-base">arrow_downward</span>
                        -1.5% vs. last month
                    </div>
                </div>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                {/* Line Chart */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-3 h-[300px]">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">Spending Over Time</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
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
                <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2 h-[300px]">
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
                            <span className="text-xl font-bold text-slate-900">$4.7k</span>
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
                                <th scope='col' className="px-4 py-3 text-right">Amount</th>
                                <th scope='col' className="hidden px-4 py-3 sm:table-cell">Category</th>
                                <th scope='col' className="hidden px-4 py-3 md:table-cell">Date</th>
                                <th scope='col' className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="group hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{tx.vendor}</td>
                                    <td className="px-4 py-3 text-right text-sm font-medium text-slate-900">${tx.amount.toFixed(2)}</td>
                                    <td className="hidden px-4 py-3 text-sm text-gray-500 sm:table-cell">{tx.category}</td>
                                    <td className="hidden px-4 py-3 text-sm text-gray-500 md:table-cell">{tx.date}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Link to={`/receipts/${tx.id}`} className="text-sm font-semibold text-primary hover:underline">View</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;