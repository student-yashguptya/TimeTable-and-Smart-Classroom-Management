// src/pages/timetables/TimetablePage.jsx
import React, { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import Spinner from "../../components/ui/Spinner";
import { useToast } from "../../context/ToastContext";
import { generateTimetable } from "../../utils/timetableGenerator";
import TimetableGrid from "../../components/timetables/TimetableGrid";
import AssignScheduleModal from "../../components/timetables/AssignScheduleModal";
import { exportTimetablePDF, exportTimetableExcel } from "../../utils/exportTimetable";

const TimetablePage = () => {
  const [search, setSearch] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [timetable, setTimetable] = useState(null);
  const [openAssignModal, setOpenAssignModal] = useState(false);

  const { showToast } = useToast();

  const handleGenerate = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    showToast("Generating timetable...", "info");

    setTimeout(() => {
      const t = generateTimetable();
      setTimetable(t);
      setIsGenerating(false);
      showToast("Timetable generated!", "success");
    }, 1200);
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark">
      <div className="relative flex min-h-screen">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          <AdminTopbar search={search} setSearch={setSearch} />

          <div className="p-4 md:p-10 space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Timetable Management
              </h1>

              <div className="flex gap-3">

                {/* 🔵 UPDATED GENERATE BUTTON */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
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

                {/* Manual Assign Button */}
                <button
                  onClick={() => setOpenAssignModal(true)}
                  className="bg-gray-200 dark:bg-[#192131] px-4 py-2 rounded-lg text-gray-700 dark:text-white hover:-translate-y-0.5 transition-transform"
                >
                  Assign Manually
                </button>
              </div>
            </div>

            {/* Content */}
            {isGenerating ? (
              <div className="flex justify-center py-10">
                <Spinner size="40" />
              </div>
            ) : timetable ? (
              <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
                <TimetableGrid timetable={timetable} />

                {/* Export Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => exportTimetablePDF(timetable)}
                    className="bg-primary text-white px-4 py-2 rounded-lg"
                  >
                    Export PDF
                  </button>

                  <button
                    onClick={() => exportTimetableExcel(timetable)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  >
                    Download Excel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Click “Generate Timetable” to begin.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Assign modal */}
      <AssignScheduleModal
        open={openAssignModal}
        onClose={() => setOpenAssignModal(false)}
        onSave={(entry) => {
          showToast("Added manually!", "success");
          setTimetable((prev) => {
            const updated = { ...prev };
            updated[entry.day][entry.slot] = `${entry.course} – ${entry.teacher} (${entry.room})`;
            return updated;
          });
        }}
      />
    </div>
  );
};

export default TimetablePage;
