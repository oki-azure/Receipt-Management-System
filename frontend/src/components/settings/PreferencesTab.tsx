import React, { useEffect, useState } from "react";
import { type Preferences } from "../../types";

const defaultPreferences: Preferences = {
    language: "English (US)",
    currency: "USD ($)",
    timezone: "(GMT+00:00) UTC",
    dateFormat: "MM/DD/YYYY",
    darkMode: false,
};

const PreferencesTab: React.FC = () => {
    const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);

    // Hydrate from LocalStorage or create defaults
    useEffect(() => {
        const stored = localStorage.getItem("preferences");
        if (stored) {
            setPreferences(JSON.parse(stored));
        } else {
            localStorage.setItem("preferences", JSON.stringify(defaultPreferences));
        }
    }, []);

    // Persist to LocalStorage
    const savePreferences = () => {
        localStorage.setItem("preferences", JSON.stringify(preferences));
        alert("Preferences saved!");
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-slate-900">System Preferences</h2>
                <p className="text-sm text-gray-500">Customize your regional and display settings.</p>
            </div>

            <div className="border-t border-gray-200 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Language */}
                    <label className="block">
                        <span className="text-sm font-medium text-slate-900 mb-2 block">Language</span>
                        <select
                            value={preferences.language}
                            onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                            className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                        >
                            <option>English (US)</option>
                            <option>Spanish</option>
                            <option>French</option>
                        </select>
                    </label>

                    {/* Currency */}
                    <label className="block">
                        <span className="text-sm font-medium text-slate-900 mb-2 block">Currency</span>
                        <select
                            value={preferences.currency}
                            onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                            className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                        >
                            <option>USD ($)</option>
                            <option>EUR (€)</option>
                            <option>GBP (£)</option>
                        </select>
                    </label>

                    {/* Timezone */}
                    <label className="block">
                        <span className="text-sm font-medium text-slate-900 mb-2 block">Timezone</span>
                        <select
                            value={preferences.timezone}
                            onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                            className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                        >
                            <option>(GMT-08:00) Pacific Time</option>
                            <option>(GMT-05:00) Eastern Time</option>
                            <option>(GMT+00:00) UTC</option>
                        </select>
                    </label>

                    {/* Date Format */}
                    <label className="block">
                        <span className="text-sm font-medium text-slate-900 mb-2 block">Date Format</span>
                        <select
                            value={preferences.dateFormat}
                            onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                            className="w-full rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                        >
                            <option>MM/DD/YYYY</option>
                            <option>DD/MM/YYYY</option>
                            <option>YYYY-MM-DD</option>
                        </select>
                    </label>
                </div>

                {/* Dark Mode */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                        <p className="font-medium text-slate-900">Dark Mode</p>
                        <p className="text-xs text-gray-500">Adjust the appearance of the application.</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                        <input
                            type="checkbox"
                            checked={preferences.darkMode}
                            onChange={(e) => setPreferences({ ...preferences, darkMode: e.target.checked })}
                            className="peer sr-only"
                        />
                        <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-black after:transition-all after:content-[''] peer-checked:bg-green-400 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20"></div>
                    </label>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end border-t border-gray-200 bg-gray-50 p-4">
                <button
                    onClick={savePreferences}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                >
                    Save Preferences
                </button>
            </div>
        </div>
    );
};

export default PreferencesTab;