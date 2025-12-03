import React, { useMemo, useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useNavigate } from "react-router-dom";

/**
 * Notification shape:
 * {
 *   id: number,
 *   title: string,
 *   message: string,
 *   createdAt: string,        // ISO or human
 *   status: "unread" | "read",
 *   type: "Timetable Change" | "Room Alert" | "Special Schedule" | "Exam Timetable"
 * }
 */

const initialNotifications = [
  {
    id: 1,
    title: "Exam Schedule Published",
    message:
      "The mid-term exam schedule for the Fall semester is now available. Please review it carefully.",
    createdAt: "2 hours ago",
    status: "unread",
    type: "Exam Timetable",
  },
  {
    id: 2,
    title: "Room Change Alert",
    message:
      "CS101 lecture at 10:00 AM has been moved from Room A-101 to Room B-204.",
    createdAt: "Yesterday at 4:15 PM",
    status: "unread",
    type: "Room Alert",
  },
  {
    id: 3,
    title: "Timetable Update",
    message:
      "The timetable for the upcoming week has been updated with minor changes.",
    createdAt: "3 days ago",
    status: "read",
    type: "Timetable Change",
  },
];

const ALL_TYPES = [
  "Timetable Change",
  "Room Alert",
  "Special Schedule",
  "Exam Timetable",
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | unread | read
  const [typeFilters, setTypeFilters] = useState(() => new Set(ALL_TYPES));

  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully.", "info");
    navigate("/login", { replace: true });
  };

  const toggleType = (type) => {
    setTypeFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, status: "read" }))
    );
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status: "read" } : n
      )
    );
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (statusFilter === "unread" && n.status !== "unread") return false;
      if (statusFilter === "read" && n.status !== "read") return false;
      if (!typeFilters.has(n.type)) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const haystack = `${n.title} ${n.message}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [notifications, search, statusFilter, typeFilters]);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  return (
    <div className="font-display bg-background-light dark:bg-background-dark">
      <div className="relative flex min-h-screen w-full">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          <AdminTopbar onLogout={handleLogout} />

          <div className="p-4 md:p-10 space-y-6">
            {/* Header row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  Notifications
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Stay updated with timetable changes, room alerts and schedule
                  updates.
                </p>
              </div>

              <button
                onClick={markAllAsRead}
                className="h-9 px-4 rounded-lg bg-gray-900 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                Mark all as read
              </button>
            </div>

            <div className="grid lg:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)] gap-6 items-start">
              {/* LEFT: Notifications list */}
              <div className="space-y-3">
                {filteredNotifications.length === 0 ? (
                  <div className="rounded-xl bg-white dark:bg-[#192131] border border-black/10 dark:border-white/10 p-6 text-sm text-gray-500 dark:text-gray-400">
                    No notifications match your filters.
                  </div>
                ) : (
                  filteredNotifications.map((n) => (
                    <NotificationCard
                      key={n.id}
                      notification={n}
                      onViewDetails={() => markAsRead(n.id)}
                      onDismiss={() => dismissNotification(n.id)}
                    />
                  ))
                )}
              </div>

              {/* RIGHT: Filters */}
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
                      onChange={(e) => setSearch(e.target.value)}
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
                      onClick={() => setStatusFilter("all")}
                    />
                    <FilterPill
                      label={`Unread${unreadCount ? ` (${unreadCount})` : ""}`}
                      active={statusFilter === "unread"}
                      onClick={() => setStatusFilter("unread")}
                    />
                    <FilterPill
                      label="Read"
                      active={statusFilter === "read"}
                      onClick={() => setStatusFilter("read")}
                    />
                  </div>
                </div>

                {/* Filter by type */}
                <div className="rounded-xl bg-white dark:bg-[#192131] border border-black/10 dark:border-white/10 p-4 space-y-3">
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    Filter by Type
                  </p>
                  <div className="space-y-2 text-xs sm:text-sm">
                    {ALL_TYPES.map((type) => (
                      <label
                        key={type}
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-200"
                      >
                        <input
                          type="checkbox"
                          checked={typeFilters.has(type)}
                          onChange={() => toggleType(type)}
                          className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

/* ---------------------------------------------------- */
/* Sub-components                                       */
/* ---------------------------------------------------- */

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

const NotificationCard = ({ notification, onViewDetails, onDismiss }) => {
  const { title, message, createdAt, status, type } = notification;

  const { icon, borderClass } = getTypeStyle(type);
  const isUnread = status === "unread";

  return (
    <div className="rounded-xl bg-white dark:bg-[#192131] border border-black/10 dark:border-white/10 shadow-sm p-4 md:p-5 flex gap-3 md:gap-4">
      {/* Icon + colored border */}
      <div className="flex flex-col items-center">
        <div
          className={`h-full w-1 rounded-full ${borderClass} hidden sm:block`}
        />
        <div
          className={`sm:hidden flex items-center justify-center h-7 w-7 rounded-full border ${borderClass}`}
        >
          <span className="material-symbols-outlined text-sm">{icon}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="text-sm md:text-base font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {createdAt}
            </p>
          </div>

          {/* unread dot */}
          {isUnread && (
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
          )}
        </div>

        <p className="text-xs md:text-sm text-gray-700 dark:text-gray-200 mt-1">
          {message}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm mt-2">
          <button
            onClick={onViewDetails}
            className="font-semibold text-primary hover:underline"
          >
            View Details
          </button>
          <button
            onClick={onDismiss}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Dismiss
          </button>
          <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {type}
          </span>
        </div>
      </div>
    </div>
  );
};

const getTypeStyle = (type) => {
  switch (type) {
    case "Room Alert":
      return {
        icon: "location_on",
        borderClass: "bg-amber-400 border-amber-400",
      };
    case "Special Schedule":
      return {
        icon: "event_available",
        borderClass: "bg-purple-400 border-purple-400",
      };
    case "Exam Timetable":
      return {
        icon: "warning",
        borderClass: "bg-red-400 border-red-400",
      };
    case "Timetable Change":
    default:
      return {
        icon: "calendar_month",
        borderClass: "bg-blue-400 border-blue-400",
      };
  }
};

export default NotificationsPage;
