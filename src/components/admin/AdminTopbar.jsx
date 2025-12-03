import React, { useState } from "react";
import { useNavigate } from "react-router-dom";   // ✅ NEW
import { useAuth } from "../../context/AuthContext";

const AdminTopbar = ({ onLogout }) => {
  const { user } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();                // ✅ NEW

  const email = user?.email || "admin@university.edu";
  const isActive = user?.isActive ?? true; // fallback to true
  const statusLabel = isActive ? "Active" : "Inactive";
  const statusClasses = isActive
    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
    : "bg-red-500/10 text-red-500 border-red-500/30";

  const handleNotificationsClick = () => {
    navigate("/admin/notifications");           // ✅ go to notifications page
  };

  return (
    <header className="flex items-center justify-between border-b border-black/10 dark:border-white/10 px-4 md:px-10 py-3 sticky top-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm z-20">
      {/* Left side reserved */}
      <div className="flex-1" />

      {/* Actions + Profile */}
      <div className="flex items-center justify-end gap-3 ml-4 relative">
        {/* 🔔 Notifications */}
        <button
          onClick={handleNotificationsClick}
          className="flex items-center justify-center rounded-lg h-9 w-9 bg-gray-200 dark:bg-[#192131] text-gray-800 dark:text-white hover:scale-105 transition-transform relative"
        >
          <span className="material-symbols-outlined text-xl">
            notifications
          </span>
          {/* small unread dot (optional, just visual for now) */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500" />
        </button>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center justify-center rounded-lg h-9 w-9 bg-gray-200 dark:bg-[#192131] text-gray-800 dark:text-white hover:scale-105 transition-transform"
        >
          <span className="material-symbols-outlined text-xl">logout</span>
        </button>

        {/* Profile avatar + dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="hidden sm:block rounded-full size-9 bg-center bg-cover border border-white/20 shadow-sm hover:scale-105 transition-transform"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBZy3AzehZnmw-59l3H47aWd8CTdBGaAYd4eTp_d3ydJ0PbddS8g29tntg6idt5rdsFL0HwXPAMfbXF7s2Gp5j5zPJMf1MzEoFJEWz5deT9EF0bhXK_N-8FTSM2AKhqY1TsJ5OgKE5nm1iqubHI97V3hpBq40pE9TO7tqymO4LDcbmRPoq1aQA8hikmhaVzrwW9t2wCMN_W4vv0iV7SCa5ZKHWU8a3NCiMfy_clsFEuBftJCBRanbSgh3HDKugEjQco-w3QlE7sa-A")',
            }}
          />

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-[#192131] border border-black/10 dark:border-white/10 shadow-xl p-4 text-sm">
              <p className="text-xs uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">
                Signed in as
              </p>
              <p className="text-gray-900 dark:text-white font-semibold break-all">
                {email}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Status
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusClasses}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {statusLabel}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
