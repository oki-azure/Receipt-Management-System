import React from 'react';
import ProfileTab from '../components/settings/ProfileTab';
import PreferencesTab from '../components/settings/PreferencesTab';
import AddTagsTab from '../components/settings/AddTagsTab';
import AddCategoriesTab from '../components/settings/AddCategoriesTab';

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = React.useState('Profile');

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                <p className="text-custom-gray">Manage your account settings and preferences.</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex overflow-x-auto border-b border-gray-200">
                {['Profile', 'Preferences', 'Categories', 'Tags'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium cursor-pointer ${activeTab === tab
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-slate-900'
                            }`}
                    >
                        <span className="material-symbols-outlined text-lg">
                            {tab === 'Profile'
                                ? 'person'
                                : tab === 'Preferences'
                                    ? 'tune'
                                    : tab === 'Categories'
                                        ? 'category'
                                        : 'sell'}
                        </span>
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === 'Profile' && <ProfileTab />}
            {activeTab === 'Preferences' && <PreferencesTab />}
            {activeTab === 'Categories' && <AddCategoriesTab />}
            {activeTab === 'Tags' && <AddTagsTab />}
        </div>
    );
};

export default Settings;