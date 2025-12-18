import React, { useEffect, useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Link } from 'react-router-dom';
import { type Receipt } from '../types';
import { useAuth } from '@/context/AuthContext';
import { getReceipts } from '@/utils/receipts';

const Dashboard: React.FC = () => {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [totalSpending, setTotalSpending] = useState<number>(0);
    const [averageReceipt, setAverageReceipt] = useState<number>(0);

    const { token } = useAuth();

    useEffect(() => {
        const fetchReceipts = async () => {
            if (!token) return;
            const data = await getReceipts(token);
            setReceipts(data);
        };
        fetchReceipts();
    }, [token]);

    // Transform Data for Line Chart
    const lineData = useMemo(() => {
        const grouped: Record<string, number> = {};

        receipts.forEach((r) => {
            const date = new Date(r.purchase_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
            grouped[date] = (grouped[date] || 0) + Number(r.total_amount);
        });

        return Object.entries(grouped).map(([name, value]) => ({ name, value }));
    }, [receipts]);

    // Transform Data for Pie Chart
    const pieData = useMemo(() => {
        const grouped: Record<string, number> = {};

        receipts.forEach((r) => {
            grouped[r.category] = (grouped[r.category] || 0) + Number(r.total_amount);
        });

        // helper to generate a random hex color
        const randomColor = () =>
            "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");

        return Object.entries(grouped).map(([name, value]) => ({
            name,
            value,
            color: randomColor(),
        }));
    }, [receipts]);

    useEffect(() => {
        const sum = receipts.reduce(
            (acc, r) => acc + Number(r.total_amount ?? 0),
            0
        );
        setTotalSpending(sum);

        const avg = receipts.length > 0 ? sum / receipts.length : 0;
        setAverageReceipt(avg);
    }, [receipts]);

    const formatDate = (isoString: string) => {
        const d = new Date(isoString);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = String(d.getFullYear()).slice(-2);
        return `${day}-${month}-${year}`;
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-custom-gray">Here's a summary of your spending activity.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link to="/upload" className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90 transition">
                        <span className="material-symbols-outlined">add_circle</span>
                        Upload Receipt
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
                    <p className="text-sm font-medium text-custom-gray">Total Spending</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">GH₵{!totalSpending ? 0 : totalSpending.toFixed(2)}</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
                    <p className="text-sm font-medium text-custom-gray">Total Receipts</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{receipts ? receipts.length : 0}</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 text-center">
                    <p className="text-sm font-medium text-custom-gray">Average Transaction Value</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">GH₵{!averageReceipt ? 0 : averageReceipt.toFixed(2)}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                {/* Line Chart */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 lg:col-span-3 h-[300px]">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">Spending Over Time</h3>
                    <div className="h-[250px] w-full pb-4 flex items-center justify-center">
                        {lineData && lineData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={lineData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#137fec" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#137fec" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#6B7280", fontSize: 12 }}
                                    />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#fff",
                                            borderRadius: "8px",
                                            border: "1px solid #e5e7eb",
                                        }}
                                        itemStyle={{ color: "#111827", fontWeight: 600 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#137fec"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-gray-500 text-sm">No data yet, add some receipts</p>
                        )}
                    </div>
                </div>

                {/* Donut Chart */}
                <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
                    <h3 className="text-lg font-semibold text-slate-900">Spending by Category</h3>
                    <div className="relative flex h-[200px] w-full items-center justify-center">
                        {pieData && pieData.length > 0 ? (
                            <>
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
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500 text-sm">No data yet, add some receipts</p>
                        )}
                    </div>

                    {pieData && pieData.length > 0 && (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            {pieData.map((item) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    ></span>
                                    <span className="text-gray-600">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
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
                            {receipts.map((receipt) => (
                                <tr key={receipt.id}>
                                    <td className="px-4 py-2 text-sm text-gray-700">{receipt.vendor_name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{receipt.total_amount}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{receipt.category}</td>
                                    <td className="px-4 py-2 text-sm text-gray-700">{formatDate(receipt.purchase_date)}</td>
                                </tr>
                            ))}
                            {receipts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-400">
                                        No receipts added yet, add some receipts
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