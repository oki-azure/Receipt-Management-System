import React, { useState, useEffect } from 'react';

const sections = [
    { id: 'getting-started', title: 'Getting Started' },
    { id: 'dashboard', title: 'Dashboard Overview' },
    { id: 'uploading', title: 'Uploading Receipts' },
    { id: 'managing', title: 'Managing Receipts' },
    { id: 'settings', title: 'Account Settings' },
];

const UserGuide: React.FC = () => {
    const [activeSection, setActiveSection] = useState('getting-started');

    useEffect(() => {
        // We target the 'main' element because it is the scroll container in Layout.tsx
        const mainContainer = document.querySelector('main');

        const handleScroll = () => {
            const spyLine = 300; // Trigger threshold in pixels from top of viewport
            let currentSection = sections[0].id;

            // Special check: If scrolled to the bottom, highlight the last section
            // This is needed because the last section might be too short to ever reach the spyLine
            if (mainContainer) {
                const { scrollTop, scrollHeight, clientHeight } = mainContainer;
                // If we are within 20px of the bottom and have scrolled at all
                if (scrollTop + clientHeight >= scrollHeight - 20 && scrollTop > 0) {
                    setActiveSection(sections[sections.length - 1].id);
                    return;
                }
            }

            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    // Check if the top of the section is above the spy line
                    // The last section that satisfies this condition is the current one
                    if (rect.top < spyLine) {
                        currentSection = section.id;
                    }
                }
            }
            setActiveSection(currentSection);
        };

        if (mainContainer) {
            mainContainer.addEventListener('scroll', handleScroll);
            // Initial check
            handleScroll();
        } else {
            // Fallback for safety
            window.addEventListener('scroll', handleScroll, true);
            handleScroll();
        }

        return () => {
            if (mainContainer) {
                mainContainer.removeEventListener('scroll', handleScroll);
            } else {
                window.removeEventListener('scroll', handleScroll, true);
            }
        };
    }, []);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setActiveSection(id);
        }
    };

    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">User Guide</h1>
                <p className="text-custom-gray">Complete documentation on how to use ReceiptManager effectively.</p>
            </div>

            <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                {/* Table of Contents - Sidebar */}
                <aside className="w-full shrink-0 lg:w-64 lg:sticky lg:top-8">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">Contents</h3>
                        <nav className="flex flex-col space-y-1">
                            {sections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => scrollTo(section.id)}
                                    className={`text-left px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === section.id
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-slate-900'
                                        }`}
                                >
                                    {section.title}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="mt-6 rounded-xl bg-blue-50 p-4 border border-blue-100">
                        <div className="flex items-center gap-2 mb-2 text-primary">
                            <span className="material-symbols-outlined">support_agent</span>
                            <span className="font-bold text-sm">Need more help?</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-3">Can't find what you're looking for? Our support team is here to help.</p>
                        <button 
                        className="w-full rounded-lg bg-white border border-blue-200 py-2 text-xs font-bold text-primary hover:bg-blue-50 transition-colors"
                        onClick={() => window.location.href = "mailto:support@example.com"}
                        >
                            Contact Support
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 min-w-0 space-y-12 pb-12">

                    {/* Getting Started */}
                    <section id="getting-started" className="scroll-mt-8">
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="h-32 bg-slate-900 flex items-center px-8 relative overflow-hidden">
                                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                                <div className="relative z-10">
                                    <h2 className="text-2xl font-bold text-white mb-2">Getting Started</h2>
                                    <p className="text-blue-100">Welcome to your new financial command center.</p>
                                </div>
                            </div>
                            <div className="p-8 space-y-4 text-slate-700 leading-relaxed">
                                <p>
                                    ReceiptManager is designed to streamline your expense tracking workflow.
                                    Whether you are a freelancer, a small business owner, or just keeping track of personal spending,
                                    our platform helps you digitize receipts, categorize expenses, and generate insightful reports.
                                </p>
                                <h3 className="text-lg font-bold text-slate-900 pt-2">Key Features</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                                        <span className="material-symbols-outlined text-primary mt-1">dashboard</span>
                                        <div>
                                            <span className="block font-semibold text-slate-900 text-sm">Real-time Dashboard</span>
                                            <span className="text-xs text-gray-500">Get an instant overview of your finances.</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                                        <span className="material-symbols-outlined text-primary mt-1">cloud_upload</span>
                                        <div>
                                            <span className="block font-semibold text-slate-900 text-sm">Easy Uploads</span>
                                            <span className="text-xs text-gray-500">Drag & drop receipt images instantly.</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                                        <span className="material-symbols-outlined text-primary mt-1">pie_chart</span>
                                        <div>
                                            <span className="block font-semibold text-slate-900 text-sm">Smart Reports</span>
                                            <span className="text-xs text-gray-500">Visual breakdowns of spending habits.</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                                        <span className="material-symbols-outlined text-primary mt-1">folder</span>
                                        <div>
                                            <span className="block font-semibold text-slate-900 text-sm">Custom Categories</span>
                                            <span className="text-xs text-gray-500">Organize data your way.</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                                        <span className="material-symbols-outlined text-primary mt-1">sell</span>
                                        <div>
                                            <span className="block font-semibold text-slate-900 text-sm">Custom Tags</span>
                                            <span className="text-xs text-gray-500">Further organize data your way using esoteric labels.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Dashboard Overview */}
                    <section id="dashboard" className="scroll-mt-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400">dashboard</span>
                            Dashboard Overview
                        </h2>
                        <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">
                            <p className="text-slate-700">
                                The Dashboard is the first page you see when you log in. It provides a high-level summary of your financial activities for the current month.
                            </p>
                            <div className="space-y-4">
                                <div className="border-l-4 border-primary pl-4 py-1">
                                    <h4 className="font-bold text-slate-900 text-sm">Total Spending</h4>
                                    <p className="text-sm text-gray-600">Displays the total amount of your expenses.</p>
                                </div>
                                <div className="border-l-4 border-green-500 pl-4 py-1">
                                    <h4 className="font-bold text-slate-900 text-sm">Charts & Graphs</h4>
                                    <p className="text-sm text-gray-600">The line chart visualizes spending over time, helping you spot peaks in expenditure. The donut chart breaks down spending by category.</p>
                                </div>
                                <div className="border-l-4 border-orange-500 pl-4 py-1">
                                    <h4 className="font-bold text-slate-900 text-sm">Recent Activity</h4>
                                    <p className="text-sm text-gray-600">A quick list of the 5 most recent transactions. Click "View All" to manage your full history.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Uploading Receipts */}
                    <section id="uploading" className="scroll-mt-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400">cloud_upload</span>
                            Uploading Receipts
                        </h2>
                        <div className="bg-white rounded-xl border border-gray-200 p-8">
                            <p className="text-slate-700 mb-6">
                                We've made adding receipts as simple as possible. You can upload images (JPG, PNG) or PDFs.
                            </p>

                            <ol className="relative border-l border-gray-200 ml-3 space-y-8">
                                <li className="mb-10 ml-6">
                                    <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
                                        <span className="text-primary font-bold text-sm">1</span>
                                    </span>
                                    <h3 className="flex items-center mb-1 text-lg font-semibold text-slate-900">Navigate to Upload</h3>
                                    <p className="mb-4 text-sm font-normal text-gray-500">Click the "Upload Receipt" button found on the top right of the Dashboard or Receipts page.</p>
                                </li>
                                <li className="mb-10 ml-6">
                                    <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
                                        <span className="text-primary font-bold text-sm">2</span>
                                    </span>
                                    <h3 className="mb-1 text-lg font-semibold text-slate-900">Select or Drag File</h3>
                                    <p className="mb-4 text-sm font-normal text-gray-500">Drag your file into the dashed dropzone area, or click "Browse Files" to select from your computer.</p>
                                </li>
                                <li className="ml-6">
                                    <span className="absolute flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full -left-4 ring-4 ring-white">
                                        <span className="text-primary font-bold text-sm">3</span>
                                    </span>
                                    <h3 className="mb-1 text-lg font-semibold text-slate-900">Enter Details</h3>
                                    <p className="text-sm font-normal text-gray-500">Fill in the Vendor, Amount, Date, and Category. Adding notes is optional but recommended for searchability.</p>
                                    <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-sm text-yellow-800">
                                        <span className="font-bold block mb-1">💡 Pro Tip:</span>
                                        Mark receipts as "Reimbursable" if you expect to be paid back by your employer.
                                    </div>
                                </li>
                            </ol>
                        </div>
                    </section>

                    {/* Managing Receipts */}
                    <section id="managing" className="scroll-mt-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400">receipt_long</span>
                            Managing Receipts
                        </h2>
                        <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">
                            <p className="text-slate-700">
                                The <strong>Receipts</strong> page is your database. Here you can search, filter, and modify entries.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-2">Searching & Filtering</h4>
                                    <p className="text-sm text-gray-600 mb-2">Use the search bar to find receipts by merchant name or amount.</p>
                                    <p className="text-sm text-gray-600">Filters allow you to narrow down by:</p>
                                    <ul className="list-disc list-inside text-sm text-gray-600 mt-1 pl-2">
                                        <li>Date Range</li>
                                        <li>Category (e.g., Food, Travel)</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-2">Bulk Actions</h4>
                                    <p className="text-sm text-gray-600">
                                        Select multiple receipts using the checkboxes on the left. Once selected, a toolbar appears allowing you to
                                        <span className="text-danger font-medium"> Delete</span> them in batches.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Settings */}
                    <section id="settings" className="scroll-mt-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-gray-400">settings</span>
                            Account Settings
                        </h2>
                        <div className="bg-white rounded-xl border border-gray-200 p-8">
                            <p className="text-slate-700 mb-4">
                                Navigate to Settings to manage your personal profile and add Categories and Tags.
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <li className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                    <span className="material-symbols-outlined text-gray-400">person</span>
                                    <span className="text-sm font-medium text-slate-900">Update Profile</span>
                                </li>
                                <li className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                    <span className="material-symbols-outlined text-gray-400">category</span>
                                    <span className="text-sm font-medium text-slate-900">Add Categories</span>
                                </li>
                                <li className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                    <span className="material-symbols-outlined text-gray-400">sell</span>
                                    <span className="text-sm font-medium text-slate-900">Add tags</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default UserGuide;