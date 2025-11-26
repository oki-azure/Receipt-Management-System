import React from 'react';
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

const data = [
    { name: 'Week 1', value: 1000 },
    { name: 'Week 2', value: 2400 },
    { name: 'Week 3', value: 1500 },
    { name: 'Week 4', value: 3200 },
];

const pieData = [
    { name: 'Office Supplies', value: 45, color: '#60A5FA' },
    { name: 'Travel', value: 25, color: '#A78BFA' },
    { name: 'Food', value: 20, color: '#FBBF24' },
    { name: 'Utilities', value: 10, color: '#4ADE80' },
];

const Reports: React.FC = () => {
    return (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* Left Sidebar Filter */}
            <aside className="w-full rounded-xl border border-gray-200 bg-white p-6 lg:w-80 lg:shrink-0">
                <h2 className="mb-6 text-xl font-bold text-slate-900">Customize Report</h2>

                <div className="mb-6 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">Date Range</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button className="rounded border border-gray-200 px-2 py-2 text-sm text-gray-600 hover:border-primary hover:text-primary">Last 30 Days</button>
                        <button className="rounded border border-gray-200 px-2 py-2 text-sm text-gray-600 hover:border-primary hover:text-primary">This Quarter</button>
                        <button className="rounded border border-gray-200 px-2 py-2 text-sm text-gray-600 hover:border-primary hover:text-primary">Last 90 Days</button>
                        <button className="rounded border border-primary bg-primary/10 px-2 py-2 text-sm font-semibold text-primary">Year to Date</button>
                    </div>
                </div>

                <div className="mb-6 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900">Categories</h3>
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input type="checkbox" checked className="rounded border-gray-300 text-primary focus:ring-primary" /> All Categories
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" /> Food & Drink
                        </label>
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" /> Travel
                        </label>
                    </div>
                </div>

                <button className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-white hover:bg-primary/90">Generate Report</button>
            </aside>

            {/* Main Report Content */}
            <div className="flex-1 space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Financial Reports</h1>
                        <p className="text-custom-gray">Analyze your spending with charts and data.</p>
                    </div>
                    <button className="flex items-center gap-2 rounded-lg bg-warning px-4 py-2 text-sm font-bold text-white hover:bg-warning/90">
                        <span className="material-symbols-outlined">download</span>
                        Export
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                        { label: 'Total Spend', value: '$12,450', change: '+5.2%', isPos: true },
                        { label: 'Receipts', value: '312', change: '+12%', isPos: true },
                        { label: 'Top Category', value: 'Office...', change: null, isPos: true },
                        { label: 'Avg Txn', value: '$39.91', change: '-1.5%', isPos: false },
                    ].map((stat, i) => (
                        <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            <p className="mt-1 text-3xl font-bold text-slate-900">{stat.value}</p>
                            {stat.change && (
                                <div className={`mt-1 flex items-center text-sm font-medium ${stat.isPos ? 'text-success' : 'text-danger'}`}>
                                    <span className="material-symbols-outlined text-base">{stat.isPos ? 'arrow_upward' : 'arrow_downward'}</span>
                                    {stat.change}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 xl:col-span-3">
                        <h3 className="mb-4 text-lg font-bold text-slate-900">Spending Trend</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                    <Line type="monotone" dataKey="value" stroke="#50E3C2" strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="flex flex-col justify-center rounded-xl border border-gray-200 bg-white p-6 xl:col-span-2">
                        <h3 className="mb-4 text-lg font-bold text-slate-900">Breakdown by Category</h3>
                        <div className="h-48 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="p-6 font-bold text-slate-900">Recent Transactions</div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Vendor</th>
                                    <th className="px-6 py-3">Category</th>
                                    <th className="px-6 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4">Oct 11, 2023</td>
                                    <td className="px-6 py-4 font-medium">Staples</td>
                                    <td className="px-6 py-4">Office Supplies</td>
                                    <td className="px-6 py-4 text-right font-medium">$125.50</td>
                                </tr>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-6 py-4">Oct 10, 2023</td>
                                    <td className="px-6 py-4 font-medium">Delta Airlines</td>
                                    <td className="px-6 py-4">Travel</td>
                                    <td className="px-6 py-4 text-right font-medium">$842.00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
