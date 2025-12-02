// src/components/admin/AdminStatsGrid.jsx
import React from "react";

const AdminStatsGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Total Classes" value="128" />
      <StatCard label="Registered Teachers" value="34" />
      <StatCard label="Available Rooms" value="22" />
      <StatCard
        label="Timetable Status"
        value="Published"
        valueClass="text-green-500"
      />
    </div>
  );
};

const StatCard = ({ label, value, valueClass = "text-gray-900 dark:text-white" }) => (
  <div className="flex flex-col gap-2 rounded-xl p-6 bg-white dark:bg-[#192131] border border-black/10 dark:border-white/10 shadow-sm transition-transform duration-200 hover:-translate-y-0.5">
    <p className="text-gray-600 dark:text-[#92a4c9] text-sm md:text-base font-medium">
      {label}
    </p>
    <p className={`${valueClass} text-3xl md:text-4xl font-bold leading-tight`}>
      {value}
    </p>
  </div>
);

export default AdminStatsGrid;
