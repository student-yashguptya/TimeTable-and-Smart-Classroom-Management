// src/components/courses/CourseHeader.jsx
import React from "react";

const CourseHeader = ({
  search,
  onSearchChange,
  isUploading,
  onExcelClick,
  onAddClick,
}) => {
  return (
    <>
      {/* Title + actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Courses
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage academic courses, assign faculty & weekly lectures, or import
            via Excel.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Excel Upload Button */}
          <button
            onClick={onExcelClick}
            disabled={isUploading}
            className="flex items-center gap-2 h-10 px-4 rounded-lg bg-gray-100 dark:bg-black/30 text-gray-800 dark:text-gray-100 text-xs md:text-sm font-semibold shadow-sm hover:bg-gray-200 dark:hover:bg-black/50 disabled:opacity-60"
          >
            {isUploading ? (
              <>
                <span className="material-symbols-outlined text-sm animate-spin">
                  progress_activity
                </span>
                Importing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">
                  upload_file
                </span>
                <span>Upload Excel</span>
              </>
            )}
          </button>

          {/* Add Course Button */}
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 h-10 px-4 rounded-lg bg-primary text-white text-sm font-semibold shadow-md hover:bg-primary/90 hover:-translate-y-0.5 transition"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Add Course</span>
          </button>
        </div>
      </div>

      {/* Search Courses */}
      <div className="max-w-sm">
        <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
          Search Courses
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by code or name..."
          className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#111827] px-3 text-sm text-gray-900 dark:text-white"
        />
      </div>
    </>
  );
};

export default CourseHeader;
