import React from 'react';

const Settings: React.FC = () => {
    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-custom-gray">Manage your account settings and preferences.</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex overflow-x-auto border-b border-gray-200">
                {['Profile', 'Preferences', 'Notifications', 'Integrations', 'Billing'].map((tab, idx) => (
                    <button
                        key={tab}
                        className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium ${idx === 0
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-slate-900'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">
                            {idx === 0 ? 'person' : idx === 1 ? 'tune' : idx === 2 ? 'notifications_active' : idx === 3 ? 'cable' : 'credit_card'}
                        </span>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Personal Info */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-slate-900">Personal Information</h2>
                    <p className="text-sm text-gray-500">Manage your personal information and account settings.</p>
                </div>
                <div className="border-t border-gray-200 p-6">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center">
                        <div className="flex items-center gap-4">
                            <div
                                className="h-20 w-20 rounded-full bg-cover bg-center"
                                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80")' }}
                            ></div>
                            <div>
                                <p className="text-lg font-bold text-slate-900">Profile Picture</p>
                                <p className="text-sm text-gray-500">PNG, JPG or GIF. Max 2MB.</p>
                            </div>
                        </div>
                        <div className="ml-auto flex gap-3">
                            <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50">Remove</button>
                            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">Upload Image</button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-900">Full Name</label>
                            <input type="text" defaultValue="Eleanor Vance" className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-900">Email Address</label>
                            <input type="email" defaultValue="eleanor@example.com" className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end border-t border-gray-200 bg-gray-50 p-4">
                    <button disabled className="cursor-not-allowed rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white opacity-50">Save Changes</button>
                </div>
            </div>

            {/* Password */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-slate-900">Change Password</h2>
                    <p className="text-sm text-gray-500">Update your password for enhanced security.</p>
                </div>
                <div className="border-t border-gray-200 p-6">
                    <div className="w-full space-y-4 md:w-1/2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-900">Current Password</label>
                            <input type="password" className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary" />
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-900">New Password</label>
                            <input type="password" className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-900">Confirm New Password</label>
                            <input type="password" className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary" />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end border-t border-gray-200 bg-gray-50 p-4">
                    <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">Update Password</button>
                </div>
            </div>

            {/* Delete Account */}
            <div className="flex flex-col justify-between gap-4 rounded-xl border border-red-200 bg-white p-6 md:flex-row md:items-center">
                <div>
                    <h2 className="text-lg font-bold text-danger">Delete Account</h2>
                    <p className="text-sm text-gray-500">Permanently delete your account and all associated data.</p>
                </div>
                <button className="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white hover:bg-danger/90">Delete My Account</button>
            </div>
        </div>
    );
};

export default Settings;
