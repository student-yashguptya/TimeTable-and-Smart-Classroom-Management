// src/components/notifications/NotificationCard.jsx
import React from "react";

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

export default NotificationCard;
