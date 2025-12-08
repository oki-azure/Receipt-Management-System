import React from "react";
import { type Transaction, type Category, type Receipt, type Tag } from "../types"; // adjust path as needed

const LS_KEYS = {
    categories: "categories",
    tags: "tags",
    transactions: "transactions",
    receipts: "receipts",
} as const;

const readLS = <T,>(key: string, fallback: T): T => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
};

const writeLS = (key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const randomColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 50%)`;
};

const Categories: React.FC = () => {
    const [categories, setCategories] = React.useState<Category[]>(
        () => readLS<Category[]>(LS_KEYS.categories, [])
    );
    const [tags, setTags] = React.useState<Tag[]>(
        () => readLS<Tag[]>(LS_KEYS.tags, [])
    );
    const [transactions, setTransactions] = React.useState<Transaction[]>(
        () => readLS<Transaction[]>(LS_KEYS.transactions, [])
    );
    const [receipts, setReceipts] = React.useState<Receipt[]>(
        () => readLS<Receipt[]>(LS_KEYS.receipts, [])
    );

    const [newCategory, setNewCategory] = React.useState("");
    const [newTag, setNewTag] = React.useState("");
    const [editingCategoryId, setEditingCategoryId] = React.useState<string | null>(null);
    const [editingTagId, setEditingTagId] = React.useState<string | null>(null);

    // Persist changes
    React.useEffect(() => writeLS(LS_KEYS.categories, categories), [categories]);
    React.useEffect(() => writeLS(LS_KEYS.tags, tags), [tags]);
    React.useEffect(() => writeLS(LS_KEYS.transactions, transactions), [transactions]);
    React.useEffect(() => writeLS(LS_KEYS.receipts, receipts), [receipts]);

    // Counts derived from transactions
    const categoryCounts = React.useMemo(() => {
        const map = new Map<string, number>();
        categories.forEach((c) => map.set(c.name, 0));
        transactions.forEach((t) => {
            if (map.has(t.category)) {
                map.set(t.category, (map.get(t.category) || 0) + 1);
            }
        });
        return map;
    }, [categories, transactions]);

    const tagCounts = React.useMemo(() => {
        const map = new Map<string, number>();

        // Initialize counts keyed by tag name
        tags.forEach((t) => map.set(t.name, 0));

        receipts.forEach((r) => {
            if (r.tags && Array.isArray(r.tags)) {
                r.tags.forEach((tagName) => {
                    if (map.has(tagName)) {
                        map.set(tagName, (map.get(tagName) || 0) + 1);
                    }
                });
            }
        });

        return map;
    }, [tags, receipts]);

    // Add category
    const addCategory = () => {
        const name = newCategory.trim();
        if (!name) return;
        if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) return;
        const newCat: Category = {
            id: crypto.randomUUID(),
            name,
            color: randomColor(),
        };
        setCategories((prev) => [newCat, ...prev]);
        setNewCategory("");
    };

    // Edit category
    const startEditCategory = (cat: Category) => {
        setEditingCategoryId(cat.id);
        setNewCategory(cat.name); // put the name into the New Category Name input
    };

    const confirmEditCategory = () => {
        if (!editingCategoryId) return;
        const name = newCategory.trim();
        if (!name) return;

        setCategories((prev) =>
            prev.map((c) =>
                c.id === editingCategoryId ? { ...c, name } : c
            )
        );

        // Update transactions so counts stay correct
        setTransactions((prev) =>
            prev.map((tx) =>
                tx.category === categories.find((c) => c.id === editingCategoryId)?.name
                    ? { ...tx, category: name }
                    : tx
            )
        );

        setEditingCategoryId(null);
        setNewCategory("");
    };

    // Delete category
    const deleteCategory = (id: string) => {
        const toDelete = categories.find((c) => c.id === id);
        setCategories((prev) => prev.filter((c) => c.id !== id));
        if (toDelete) {
            setTransactions((prev) =>
                prev.map((tx) =>
                    tx.category === toDelete.name ? { ...tx, category: "" } : tx
                )
            );
        }
    };

    // Add tag
    const addTag = () => {
        const name = newTag.trim();
        if (!name) return;
        if (tags.some((t) => t.name.toLowerCase() === name.toLowerCase())) return;
        const newTagObj: Tag = {
            id: crypto.randomUUID(),
            name,
            count: 0,
        };
        setTags([newTagObj, ...tags]);
        setNewTag("");
    };

    // edit tag
    const startEditTag = (tag: Tag) => {
        setEditingTagId(tag.id);
        setNewTag(tag.name); // put the name into the New Tag Name input
    };

    const confirmEditTag = () => {
        if (!editingTagId) return;
        const name = newTag.trim();
        if (!name) return;

        const oldTag = tags.find((t) => t.id === editingTagId);
        if (!oldTag) return;

        // Update global tags
        setTags((prev) =>
            prev.map((t) => (t.id === editingTagId ? { ...t, name } : t))
        );

        // Update receipts that referenced the old name
        setReceipts((prev) =>
            prev.map((r) => ({
                ...r,
                tags: r.tags
                    ? r.tags.map((tagName) =>
                        tagName === oldTag.name ? name : tagName
                    )
                    : [],
            }))
        );

        setEditingTagId(null);
        setNewTag("");
    };

    const deleteTag = (id: string) => {
        const tagToDelete = tags.find((t) => t.id === id);
        if (!tagToDelete) return;

        // Remove from global tags
        setTags((prev) => prev.filter((t) => t.id !== id));

        // Remove from receipts
        setReceipts((prev) =>
            prev.map((r) => ({
                ...r,
                tags: r.tags ? r.tags.filter((tagName) => tagName !== tagToDelete.name) : [],
            }))
        );
    };

    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Manage Categories & Tags</h1>
                <p className="text-custom-gray">Create, edit, and manage custom categories and tags.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Categories */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="text-xl font-bold text-slate-900">Categories</h2>
                    <div className="mb-6 flex gap-4">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="New Category Name"
                            className="flex-1 rounded-lg border border-gray-500 px-3 text-sm text-slate-900 focus:border-primary focus:ring-primary"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    editingCategoryId ? confirmEditCategory() : addCategory();
                                }
                            }}
                        />
                        < button
                            onClick={addCategory}
                            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            Add
                        </button>
                    </div>

                    <div className="space-y-2">
                        {categories.map((cat) => (
                            <div key={cat.id} className="group flex items-center justify-between rounded-lg p-3 hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <div className={`h-3 w-3 rounded-full`} style={{ backgroundColor: cat.color }} ></div>
                                    <span className="font-medium text-slate-900">{cat.name}</span>
                                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                                        {categoryCounts.get(cat.name) || 0}
                                    </span>
                                </div>
                                <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                                    <button className="p-1 text-gray-400" onClick={() => startEditCategory(cat)}>
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button className="p-1 text-gray-400 hover:text-danger" onClick={() => deleteCategory(cat.id)}>
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h2 className="text-xl font-bold text-slate-900">Tags</h2>
                    <div className="mb-6 flex gap-4">
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="New Tag Name"
                            className="flex-1 rounded-lg border border-gray-500 px-3 text-sm text-slate-900 focus:border-primary focus:ring-primary"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    editingTagId ? confirmEditTag() : addTag();
                                }
                            }}
                        />
                        <button
                            onClick={addTag}
                            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
                        >
                            <span className="material-symbols-outlined text-lg">add</span>
                            Add
                        </button>
                    </div>

                    <div className="space-y-2">
                        {tags.map((tag) => (
                            <div key={tag.id} className="group flex items-center justify-between rounded-lg p-3 hover:bg-gray-50">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">label</span>
                                    <span className="font-medium text-slate-900">{tag.name}</span>
                                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                                        {tagCounts.get(tag.name) || 0}
                                    </span>
                                </div>
                                <div className="flex opacity-0 transition-opacity group-hover:opacity-100">
                                    <button className="p-1 text-gray-400 hover:text-danger" onClick={() => startEditTag(tag)}>
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button className="p-1 text-gray-400 hover:text-danger" onClick={() => deleteTag(tag.id)}>
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Categories;