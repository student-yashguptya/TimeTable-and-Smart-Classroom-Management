// src/components/notifications/NotificationsHeader.jsx
import React from "react";

const NotificationsHeader = ({ onMarkAllAsRead }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Notifications
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Stay updated with timetable changes, room alerts and schedule updates.
        </p>
      </div>

      <button
        onClick={onMarkAllAsRead}
        className="h-9 px-4 rounded-lg bg-gray-900 text-white text-sm font-semibold shadow-sm hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
      >
        Mark all as read
      </button>
    </div>
  );
};

export default NotificationsHeader;
