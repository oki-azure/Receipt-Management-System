import React from "react";
import { useNotifications } from "../context/NotificationContext";
import { formatDistanceToNow } from "date-fns";

const Notifications: React.FC = () => {
    const { notifications, markAllAsRead, clearAll } = useNotifications();

    return (
        <div className="mx-auto max-w-3xl">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
                    <p className="text-custom-gray">
                        Stay updated with your account activity.
                    </p>
                </div>

                {/* Action buttons in a bordered group */}
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm">
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition"
                    >
                        <span className="material-symbols-outlined">mark_email_read</span>
                        Mark all as read
                    </button>
                    <div className="h-5 w-px bg-gray-200" /> {/* divider */}
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition"
                    >
                        <span className="material-symbols-outlined">delete</span>
                        Clear all
                    </button>
                </div>
            </div>

            {/* Notifications list */}
            <div className="space-y-4">
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={`flex items-start gap-4 rounded-xl border p-4 shadow-md transition-colors ${notif.read
                                ? "border-gray-200 bg-white"
                                : "border-primary/20 bg-blue-50/50"
                            }`}
                    >
                        {/* Icon */}
                        <div
                            className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notif.type === "success"
                                    ? "bg-green-100 text-green-600"
                                    : notif.type === "warning"
                                        ? "bg-orange-100 text-orange-600"
                                        : "bg-blue-100 text-blue-600"
                                }`}
                        >
                            <span className="material-symbols-outlined">
                                {notif.type === "success"
                                    ? "check_circle"
                                    : notif.type === "warning"
                                        ? "warning"
                                        : "info"}
                            </span>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="mb-1 flex justify-between">
                                <h3
                                    className={`font-semibold ${notif.read ? "text-slate-900" : "text-primary"
                                        }`}
                                >
                                    {notif.title}
                                </h3>
                                <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(notif.createdAt), {
                                        addSuffix: true,
                                    })}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">{notif.message}</p>
                        </div>

                        {/* Unread indicator */}
                        {!notif.read && (
                            <div className="mt-2 h-2 w-2 rounded-full bg-primary"></div>
                        )}
                    </div>
                ))}

                {/* Empty state */}
                {notifications.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-500 text-gray-400 shadow-md">
                            <span className="material-symbols-outlined text-3xl">
                                notifications_off
                            </span>
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">
                            No notifications
                        </h3>
                        <p className="text-gray-500">You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;