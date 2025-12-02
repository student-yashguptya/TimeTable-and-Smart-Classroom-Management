// src/components/timetables/TimetableGrid.jsx
import React from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const slots = ["9–10", "10–11", "11–12", "1–2", "2–3", "3–4"];

const TimetableGrid = ({ timetable }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse rounded-xl overflow-hidden">
        <thead className="bg-gray-100 dark:bg-black/20">
          <tr>
            <th className="p-3 font-semibold">Time</th>
            {days.map((day) => (
              <th key={day} className="p-3 font-semibold">
                {day}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 dark:divide-white/10">
          {slots.map((slot) => (
            <tr key={slot}>
              <td className="p-3 font-semibold">{slot}</td>

              {days.map((day) => (
                <td key={day} className="p-3 text-sm text-gray-700 dark:text-gray-300">
                  {timetable[day]?.[slot] || "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimetableGrid;
