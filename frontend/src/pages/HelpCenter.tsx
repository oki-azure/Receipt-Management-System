import React, { useState } from 'react';

const HelpCenter: React.FC = () => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqs = [
        { question: "How do I export my data to CSV?", answer: "Go to the Reports page and click the 'Export' button in the top right corner. You can choose CSV or PDF format." },
        { question: "Can I add multiple users to my account?", answer: "Yes, if you are on the Pro Plan or higher, you can invite team members from the Settings > Team page." },
        { question: "How do I reset my password?", answer: "You can reset your password from the Login page by clicking 'Forgot password?', or from within Settings > Profile if you are already logged in." }
    ];

    return (
        <div className="mx-auto max-w-5xl space-y-12 pb-12">
            {/* Header Section */}
            <div className="text-center space-y-4 py-8">
                <h1 className="text-4xl font-bold text-slate-900">How can we help you?</h1>
                <p className="text-lg text-custom-gray max-w-2xl mx-auto">
                    Search our knowledge base for answers to your questions about ReceiptManager.
                </p>

                {/* Search Bar */}
                <div className="max-w-xl mx-auto mt-8 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="material-symbols-outlined text-gray-400">search</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Search for articles, guides, and more..."
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900 placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Browse by Category */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900">Browse by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: "Receipt Management", desc: "Learn how to upload, scan, and organize your receipts effectively.", icon: "receipt_long" },
                        { title: "Account Settings", desc: "Manage your profile, password, and security preferences.", icon: "manage_accounts" },
                        { title: "Billing & Plans", desc: "Understand your invoices, upgrade plans, and payment methods.", icon: "credit_card" }
                    ].map((cat, i) => (
                        <div key={i} className="bg-white p-8 rounded-xl border border-gray-200 text-center hover:shadow-md transition-shadow cursor-pointer group flex flex-col items-center">
                            <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-3xl">{cat.icon}</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">{cat.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{cat.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQs */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <button
                                onClick={() => toggleFaq(index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors focus:outline-none"
                            >
                                <span className="font-medium text-slate-900">{faq.question}</span>
                                <span className={`material-symbols-outlined text-gray-400 transition-transform duration-200 ${openFaq === index ? 'rotate-180' : ''}`}>
                                    expand_more
                                </span>
                            </button>
                            {openFaq === index && (
                                <div className="px-6 pb-6 text-gray-600 text-sm border-t border-gray-100 pt-4 animate-fade-in">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Support */}
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Still need help?</h2>
                    <p className="text-custom-gray max-w-lg mx-auto">
                        Our dedicated support team is available 24/7 to assist you with any questions or issues you might have.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm">
                        <span className="material-symbols-outlined">chat</span>
                        Chat with Support
                    </button>
                    <button className="flex items-center gap-2 bg-white border border-gray-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        <span className="material-symbols-outlined">mail</span>
                        Email Us
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpCenter;