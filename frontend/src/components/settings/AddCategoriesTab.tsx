import React from "react";
import { type Transaction, type Category } from "../../types";
import { useNotifications } from "@/context/NotificationContext";

const LS_KEYS = {
    categories: "categories",
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

const AddCategoriesTab: React.FC = () => {
    const [categories, setCategories] = React.useState<Category[]>(
        () => readLS<Category[]>(LS_KEYS.categories, [])
    );
    const [transactions, setTransactions] = React.useState<Transaction[]>(
        () => readLS<Transaction[]>(LS_KEYS.transactions, [])
    );

    const [newCategory, setNewCategory] = React.useState("");
    const [editingCategoryId, setEditingCategoryId] = React.useState<string | null>(null);
    const { notifyCategory } = useNotifications();

    // Persist changes
    React.useEffect(() => writeLS(LS_KEYS.categories, categories), [categories]);
    React.useEffect(() => writeLS(LS_KEYS.transactions, transactions), [transactions]);

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
        notifyCategory("added", name);
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
        notifyCategory("updated", name);
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
        notifyCategory("deleted", toDelete?.name || "a category");
    };

    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Manage Categories</h1>
                <p className="text-custom-gray">Create, edit, and manage custom categories.</p>
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
            </div>
        </div>
    );
}

export default AddCategoriesTab;