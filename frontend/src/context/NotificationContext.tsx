import React, { createContext, useContext, useEffect, useState } from "react";
import { type Notification, type NotificationContextType } from "../types";

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [hasNewNotification, setHasNewNotification] = useState(false);

    // Hydrate from LocalStorage
    useEffect(() => {
        const stored = localStorage.getItem("notifications");
        if (stored) {
            const parsed: Notification[] = JSON.parse(stored);
            // revive Date objects
            setNotifications(parsed.map(n => ({ ...n, createdAt: new Date(n.createdAt) })));
        }
    }, []);

    // Persist to LocalStorage whenever notifications change
    useEffect(() => {
        localStorage.setItem("notifications", JSON.stringify(notifications));
    }, [notifications]);

    // Helpers
    const pushNotification = (notif: Notification) => {
        setNotifications(prev => [notif, ...prev]);
        setHasNewNotification(true);
    };

    const notifyReceipt = (action: "added" | "updated" | "deleted", name: string, amount?: string) => {
        pushNotification({
            id: Date.now(),
            title: `Receipt ${action}`,
            message:
                action === "added"
                    ? `Receipt from ${name} (${amount}) was added.`
                    : action === "updated"
                        ? `Receipt from ${name} was updated.`
                        : `Receipt from ${name} was deleted.`,
            createdAt: new Date(),
            type: action === "deleted" ? "warning" : "success",
            read: false,
        });
    };

    const notifyCategory = (action: "added" | "updated" | "deleted", name: string) => {
        pushNotification({
            id: Date.now(),
            title: `Category ${action}`,
            message: `Category "${name}" was ${action}.`,
            createdAt: new Date(),
            type: action === "deleted" ? "warning" : "info",
            read: false,
        });
    };

    const notifyTag = (action: "added" | "updated" | "deleted", name: string) => {
        pushNotification({
            id: Date.now(),
            title: `Tag ${action}`,
            message: `Tag "${name}" was ${action}.`,
            createdAt: new Date(),
            type: action === "deleted" ? "warning" : "info",
            read: false,
        });
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setHasNewNotification(false);
    };

    const clearAll = () => {
        setNotifications([]);
        setHasNewNotification(false);
    };

    return (
        <NotificationContext.Provider
            value={{ notifications, hasNewNotification, notifyReceipt, notifyCategory, notifyTag, markAllAsRead, clearAll }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = (): NotificationContextType => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error("useNotifications must be used within a NotificationProvider");
    return ctx;
};