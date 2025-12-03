// src/components/admin/AdminStatsGrid.jsx
import React, { useEffect, useState } from "react";
import { mockApi } from "../../mock/mockApi";

const AdminStatsGrid = () => {
  const [stats, setStats] = useState({
    totalClasses: 0,
    teacherCount: 0,
    roomCount: 0,
    timetableStatus: "Not Generated",
    isLoading: true,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [courses, teachers, rooms, timetableStatus] = await Promise.all([
          mockApi.getCourses(),
          mockApi.getTeachers(),
          mockApi.getRooms(),
          mockApi.getTimetableStatus(),
        ]);

        setStats({
          totalClasses: courses.length,
          teacherCount: teachers.length,
          roomCount: rooms.length,
          timetableStatus: timetableStatus || "Not Generated",
          isLoading: false,
        });
      } catch (err) {
        console.error(err);
        setStats((prev) => ({ ...prev, isLoading: false }));
      }
    };

    loadStats();
  }, []);

  const { totalClasses, teacherCount, roomCount, timetableStatus, isLoading } =
    stats;

  const statusColor = isLoading
    ? "text-gray-400 dark:text-[#92a4c9]"
    : timetableStatus === "Published"
    ? "text-green-500"
    : timetableStatus === "Generated"
    ? "text-amber-500"
    : "text-gray-500 dark:text-[#92a4c9]";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        label="Total Classes"
        value={isLoading ? "—" : totalClasses}
      />
      <StatCard
        label="Registered Teachers"
        value={isLoading ? "—" : teacherCount}
      />
      <StatCard
        label="Available Rooms"
        value={isLoading ? "—" : roomCount}
      />
      <StatCard
        label="Timetable Status"
        value={isLoading ? "—" : timetableStatus}
        valueClass={statusColor}
      />
    </div>
  );
};

const StatCard = ({
  label,
  value,
  valueClass = "text-gray-900 dark:text-white",
}) => (
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
