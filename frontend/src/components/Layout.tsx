import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { name: 'Dashboard', icon: 'dashboard', path: '/' },
        { name: 'Receipts', icon: 'receipt_long', path: '/receipts' },
        { name: 'Reports', icon: 'bar_chart', path: '/reports' },
        { name: 'Categories', icon: 'sell', path: '/categories' },
        { name: 'Settings', icon: 'settings', path: '/settings' },
    ];

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background-light">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r border-gray-200 bg-white lg:flex">
                <div className="flex items-center gap-3 px-6 py-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white">
                        <span className="material-symbols-outlined text-2xl">receipt_long</span>
                    </div>
                    <h1 className="text-xl font-bold text-slate-900">ReceiptManager</h1>
                </div>

                <nav className="flex flex-1 flex-col gap-1 px-4 py-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive(item.path)
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-custom-gray hover:bg-gray-100 hover:text-slate-900'
                                }`}
                        >
                            <span className={`material-symbols-outlined ${isActive(item.path) ? 'fill-current' : ''}`}>
                                {item.icon}
                            </span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="border-t border-gray-200 p-4">
                    <Link
                        to="/help"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-custom-gray hover:bg-gray-100 hover:text-slate-900"
                    >
                        <span className="material-symbols-outlined">help</span>
                        Help Center
                    </Link>
                    <button
                        onClick={() => navigate('/login')}
                        className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-custom-gray hover:bg-gray-100 hover:text-slate-900"
                    >
                        <span className="material-symbols-outlined">logout</span>
                        Logout
                    </button>
                    <div className="mt-4 flex items-center gap-3 rounded-lg border border-gray-200 p-3">
                        <div
                            className="h-10 w-10 rounded-full bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    'url("https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80")',
                            }}
                        ></div>
                        <div className="overflow-hidden">
                            <p className="truncate text-sm font-medium text-slate-900">Eleanor Pena</p>
                            <p className="truncate text-xs text-slate-500">eleanor@example.com</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top Header (Mobile + Desktop) */}
                <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 lg:px-8">
                    <div className="flex items-center gap-4 lg:hidden">
                        <button className="text-slate-500">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <span className="text-lg font-bold text-slate-900">ReceiptManager</span>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden flex-1 lg:block">
                        <div className="relative max-w-md">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Search receipts, reports, settings..."
                                className="w-full rounded-lg border-none bg-gray-100 py-2 pl-10 pr-4 text-sm text-slate-900 focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100">
                            <span className="material-symbols-outlined">notifications</span>
                        </button>
                        <div
                            className="h-8 w-8 rounded-full bg-cover bg-center lg:hidden"
                            style={{
                                backgroundImage:
                                    'url("https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80")',
                            }}
                        ></div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto bg-background-light p-4 lg:p-8">
                    <div className="mx-auto max-w-7xl">{children}</div>
                </main>
            </div>
        </div>
    );
};

export default Layout;