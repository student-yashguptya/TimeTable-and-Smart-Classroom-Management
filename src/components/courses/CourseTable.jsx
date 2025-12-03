// src/components/courses/CourseTable.jsx
import React from "react";
import Spinner from "../ui/Spinner";

const CourseTable = ({ isLoading, courses, teachers, onEdit, onDelete }) => {
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
              <Th>Code</Th>
              <Th>Name</Th>
              <Th>Semester</Th>
              <Th>Department</Th>
              <Th>Weekly Hours</Th>
              <Th>Faculty</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 dark:divide-white/10">
            {courses.map((course) => {
              const teacher = teachers.find((t) => t.id === course.teacherId);
              return (
                <tr
                  key={course.id}
                  className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <Td>{course.code}</Td>
                  <Td>{course.name}</Td>
                  <Td muted>{course.semester}</Td>
                  <Td muted>{course.department}</Td>
                  <Td muted>{course.weeklyHours}</Td>
                  <Td muted>{teacher?.name || "—"}</Td>
                  <Td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(course)}
                        className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs hover:bg-primary/20"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(course.id)}
                        className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 text-xs hover:bg-red-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </Td>
                </tr>
              );
            })}

            {courses.length === 0 && (
              <tr>
                <Td colSpan={7} muted>
                  No courses found.
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* Small table helpers */

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

export default CourseTable;
