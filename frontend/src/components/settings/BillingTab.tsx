import React, { useEffect, useState } from "react";
import { type BillingHistoryItem, type PaymentMethod } from "../../types";

const defaultHistory: BillingHistoryItem[] = [
    { date: "Oct 26, 2023", desc: "Pro Plan - Monthly", amount: "$12.00", status: "Paid" },
    { date: "Sep 26, 2023", desc: "Pro Plan - Monthly", amount: "$12.00", status: "Paid" },
    { date: "Aug 26, 2023", desc: "Pro Plan - Monthly", amount: "$12.00", status: "Pending" },
];

const BillingTab: React.FC = () => {
    const [plan, setPlan] = useState<"Pro" | "Free Trial">("Pro");
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
    const [history, setHistory] = useState<BillingHistoryItem[]>(defaultHistory);

    // Hydrate from LocalStorage
    useEffect(() => {
        const storedPlan = localStorage.getItem("billingPlan");
        const storedPayment = localStorage.getItem("paymentMethod");
        const storedHistory = localStorage.getItem("billingHistory");

        if (storedPlan) setPlan(storedPlan as "Pro" | "Free Trial");
        if (storedPayment) setPaymentMethod(JSON.parse(storedPayment));
        if (storedHistory) setHistory(JSON.parse(storedHistory));
        else localStorage.setItem("billingHistory", JSON.stringify(defaultHistory));
    }, []);

    const togglePlan = () => {
        const newPlan = plan === "Pro" ? "Free Trial" : "Pro";
        setPlan(newPlan);
        localStorage.setItem("billingPlan", newPlan);
    };

    const savePaymentMethod = (method: PaymentMethod) => {
        setPaymentMethod(method);
        localStorage.setItem("paymentMethod", JSON.stringify(method));
    };

    return (
        <div className="space-y-6">
            {/* Plan */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center justify-between p-6">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Current Plan</h2>
                        <p className="text-sm text-gray-500">
                            You are currently on the{" "}
                            <span
                                className={`font-bold ${plan === "Pro" ? "text-primary" : "text-red-500"
                                    }`}
                            >
                                {plan} Plan
                            </span>
                            .
                        </p>
                    </div>
                    <button
                        onClick={togglePlan}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                        Change Plan
                    </button>
                </div>
                <div className="border-t border-gray-200 p-6 bg-primary/5">
                    <div className="flex items-center justify-between">
                        <div>
                            {plan === "Pro" ? (
                                <>
                                    <p className="text-2xl font-bold text-slate-900">
                                        $12<span className="text-sm font-normal text-gray-500">/month</span>
                                    </p>
                                    <p className="text-sm text-gray-500">Next billing date: Nov 26, 2023</p>
                                </>
                            ) : (
                                <p className="text-sm text-gray-500">Free trial active</p>
                            )}
                        </div>
                        <span
                            className={`rounded-full px-3 py-1 text-sm font-medium ${plan === "Pro"
                                    ? "bg-success/10 text-success"
                                    : "bg-red-100 text-red-600"
                                }`}
                        >
                            {plan === "Pro" ? "Active" : "Inactive"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Payment Method */}
            {plan === "Pro" && (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-slate-900">Payment Method</h2>
                    </div>
                    <div className="border-t border-gray-200 p-6">
                        {paymentMethod ? (
                            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-14 items-center justify-center rounded bg-gray-100">
                                        <span className="font-bold text-slate-600 italic">{paymentMethod.type}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900">
                                            {paymentMethod.type} ending in {paymentMethod.last4}
                                        </p>
                                        <p className="text-sm text-gray-500">Expiry {paymentMethod.expiry}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() =>
                                        savePaymentMethod({ type: "VISA", last4: "1111", expiry: "01/2026" })
                                    }
                                    className="text-sm font-medium text-primary hover:underline"
                                >
                                    Edit
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() =>
                                    savePaymentMethod({ type: "VISA", last4: "4242", expiry: "12/2024" })
                                }
                                className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-slate-900"
                            >
                                <span className="material-symbols-outlined text-lg">add</span>
                                Add Payment Method
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* History */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-slate-900">Billing History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Details</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                                <th className="px-6 py-3 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                            {history.map((inv, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-slate-900">{inv.date}</td>
                                    <td className="px-6 py-4 text-gray-600">{inv.desc}</td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-900">{inv.amount}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span
                                            className={`rounded-full px-3 py-1 text-sm font-medium ${inv.status === "Paid"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {inv.status}
                                        </span>
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

export default BillingTab;