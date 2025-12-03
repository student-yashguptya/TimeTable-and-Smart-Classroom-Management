// src/components/notifications/NotificationsFilters.jsx
import React from "react";

const NotificationsFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  unreadCount,
  typeFilters,
  onToggleType,
  allTypes,
}) => {
  return (
    <div className="space-y-4">
      {/* Search box */}
      <div className="rounded-xl bg-white dark:bg-[#192131] border border-black/10 dark:border-white/10 p-4 space-y-3">
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
          Search notifications
        </label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title or message..."
            className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#111827] pl-9 pr-3 text-sm text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Filter by status */}
      <div className="rounded-xl bg-white dark:bg-[#192131] border border-black/10 dark:border-white/10 p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
          Filter by Status
        </p>
        <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <FilterPill
            label="All"
            active={statusFilter === "all"}
            onClick={() => onStatusChange("all")}
          />
          <FilterPill
            label={`Unread${unreadCount ? ` (${unreadCount})` : ""}`}
            active={statusFilter === "unread"}
            onClick={() => onStatusChange("unread")}
          />
          <FilterPill
            label="Read"
            active={statusFilter === "read"}
            onClick={() => onStatusChange("read")}
          />
        </div>
      </div>

      {/* Filter by type */}
      <div className="rounded-xl bg-white dark:bg-[#192131] border border-black/10 dark:border-white/10 p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
          Filter by Type
        </p>
        <div className="space-y-2 text-xs sm:text-sm">
          {allTypes.map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-200"
            >
              <input
                type="checkbox"
                checked={typeFilters.has(type)}
                onChange={() => onToggleType(type)}
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
              />
              {type}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

const FilterPill = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1.5 text-xs font-medium border-r border-gray-200 dark:border-gray-700 last:border-r-0
      ${
        active
          ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
          : "bg-white text-gray-600 dark:bg-[#192131] dark:text-gray-300"
      }`}
  >
    {label}
  </button>
);

export default NotificationsFilters;
