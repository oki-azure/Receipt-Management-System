import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen w-full bg-white">
            {/* Left Side: Hero Image */}
            <div className="hidden w-1/2 lg:block relative bg-slate-900">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{
                        backgroundImage:
                            'url("https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
                    }}
                ></div>
                <div className="relative z-10 flex h-full flex-col justify-center px-16 text-white">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-primary">
                        <span className="material-symbols-outlined text-4xl">receipt_long</span>
                    </div>
                    <h1 className="mb-4 text-4xl font-bold leading-tight">
                        Streamline Your Expenses
                    </h1>
                    <p className="text-lg text-slate-300">
                        The simplest way to manage your receipts, track spending, and generate reports all in one place.
                    </p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex w-full flex-col justify-center px-6 lg:w-1/2 lg:px-24">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;