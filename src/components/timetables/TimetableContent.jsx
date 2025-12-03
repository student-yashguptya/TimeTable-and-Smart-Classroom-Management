// src/components/timetables/TimetableContent.jsx
import React from "react";
import TimetableGrid from "./TimetableGrid";

const TimetableContent = ({
  timetables,
  filteredTimetables,
  activeTimetable,
  activeTimetableId,
  onSelectTimetable,
  onPublish,
  onExportPDF,
  onExportExcel,
  formatDate,
}) => {
  if (!timetables.length) {
    return (
      <p className="text-gray-600 dark:text-gray-400">
        Click “Generate Timetable” to begin. Timetable will be generated
        according to admin data (courses, faculty, rooms) and selected branch.
      </p>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-[fadeIn_0.4s_ease-out]">
      {/* LEFT: Versions list */}
      <div className="lg:w-72 bg-white/70 dark:bg-slate-900/70 rounded-xl shadow-sm border border-gray-100/60 dark:border-slate-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Generated Timetables
          </h2>
          <span className="text-xs text-gray-500">
            {filteredTimetables.length} versions
          </span>
        </div>

        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {filteredTimetables.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTimetable(t.id)}
              className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition 
                ${
                  t.id === activeTimetableId
                    ? "border-primary bg-primary/10 text-primary dark:text-primary-300"
                    : "border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/70 text-gray-700 dark:text-gray-200"
                }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium truncate">{t.name}</span>
                {t.isPublished && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                    <span className="material-symbols-outlined text-[14px]">
                      public
                    </span>
                    Published
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {t.department
                  ? `${t.department} • ${formatDate(t.createdAt)}`
                  : formatDate(t.createdAt)}
              </p>
            </button>
          ))}
        </div>

        {/* Publish selected */}
        <button
          onClick={() => onPublish(activeTimetableId)}
          disabled={!activeTimetableId}
          className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed hover:bg-primary/90 transition"
        >
          <span className="material-symbols-outlined text-base">upload</span>
          Publish Selected
        </button>

        <p className="text-[11px] text-gray-500 mt-2">
          Published timetable will be visible on faculty & student dashboards.
        </p>
      </div>

      {/* RIGHT: Active timetable + export */}
      <div className="flex-1 space-y-4">
        {activeTimetable ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {activeTimetable.name}
                </h2>
                <p className="text-xs text-gray-500">
                  Created at: {formatDate(activeTimetable.createdAt)}{" "}
                  {activeTimetable.department && (
                    <span className="ml-1">
                      • {activeTimetable.department}
                    </span>
                  )}
                  {activeTimetable.isPublished && (
                    <span className="ml-2 inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                      <span className="material-symbols-outlined text-[14px]">
                        visibility
                      </span>
                      Currently Published
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={onExportPDF}
                  className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition"
                >
                  <span className="material-symbols-outlined text-base">
                    picture_as_pdf
                  </span>
                  Export PDF
                </button>

                <button
                  onClick={onExportExcel}
                  className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition"
                >
                  <span className="material-symbols-outlined text-base">
                    grid_on
                  </span>
                  Download Excel
                </button>
              </div>
            </div>

            <TimetableGrid timetable={activeTimetable.data} />
          </>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            Select a timetable version from the left panel to view it.
          </p>
        )}
      </div>
    </div>
  );
};

export default TimetableContent;
