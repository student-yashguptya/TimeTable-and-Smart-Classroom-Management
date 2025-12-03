// src/components/timetables/TimetableGrid.jsx
import React from "react";
import { DAYS, TIME_ROWS } from "../../utils/timetableGenerator";

/**
 * Renders the timetable in a grid:
 * - Columns: days (Mon–Sat)
 * - Rows: TIME_ROWS (lectures + breaks)
 * - Cards: Subject – Teacher (Room)
 */
const TimetableGrid = ({ timetable }) => {
  if (!timetable) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        No timetable generated yet.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-[#050816] overflow-hidden shadow-sm">
      {/* CSS grid: first column = time, rest = days */}
      <div
        className="grid text-xs sm:text-sm"
        style={{
          gridTemplateColumns: `90px repeat(${DAYS.length}, minmax(0, 1fr))`,
        }}
      >
        {/* Corner (top-left) */}
        <div className="bg-gray-100/80 dark:bg-slate-900/80 border-b border-black/10 dark:border-white/10" />

        {/* Day headers */}
        {DAYS.map((day) => (
          <div
            key={day}
            className="bg-gray-100/80 dark:bg-slate-900/80 border-b border-l border-black/10 dark:border-white/10 px-2 py-2 flex items-center justify-center text-[11px] sm:text-xs font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide"
          >
            {day}
          </div>
        ))}

        {/* Time rows */}
        {TIME_ROWS.map((row) => (
          <React.Fragment key={row.id}>
            {/* Time column */}
            <div className="border-t border-black/10 dark:border-white/10 bg-gray-50/70 dark:bg-slate-950/70 px-2 py-3 flex flex-col items-start justify-center text-[11px] sm:text-xs text-gray-600 dark:text-gray-300">
              <span className="font-medium">{row.label}</span>
              {row.type === "break" && (
                <span className="mt-1 text-[10px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-500">
                  {row.breakLabel}
                </span>
              )}
            </div>

            {/* Day cells */}
            {DAYS.map((day) => (
              <Cell
                key={`${day}-${row.id}`}
                timetable={timetable}
                day={day}
                row={row}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const Cell = ({ timetable, day, row }) => {
  const { id, type, breakLabel } = row;

  // BREAK ROW (Tea / Lunch)
  if (type === "break") {
    return (
      <div className="border-t border-l border-black/10 dark:border-white/10 bg-gray-50/40 dark:bg-slate-900/40 flex items-center justify-center">
        <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-gray-400 dark:text-gray-500">
          {breakLabel || "Break"}
        </span>
      </div>
    );
  }

  // LECTURE ROW
  const value = timetable?.[day]?.[id] || "";
  return (
    <div className="border-t border-l border-black/10 dark:border-white/10 min-h-[70px] sm:min-h-[80px] p-1">
      <SlotCard value={value} />
    </div>
  );
};

/* -------------------------------------------------- */
/*                    SLOT CARD                       */
/* -------------------------------------------------- */

const SlotCard = ({ value }) => {
  if (!value) return null;

  const { subject, teacher, room } = parseLectureString(value);
  const colorClass = pickColorBySubject(subject);

  return (
    <div
      className={`h-full w-full rounded-xl px-2 py-2 sm:px-3 sm:py-2 text-[10px] sm:text-xs text-white shadow-sm flex flex-col justify-center ${colorClass}`}
    >
      <div className="font-semibold leading-tight mb-0.5 truncate">
        {subject}
      </div>
      {teacher && (
        <div className="text-[10px] sm:text-[11px] opacity-95 truncate">
          {teacher}
        </div>
      )}
      {room && (
        <div className="text-[9px] sm:text-[10px] opacity-80 truncate">
          {room}
        </div>
      )}
    </div>
  );
};

/**
 * Parse "Subject – Teacher (Room)" into parts.
 */
function parseLectureString(str) {
  const [subjectPart, rest] = str.split(" – ");
  const subject = (subjectPart || "").trim();

  let teacher = "";
  let room = "";

  if (rest) {
    const match = rest.match(/(.+)\s\((.+)\)/); // "Teacher (Room)"
    if (match) {
      teacher = match[1].trim();
      room = match[2].trim();
    } else {
      teacher = rest.trim();
    }
  }

  return { subject, teacher, room };
}

/**
 * Choose a stable color class based on subject name.
 * (All classes are static strings so Tailwind won't purge them.)
 */
function pickColorBySubject(subject) {
  const palette = [
    "bg-emerald-600/90",
    "bg-cyan-600/90",
    "bg-indigo-600/90",
    "bg-purple-600/90",
    "bg-amber-600/90",
    "bg-pink-600/90",
    "bg-teal-600/90",
  ];

  if (!subject) return "bg-slate-600/80";

  let hash = 0;
  for (let i = 0; i < subject.length; i += 1) {
    hash = (hash + subject.charCodeAt(i) * (i + 3)) % 997;
  }
  const index = hash % palette.length;
  return palette[index];
}

export default TimetableGrid;
