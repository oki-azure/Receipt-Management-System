import React, { useEffect, useState } from "react";
import { type Notifications } from "../../types";

const notificationItems = [
    { key: "receiptUploaded", title: "Receipt Uploaded", desc: "When a new receipt is successfully uploaded." },
    { key: "approvalStatus", title: "Approval Status", desc: "When a receipt is approved or rejected." },
    { key: "weeklyReport", title: "Weekly Report", desc: "A summary of your weekly spending." },
    { key: "securityAlerts", title: "Security Alerts", desc: "Login attempts from new devices." },
];

const defaultNotifications: Notifications = {
    receiptUploaded: { email: true, push: false },
    approvalStatus: { email: true, push: false },
    weeklyReport: { email: false, push: false },
    securityAlerts: { email: true, push: true },
};

const NotificationsTab: React.FC = () => {
    const [notifications, setNotifications] = useState<Notifications>(defaultNotifications);

    // Hydrate from LocalStorage or create defaults
    useEffect(() => {
        const stored = localStorage.getItem("notifications");
        if (stored) {
            setNotifications(JSON.parse(stored));
        } else {
            localStorage.setItem("notifications", JSON.stringify(defaultNotifications));
        }
    }, []);

    const toggleSetting = (key: string, type: "email" | "push") => {
        setNotifications((prev) => ({
            ...prev,
            [key]: { ...prev[key], [type]: !prev[key][type] },
        }));
    };

    const saveChanges = () => {
        localStorage.setItem("notifications", JSON.stringify(notifications));
        alert("Notification settings saved!");
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-900">Notification Settings</h2>
                <p className="text-sm text-gray-500">Choose what you want to be notified about.</p>
            </div>

            <div className="border-t border-gray-200">
                {notificationItems.map((item) => (
                    <div
                        key={item.key}
                        className="flex items-center justify-between p-6 border-b border-gray-100 last:border-0"
                    >
                        <div>
                            <p className="font-medium text-slate-900">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={notifications[item.key]?.email || false}
                                    onChange={() => toggleSetting(item.key, "email")}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                Email
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={notifications[item.key]?.push || false}
                                    onChange={() => toggleSetting(item.key, "push")}
                                    className="rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                Push
                            </label>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end border-t border-gray-200 bg-gray-50 p-4">
                <button
                    onClick={saveChanges}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default NotificationsTab;