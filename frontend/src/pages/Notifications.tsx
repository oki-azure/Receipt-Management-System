import React from 'react';

const Notifications: React.FC = () => {
    const notifications = [
        { id: 1, title: 'Receipt Approved', message: 'Your receipt from Starbucks ($5.75) has been approved.', time: '2 hours ago', type: 'success', read: false },
        { id: 2, title: 'Weekly Report Ready', message: 'Your spending report for Oct 15 - Oct 21 is ready to view.', time: '1 day ago', type: 'info', read: true },
        { id: 3, title: 'Subscription Renewed', message: 'Your Pro Plan subscription has been renewed successfully.', time: '2 days ago', type: 'info', read: true },
        { id: 4, title: 'Login Alert', message: 'New sign-in detected from Mac OS X in San Francisco, CA.', time: '3 days ago', type: 'warning', read: true },
    ];

    return (
        <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
                    <p className="text-custom-gray">Stay updated with your account activity.</p>
                </div>
                <button className="text-sm font-medium text-primary hover:underline">Mark all as read</button>
            </div>

            <div className="space-y-4">
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={`flex items-start gap-4 rounded-xl border p-4 transition-colors ${notif.read ? 'border-gray-200 bg-white' : 'border-primary/20 bg-blue-50/50'}`}
                    >
                        <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${notif.type === 'success' ? 'bg-green-100 text-green-600' :
                                notif.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                                    'bg-blue-100 text-blue-600'
                            }`}>
                            <span className="material-symbols-outlined">
                                {notif.type === 'success' ? 'check_circle' : notif.type === 'warning' ? 'warning' : 'info'}
                            </span>
                        </div>
                        <div className="flex-1">
                            <div className="mb-1 flex justify-between">
                                <h3 className={`font-semibold ${notif.read ? 'text-slate-900' : 'text-primary'}`}>{notif.title}</h3>
                                <span className="text-xs text-gray-500">{notif.time}</span>
                            </div>
                            <p className="text-sm text-gray-600">{notif.message}</p>
                        </div>
                        {!notif.read && (
                            <div className="mt-2 h-2 w-2 rounded-full bg-primary"></div>
                        )}
                    </div>
                ))}

                {notifications.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                            <span className="material-symbols-outlined text-3xl">notifications_off</span>
                        </div>
                        <h3 className="text-lg font-medium text-slate-900">No notifications</h3>
                        <p className="text-gray-500">You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;