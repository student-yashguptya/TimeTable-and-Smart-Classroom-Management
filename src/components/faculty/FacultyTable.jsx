// src/components/faculty/FacultyTable.jsx
import React from "react";
import Spinner from "../ui/Spinner";

const FacultyTable = ({
  isLoading,
  teachers,
  onEdit,
  onDelete,
  onAssignSubjects,
  onAssignLectures,
  onActivity,
  onLeaves,
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="40" />
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white dark:bg-[#192131] border border-black/10 dark:border-white/10 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 dark:bg-black/20">
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Department</Th>
              <Th>Lectures</Th>
              <Th>Subjects</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 dark:divide-white/10">
            {teachers.map((t) => (
              <tr
                key={t.id}
                className="hover:bg-gray-50 dark:hover:bg-white/5"
              >
                <Td>{t.name}</Td>
                <Td muted>{t.email}</Td>
                <Td muted>{t.department}</Td>
                <Td muted>{t.totalLectures}</Td>
                <Td muted>{t.subjects?.join(", ") || "—"}</Td>

                <Td>
                  <StatusBadge status={t.currentStatus} />
                </Td>

                <Td>
                  <div className="flex flex-wrap gap-2">
                    <Btn
                      label="Activity"
                      onClick={() => onActivity(t)}
                      type="green"
                    />
                    <Btn
                      label="Leaves"
                      onClick={() => onLeaves(t)}
                      type="purple"
                    />
                    <Btn
                      label="Assign Subjects"
                      onClick={() => onAssignSubjects(t)}
                      type="blue"
                    />
                    <Btn
                      label="Lectures"
                      onClick={() => onAssignLectures(t)}
                    />
                    <Btn
                      label="Edit"
                      onClick={() => onEdit(t)}
                      type="orange"
                    />
                    <Btn
                      label="Delete"
                      onClick={() => onDelete(t.id)}
                      type="red"
                    />
                  </div>
                </Td>
              </tr>
            ))}

            {teachers.length === 0 && (
              <tr>
                <Td colSpan={7} muted>
                  No teachers found.
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ---------- SMALL TABLE COMPONENTS ---------- */

const Th = ({ children }) => (
  <th className="p-4 text-xs md:text-sm font-semibold text-gray-600 dark:text-[#92a4c9]">
    {children}
  </th>
);

const Td = ({ children, muted, colSpan }) => (
  <td
    colSpan={colSpan}
    className={`p-4 text-xs md:text-sm ${
      muted
        ? "text-gray-500 dark:text-[#92a4c9]"
        : "text-gray-800 dark:text-white"
    }`}
  >
    {children}
  </td>
);

const Btn = ({ label, onClick, type }) => {
  const colors = {
    blue: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    red: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    orange: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
    green: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
    purple: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
    default: "bg-primary/10 text-primary hover:bg-primary/20",
  };
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs rounded-lg ${
        colors[type] || colors.default
      }`}
    >
      {label}
    </button>
  );
};

const StatusBadge = ({ status }) => {
  const normalized = (status || "").toLowerCase();

  let label = "Unknown";
  let classes = "bg-gray-500/10 text-gray-500 border border-gray-500/30";

  if (normalized === "present") {
    label = "Present";
    classes =
      "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30";
  } else if (normalized === "absent") {
    label = "Absent";
    classes = "bg-red-500/10 text-red-500 border border-red-500/30";
  } else if (normalized === "on leave" || normalized === "leave") {
    label = "On Leave";
    classes = "bg-amber-500/10 text-amber-500 border border-amber-500/30";
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${classes}`}
    >
      {label}
    </span>
  );
};

export default FacultyTable;
