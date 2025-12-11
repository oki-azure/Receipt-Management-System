import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useNotifications } from "@/context/NotificationContext";

const Layout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    const location = useLocation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { hasNewNotification, markAllAsRead } = useNotifications();

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/'; // only highlight Dashboard on root
        }
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { name: 'Dashboard', icon: 'dashboard', path: '/' },
        { name: 'Receipts', icon: 'receipt_long', path: '/receipts' },
        { name: 'Reports', icon: 'bar_chart', path: '/reports' },
        { name: 'Categories', icon: 'sell', path: '/categories' },
        { name: 'Settings', icon: 'settings', path: '/settings' },
    ];

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Sidebar */}
            {isSidebarOpen && (
                <aside className="fixed inset-y-0 left-0 z-40 w-72 flex-col border-r border-gray-200 bg-white lg:flex">
                    <div className="flex items-center justify-between px-4 py-4 border-b">
                        <span className="text-lg font-bold text-slate-900">ReceiptManager</span>
                        <button
                            className="text-slate-500"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <nav className="flex flex-1 flex-col gap-1 px-4 py-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive(item.path)
                                    ? "bg-primary/10 text-primary"
                                    : "text-custom-gray hover:bg-gray-100 hover:text-slate-900"
                                    }`}
                            >
                                <span
                                    className={`material-symbols-outlined ${isActive(item.path) ? "fill-current" : ""
                                        }`}
                                >
                                    {item.icon}
                                </span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="border-t border-gray-200 p-4">
                        <Link
                            to="/help"
                            onClick={() => setIsSidebarOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-custom-gray hover:bg-gray-100 hover:text-slate-900"
                        >
                            <span className="material-symbols-outlined">help</span>
                            Help Center
                        </Link>
                        <button
                            onClick={() => {
                                logout();
                                navigate("/login");
                            }}
                            className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-custom-gray hover:bg-gray-100 hover:text-slate-900"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            Logout
                        </button>

                        {/* User Info */}
                        <div className="mt-4 flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                            <Link to="/settings" onClick={() => setIsSidebarOpen(false)}>
                                <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-200 text-slate-700 font-semibold">
                                    {user?.profilePic ? (
                                        <div
                                            className="h-10 w-10 rounded-full bg-cover bg-center"
                                            style={{ backgroundImage: `url(${user.profilePic})` }}
                                        ></div>
                                    ) : (
                                        <span>
                                            {user?.name
                                                ?.split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </span>
                                    )}
                                </div>
                            </Link>
                            <div className="overflow-hidden">
                                <p className="truncate text-sm font-medium text-slate-900">
                                    {user?.name}
                                </p>
                                <p className="truncate text-xs text-slate-500">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </aside>
            )}

            {/* Main Content Wrapper */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <button
                            className="text-slate-500"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <Link to="/dashboard">
                            <div className="flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                                    <span className="material-symbols-outlined text-2xl">receipt_long</span>
                                </div>
                                <span className="text-lg font-bold text-slate-900">ReceiptManager</span>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={
                                () => {
                                    navigate("/notifications");
                                    markAllAsRead();
                                }
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                        >
                            <span className="material-symbols-outlined cursor-pointer">
                                {hasNewNotification ? "notifications_active" : "notifications"}
                            </span>
                        </button>

                        <Link to="/settings">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-200 text-slate-700 font-semibold">
                                {user?.profilePic ? (
                                    <div
                                        className="h-8 w-8 rounded-full bg-cover bg-center"
                                        style={{ backgroundImage: `url(${user.profilePic})` }}
                                    ></div>
                                ) : (
                                    <span>
                                        {user?.name
                                            ?.split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </span>
                                )}
                            </div>
                        </Link>

                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-background-light p-4 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;