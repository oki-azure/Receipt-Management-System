import React, { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { type Category, type Receipt, type Transaction } from '../types';
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const Reports: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [allChecked, setAllChecked] = useState(true);
    const [activeRange, setActiveRange] = useState<string>("Year to Date");
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [showReport, setShowReport] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("categories");
        if (stored) {
            try {
                const parsed: Category[] = JSON.parse(stored);
                setCategories(parsed);

                // if All Categories is ticked by default, select all IDs immediately
                if (allChecked) {
                    setSelectedCategories(parsed.map((c) => c.id));
                }
            } catch (err) {
                console.error("Failed to parse categories from LocalStorage", err);
            }
        }
    }, [allChecked]);

    useEffect(() => {
        const storedTransactions = localStorage.getItem("transactions");
        const storedReceipts = localStorage.getItem("receipts");

        if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
        if (storedReceipts) setReceipts(JSON.parse(storedReceipts));
    }, []);



    /********************** YTD calculations: **********************/
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const today = new Date();

    const ytdTransactions = transactions.filter(txn => {
        const txnDate = new Date(txn.date);
        return txnDate >= startOfYear && txnDate <= today;
    });

    const ytdReceipts = receipts.filter(r => {
        const txn = transactions.find(t => t.id === r.transactionId);
        if (!txn) return false;
        const txnDate = new Date(txn.date);
        return txnDate >= startOfYear && txnDate <= today;
    });

    // Total Spend
    const totalSpend = ytdTransactions.reduce((sum, t) => sum + t.amount, 0);

    // Receipts count
    const receiptsCount = ytdReceipts.length;

    // Top Category
    const categoryTotals: Record<string, number> = {};
    ytdTransactions.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";

    // Average Transaction
    const avgTxn = ytdTransactions.length > 0 ? totalSpend / ytdTransactions.length : 0;

    // Aggregate totals by category for pie chart
    const categoryTotalsForCharts: { name: string; value: number; color: string }[] = categories.map(cat => {
        const total = ytdTransactions
            .filter(txn => txn.category === cat.name)
            .reduce((sum, txn) => sum + txn.amount, 0);
        return { name: cat.name, value: total, color: cat.color };
    }).filter(c => c.value > 0); // only show categories with spend

    const filteredTransactions = transactions.filter(txn => {
        const txnDate = new Date(txn.date);
        const isYTD = txnDate >= startOfYear && txnDate <= today;

        // Find the category ID for this transaction's category name
        const categoryId = categories.find(
            c => c.name.trim().toLowerCase() === txn.category.trim().toLowerCase()
        )?.id;

        const isInCategory = categoryId ? selectedCategories.includes(categoryId) : false;

        return isYTD && isInCategory;
    });

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    // Build cumulative spend for line data
    let runningTotal = 0;
    const cumulativeData = sortedTransactions.map(txn => {
        runningTotal += txn.amount;
        return {
            name: new Date(txn.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            }),
            value: runningTotal,
        };
    });

    const exportPDF = async () => {
        const reportElement = document.getElementById("report-content");
        if (!reportElement) return;

        const dataUrl = await toPng(reportElement);
        const pdf = new jsPDF("p", "mm", "a4");
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("report.pdf");
    };


    return (
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* Left Sidebar Filter */}
            <aside className="w-full rounded-xl border border-gray-200 bg-white p-6 lg:w-80 lg:shrink-0">
                <h2 className="mb-6 text-xl font-bold text-slate-900">Customize Report</h2>

                <div className="mb-6 space-y-4">
                    <h3 className="text-sm font-bold text-slate-900">Date Range</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {["Last 30 Days", "This Quarter", "Last 90 Days", "Year to Date"].map((range) => (
                            <button
                                key={range}
                                onClick={() => setActiveRange(range)}
                                className={`rounded px-2 py-2 text-sm ${activeRange === range
                                    ? "border border-primary bg-primary/10 text-primary font-semibold"
                                    : "border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6 space-y-3">
                    <h3 className="text-sm font-bold text-slate-900">Categories</h3>
                    <div className="space-y-2">
                        {/* All Categories */}
                        <label className="flex items-center gap-2 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                checked={allChecked}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setAllChecked(checked);
                                    if (checked) {
                                        // tick all categories
                                        setSelectedCategories(categories.map((c) => c.id));
                                    } else {
                                        // untick everything
                                        setSelectedCategories([]);
                                    }
                                }}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            All Categories
                        </label>

                        {categories.map((cat) => (
                            <label key={cat.id} className="flex items-center gap-2 text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(cat.id)}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        let updated = [...selectedCategories];
                                        if (checked) {
                                            updated.push(cat.id);
                                        } else {
                                            updated = updated.filter((id) => id !== cat.id);
                                        }
                                        setSelectedCategories(updated);
                                        // if any individual change happens, All Categories unticks
                                        setAllChecked(updated.length === categories.length);
                                    }}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="flex items-center gap-2" style={{ color: cat.color }}>
                                    {cat.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => setShowReport(true)}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary/90"
                >
                    <span className="material-symbols-outlined">description</span>
                    Generate Report
                </button>
            </aside>

            {
                showReport && (
                    <>
                        {/* Main Report Content */}
                        <div className="flex-1 space-y-8" id='report-content'>
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900">Financial Reports</h1>
                                    <p className="text-custom-gray">Analyze your spending with charts and data.</p>
                                </div>
                                <button className="flex items-center gap-2 rounded-lg bg-warning px-4 py-2 text-sm font-bold text-white hover:bg-warning/90" onClick={exportPDF}>
                                    <span className="material-symbols-outlined">download</span>
                                    Export
                                </button>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                                {[
                                    { label: "Total Spend", value: `$${totalSpend.toFixed(2)}` },
                                    { label: "Receipts", value: receiptsCount.toString() },
                                    { label: "Top Category", value: topCategory },
                                    { label: "Avg Txn", value: `$${avgTxn.toFixed(2)}` },
                                ].map((stat, i) => (
                                    <div key={i} className="rounded-xl border border-gray-200 bg-white p-6">
                                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                        <p className="mt-1 text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Charts */}
                            <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
                                <div className="rounded-xl border border-gray-200 bg-white p-6 xl:col-span-3">
                                    <h3 className="mb-4 text-lg font-bold text-slate-900">Spending Trend</h3>
                                    <div className="h-64 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={cumulativeData}>
                                                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#50E3C2"
                                                    strokeWidth={3}
                                                    dot={false}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center rounded-xl border border-gray-200 bg-white p-6 xl:col-span-2">
                                    <h3 className="mb-4 text-lg font-bold text-slate-900">Breakdown by Category</h3>
                                    <div className="h-48 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={categoryTotalsForCharts}
                                                    innerRadius={50}
                                                    outerRadius={70}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                    label={({ name, percent }) =>
                                                        percent !== undefined ? `${name} ${(percent * 100).toFixed(0)}%` : name
                                                    }
                                                >
                                                    {categoryTotalsForCharts.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
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
                                            {sortedTransactions.map(txn => (
                                                <tr key={txn.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        {new Date(txn.date).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            day: "numeric",
                                                            year: "numeric"
                                                        })}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium">{txn.vendor}</td>
                                                    <td className="px-6 py-4">{txn.category}</td>
                                                    <td className="px-6 py-4 text-right font-medium">
                                                        ${txn.amount.toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </div>
    );
};

export default Reports;