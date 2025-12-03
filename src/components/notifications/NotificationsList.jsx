// src/components/notifications/NotificationsList.jsx
import React from "react";
import NotificationCard from "./NotificationCard";

const NotificationsList = ({ notifications, onMarkRead, onDismiss }) => {
  if (notifications.length === 0) {
    return (
      <div className="space-y-3">
        <div className="rounded-xl bg-white dark:bg-[#192131] border border-black/10 dark:border-white/10 p-6 text-sm text-gray-500 dark:text-gray-400">
          No notifications match your filters.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <NotificationCard
          key={n.id}
          notification={n}
          onViewDetails={() => onMarkRead(n.id)}
          onDismiss={() => onDismiss(n.id)}
        />
      ))}
    </div>
  );
};

export default NotificationsList;
