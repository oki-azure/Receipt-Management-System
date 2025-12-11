import React from "react";
import { type Tag, type Receipt } from "../../types";
import { useNotifications } from "@/context/NotificationContext";

const LS_KEYS = {
    tags: "tags",
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

const AddTagsTab: React.FC = () => {
    const [tags, setTags] = React.useState<Tag[]>(
        () => readLS<Tag[]>(LS_KEYS.tags, [])
    );
    const [receipts, setReceipts] = React.useState<Receipt[]>(
        () => readLS<Receipt[]>(LS_KEYS.receipts, [])
    );

    const [newTag, setNewTag] = React.useState("");
    const [editingTagId, setEditingTagId] = React.useState<string | null>(null);
    const { notifyTag } = useNotifications();

    // Persist changes
    React.useEffect(() => writeLS(LS_KEYS.tags, tags), [tags]);
    React.useEffect(() => writeLS(LS_KEYS.receipts, receipts), [receipts]);

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
        notifyTag("added", name);
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
        notifyTag("updated", name);
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
        notifyTag("deleted", tagToDelete?.name || "a tag");
    };


    return (
        <div className="mx-auto max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Manage Tags</h1>
                <p className="text-custom-gray">Create, edit, and manage custom tags.</p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
        </div>
    );
};

export default AddTagsTab;