// src/components/timetables/TimetableHeader.jsx
import React from "react";

const TimetableHeader = ({
  status,
  departmentOptions,
  selectedDepartment,
  onDepartmentChange,
  onGenerate,
  isGenerating,
  isDataLoading,
  onOpenAssignModal,
}) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Timetable Management
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Current status:{" "}
          <span
            className={`font-semibold ${
              status === "Published"
                ? "text-green-500"
                : status === "Generated"
                ? "text-amber-500"
                : "text-gray-500 dark:text-[#92a4c9]"
            }`}
          >
            {status}
          </span>
        </p>
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        {/* Branch / Department filter */}
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
            Branch / Department
          </label>
          <select
            value={selectedDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#111827] px-3 text-sm text-gray-900 dark:text-white min-w-[160px]"
          >
            <option value="">All Departments</option>
            {departmentOptions.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Generate Button */}
        <button
          onClick={onGenerate}
          disabled={isGenerating || isDataLoading}
          className="flex items-center gap-2 min-w-[160px] h-10 px-4 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm transition-transform hover:-translate-y-0.5"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-base">
                progress_activity
              </span>
              Generating...
            </span>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">
                auto_awesome
              </span>
              <span className="truncate">Generate Timetable</span>
            </>
          )}
        </button>

        {/* Manual Assign */}
        <button
          onClick={onOpenAssignModal}
          className="bg-gray-200 dark:bg-[#192131] px-4 py-2 rounded-lg text-gray-700 dark:text-white hover:-translate-y-0.5 transition-transform"
        >
          Assign Manually
        </button>
      </div>
    </div>
  );
};

export default TimetableHeader;
