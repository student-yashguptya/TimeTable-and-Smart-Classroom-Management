// src/components/admin/AdminActivityTable.jsx
import React, { useEffect, useState } from "react";
import { mockApi } from "../../mock/mockApi";
import Spinner from "../ui/Spinner";

const AdminActivityTable = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = await mockApi.getActivities();
      setActivities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-gray-900 dark:text-white text-xl md:text-2xl font-bold">
        Recent Activity
      </h3>
      <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#192131] overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-6">
              <Spinner size="32" />
            </div>
          ) : activities.length === 0 ? (
            <p className="p-4 text-sm text-gray-500 dark:text-gray-400">
              No recent activity yet.
            </p>
          ) : (
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
                {activities.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <Td>{row.event}</Td>
                    <Td muted>{row.user}</Td>
                    <Td muted>{row.date}</Td>
                    <Td>
                      <StatusPill status={row.status} />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

const StatusPill = ({ status }) => {
  const normalized = (status || "success").toLowerCase();
  let classes =
    "bg-green-500/10 text-green-500 border border-green-500/30";
  let label = "Success";

  if (normalized === "error" || normalized === "failed") {
    classes = "bg-red-500/10 text-red-500 border border-red-500/30";
    label = "Failed";
  } else if (normalized === "pending") {
    classes = "bg-amber-500/10 text-amber-500 border border-amber-500/30";
    label = "Pending";
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${classes}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
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
