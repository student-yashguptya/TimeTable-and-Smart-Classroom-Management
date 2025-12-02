// src/components/admin/AdminActivityTable.jsx
import React from "react";

const activityRows = [
  {
    event: "Timetable for Fall 2024 generated",
    user: "Admin",
    date: "2023-10-27 10:15 AM",
  },
  {
    event: "New Course 'CS101' added",
    user: "Admin",
    date: "2023-10-26 03:45 PM",
  },
  {
    event: "Teacher 'Dr. Alan Turing' updated",
    user: "Admin",
    date: "2023-10-26 11:20 AM",
  },
  {
    event: "Room 'Hall A' added",
    user: "Admin",
    date: "2023-10-25 09:00 AM",
  },
];

const AdminActivityTable = () => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-gray-900 dark:text-white text-xl md:text-2xl font-bold">
        Recent Activity
      </h3>
      <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#192131] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 dark:bg-black/20">
              <tr>
                <Th>Event</Th>
                <Th>User</Th>
                <Th>Date</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10 dark:divide-white/10">
              {activityRows.map((row, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <Td>{row.event}</Td>
                  <Td muted>{row.user}</Td>
                  <Td muted>{row.date}</Td>
                  <Td>
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-semibold text-green-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Success
                    </span>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Th = ({ children }) => (
  <th className="p-4 text-xs md:text-sm font-semibold text-gray-600 dark:text-[#92a4c9]">
    {children}
  </th>
);

const Td = ({ children, muted }) => (
  <td
    className={`p-4 text-xs md:text-sm ${
      muted ? "text-gray-600 dark:text-[#92a4c9]" : "text-gray-800 dark:text-white"
    }`}
  >
    {children}
  </td>
);

export default AdminActivityTable;
