import React from 'react';

const Categories: React.FC = () => {
    const [newCategory, setNewCategory] = React.useState('');
    
    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Manage Categories & Tags</h1>
                <p className="text-custom-gray">Create, edit, and manage custom categories and tags.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Categories List */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="text-xl font-bold text-slate-900">Categories</h2>
                    <p className="mb-4 text-sm text-gray-500">Group your receipts into broad categories.</p>

                    <div className="mb-6 flex gap-4">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="New Category Name"
                            className="flex-1 rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                        />
                        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                            <span className="material-symbols-outlined text-lg">add</span>
                            Add
                        </button>
                    </div>

                    <div className="space-y-2">
                        {[
                            { name: 'Groceries', color: 'bg-blue-500', count: 128 },
                            { name: 'Utilities', color: 'bg-green-500', count: 42 },
                            { name: 'Transport', color: 'bg-orange-500', count: 76 },
                            { name: 'Business', color: 'bg-purple-500', count: 15 },
                        ].map((cat) => (
                            <div key={cat.name} className="group flex items-center justify-between rounded-lg p-3 hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className={`h-3 w-3 rounded-full ${cat.color}`}></div>
                                    <span className="font-medium text-slate-900">{cat.name}</span>
                                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{cat.count}</span>
                                </div>
                                <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                                    <button className="p-1 text-gray-400 hover:text-primary"><span className="material-symbols-outlined text-lg">edit</span></button>
                                    <button className="p-1 text-gray-400 hover:text-danger"><span className="material-symbols-outlined text-lg">delete</span></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tags List */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="text-xl font-bold text-slate-900">Tags</h2>
                    <p className="mb-4 text-sm text-gray-500">Use tags for specific details like '#client-project'.</p>

                    <div className="mb-6 flex gap-4">
                        <input
                            type="text"
                            placeholder="New Tag Name"
                            className="flex-1 rounded-lg border-gray-300 text-sm focus:border-primary focus:ring-primary"
                        />
                        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
                            <span className="material-symbols-outlined text-lg">add</span>
                            Add
                        </button>
                    </div>

                    <div className="space-y-2">
                        {[
                            { name: '#client-project', count: 9 },
                            { name: '#reimbursable', count: 34 },
                            { name: '#coffee', count: 51 },
                            { name: '#q4-conference', count: 23 },
                        ].map((tag) => (
                            <div key={tag.name} className="group flex items-center justify-between rounded-lg p-3 hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">label</span>
                                    <span className="font-medium text-slate-900">{tag.name}</span>
                                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">{tag.count}</span>
                                </div>
                                <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                                    <button className="p-1 text-gray-400 hover:text-primary"><span className="material-symbols-outlined text-lg">edit</span></button>
                                    <button className="p-1 text-gray-400 hover:text-danger"><span className="material-symbols-outlined text-lg">delete</span></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Categories;
