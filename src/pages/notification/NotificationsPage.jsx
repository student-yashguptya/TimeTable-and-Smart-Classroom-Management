// src/pages/notifications/NotificationsPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import NotificationsHeader from "../../components/notifications/NotificationsHeader";
import NotificationsList from "../../components/notifications/NotificationsList";
import NotificationsFilters from "../../components/notifications/NotificationsFilters";

/**
 * Notification shape:
 * {
 *   id: number,
 *   title: string,
 *   message: string,
 *   createdAt: string,
 *   status: "unread" | "read",
 *   type: "Timetable Change" | "Room Alert" | "Special Schedule" | "Exam Timetable"
 * }
 */

const ALL_TYPES = [
  "Timetable Change",
  "Room Alert",
  "Special Schedule",
  "Exam Timetable",
];

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

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | unread | read
  const [typeFilters, setTypeFilters] = useState(() => new Set(ALL_TYPES));

  const { logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  /* ---------------------------- Auth / logout ---------------------------- */

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully.", "info");
    navigate("/login", { replace: true });
  };

  /* ---------------------------- Type filter ------------------------------ */

  const toggleType = (type) => {
    setTypeFilters((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  /* -------------------------- Actions on list --------------------------- */

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, status: "read" })));
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
    );
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  /* ------------------------------ Derived ------------------------------- */

  const unreadCount = notifications.filter(
    (n) => n.status === "unread"
  ).length;

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

  /* ------------------------------- Render ------------------------------- */

  return (
    <div className="font-display bg-background-light dark:bg-background-dark">
      <div className="relative flex min-h-screen w-full">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          <AdminTopbar onLogout={handleLogout} />

          <div className="p-4 md:p-10 space-y-6">
            <NotificationsHeader onMarkAllAsRead={markAllAsRead} />

            <div className="grid lg:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)] gap-6 items-start">
              {/* LEFT: list */}
              <NotificationsList
                notifications={filteredNotifications}
                onMarkRead={markAsRead}
                onDismiss={dismissNotification}
              />

              {/* RIGHT: filters */}
              <NotificationsFilters
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                unreadCount={unreadCount}
                typeFilters={typeFilters}
                onToggleType={toggleType}
                allTypes={ALL_TYPES}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
