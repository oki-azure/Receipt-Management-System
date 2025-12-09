import React, { useEffect, useState } from "react";
import { type Integration } from "../../types";

const initialApps: Omit<Integration, "connected">[] = [
    {
        name: "Slack",
        icon: "https://cdn-icons-png.flaticon.com/512/2111/2111615.png",
        desc: "Get notifications in your Slack channels.",
    },
    {
        name: "QuickBooks",
        icon: "https://cdn-icons-png.flaticon.com/512/888/888870.png",
        desc: "Sync expenses automatically.",
    },
    {
        name: "Google Drive",
        icon: "https://cdn-icons-png.flaticon.com/512/2965/2965278.png",
        desc: "Backup receipt images to Drive.",
    },
];

const IntegrationsTab: React.FC = () => {
    const [apps, setApps] = useState<Integration[]>([]);

    // Hydrate from LocalStorage or start disconnected
    useEffect(() => {
        const stored = localStorage.getItem("integrations");
        if (stored) {
            setApps(JSON.parse(stored));
        } else {
            // initialize with all disconnected
            setApps(initialApps.map((app) => ({ ...app, connected: false })));
        }
    }, []);

    const toggleConnection = (name: string) => {
        setApps((prev) => {
            const updated = prev.map((app) =>
                app.name === name ? { ...app, connected: !app.connected } : app
            );
            localStorage.setItem("integrations", JSON.stringify(updated));
            return updated;
        });
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-900">Integrations</h2>
                <p className="text-sm text-gray-500">Connect with third-party applications.</p>
            </div>
            <div className="border-t border-gray-200 p-6">
                <div className="grid grid-cols-1 gap-4">
                    {apps.map((app) => (
                        <div
                            key={app.name}
                            className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                        >
                            <div className="flex items-center gap-4">
                                <img src={app.icon} alt={app.name} className="h-10 w-10 object-contain" />
                                <div>
                                    <p className="font-bold text-slate-900">{app.name}</p>
                                    <p className="text-sm text-gray-500">{app.desc}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleConnection(app.name)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium border ${app.connected
                                        ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                                        : "bg-primary text-white border-transparent hover:bg-primary/90"
                                    }`}
                            >
                                {app.connected ? "Disconnect" : "Connect"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IntegrationsTab;