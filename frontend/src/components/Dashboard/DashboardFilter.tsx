import React from "react";

type FilterOption = "week" | "month" | "year" | "all";

interface DashboardFilterProps {
    active: FilterOption;
    onChange: (option: FilterOption) => void;
}

export const DashboardFilter: React.FC<DashboardFilterProps> = ({ active, onChange }) => {
    const baseClasses =
        "rounded px-3 py-1 text-sm font-medium text-custom-gray hover:bg-gray-50";

    const activeClasses =
        "rounded bg-primary/10 px-3 py-1 text-sm font-semibold text-primary";

    return (
        <div className="hidden rounded-lg border border-gray-200 bg-white p-1 md:flex">
            <button
                className={active === "week" ? activeClasses : baseClasses}
                onClick={() => onChange("week")}
            >
                This Week
            </button>
            <button
                className={active === "month" ? activeClasses : baseClasses}
                onClick={() => onChange("month")}
            >
                This Month
            </button>
            <button
                className={active === "year" ? activeClasses : baseClasses}
                onClick={() => onChange("year")}
            >
                This Year
            </button>
            <button
                className={active === "all" ? activeClasses : baseClasses}
                onClick={() => onChange("all")}
            >
                All Receipts
            </button>
        </div>
    );
};