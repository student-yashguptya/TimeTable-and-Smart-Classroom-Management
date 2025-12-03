// src/pages/timetables/TimetablePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import Spinner from "../../components/ui/Spinner";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

import { generateTimetable } from "../../utils/timetableGenerator";
import TimetableGrid from "../../components/timetables/TimetableGrid";
import AssignScheduleModal from "../../components/timetables/AssignScheduleModal";
import {
  exportTimetablePDF,
  exportTimetableExcel,
} from "../../utils/exportTimetable";
import { mockApi } from "../../mock/mockApi";

const TimetablePage = () => {
  const [search, setSearch] = useState("");

  // All generated timetables (history)
  // each item: { id, name, createdAt, data, isPublished, department }
  const [timetables, setTimetables] = useState([]);

  // Which timetable is currently selected to view/edit
  const [activeTimetableId, setActiveTimetableId] = useState(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);

  // Global status synced with mockApi ("Not Generated" | "Generated" | "Published")
  const [status, setStatus] = useState("Not Generated");

  // Admin-uploaded data
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Branch / Department filter (CSE / Mechanical / Chemical etc.)
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const { showToast } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully.", "info");
    navigate("/login", { replace: true });
  };

  const activeTimetable =
    timetables.find((t) => t.id === activeTimetableId) || null;

  /* ------------------------------------------------------------------ */
  /*                LOAD ADMIN DATA + RESTORE SAVED TIMETABLE           */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    const loadAll = async () => {
      try {
        setIsDataLoading(true);

        const [c, t, r, savedGrid, savedStatus] = await Promise.all([
          mockApi.getCourses(),
          mockApi.getTeachers(),
          mockApi.getRooms(),
          mockApi.getTimetable(),
          mockApi.getTimetableStatus(),
        ]);

        setCourses(c);
        setTeachers(t);
        setRooms(r);

        const effectiveStatus = savedStatus || "Not Generated";
        setStatus(effectiveStatus);

        // Restore last saved timetable (if any) as a version
        if (savedGrid) {
          const restored = {
            id: Date.now().toString(),
            name:
              effectiveStatus === "Published"
                ? "Last Published Timetable"
                : "Last Saved Timetable",
            createdAt: new Date().toISOString(),
            data: savedGrid,
            isPublished: effectiveStatus === "Published",
            department: "", // unknown, so treat as "All Departments"
          };

          setTimetables([restored]);
          setActiveTimetableId(restored.id);
        }
      } catch (err) {
        console.error("Failed to load timetable / base data:", err);
        showToast("Failed to load timetable data.", "error");
      } finally {
        setIsDataLoading(false);
      }
    };

    loadAll();
  }, [showToast]);

  // Unique department list based on admin courses (CSE, ME, etc.)
  const departmentOptions = Array.from(
    new Set(courses.map((c) => c.department).filter(Boolean))
  );

  /* ------------------------------------------------------------------ */
  /*                           GENERATE                                 */
  /* ------------------------------------------------------------------ */

  const handleGenerate = () => {
    if (isGenerating) return;

    if (isDataLoading) {
      showToast("Please wait, loading data...", "warning");
      return;
    }

    if (!courses.length) {
      showToast("No courses found. Please add courses first.", "error");
      return;
    }
    if (!teachers.length) {
      showToast("No teachers found. Please add faculty first.", "error");
      return;
    }
    if (!rooms.length) {
      showToast("No rooms found. Please add rooms first.", "error");
      return;
    }

    setIsGenerating(true);
    showToast("Generating timetable from admin data...", "info");

    const versionIndex = timetables.length + 1;

    setTimeout(async () => {
      try {
        // Generate based on real admin data + selected branch
        const data = generateTimetable({
          courses,
          teachers,
          rooms,
          department: selectedDepartment, // e.g. "CSE" / "ME" / "CHE"
        });

        const newTimetable = {
          id: Date.now().toString(),
          name: selectedDepartment
            ? `Version ${versionIndex} – ${selectedDepartment}`
            : `Version ${versionIndex} – All Departments`,
          createdAt: new Date().toISOString(),
          data,
          isPublished: false,
          department: selectedDepartment || "",
        };

        setTimetables((prev) => [newTimetable, ...prev]);
        setActiveTimetableId(newTimetable.id);

        // Persist grid + status in mockApi (so dashboard & page remember it)
        await mockApi.saveTimetable(data, "Generated");
        setStatus("Generated");

        // Optional: log activity if available
        if (mockApi.addActivity) {
          await mockApi.addActivity({
            event: `Timetable generated${
              selectedDepartment ? ` (${selectedDepartment})` : ""
            }`,
            user: "Admin",
            status: "Success",
          });
        }

        showToast("Timetable generated!", "success");
      } catch (err) {
        console.error(err);
        showToast("Failed to generate timetable.", "error");
      } finally {
        setIsGenerating(false);
      }
    }, 1200);
  };

  /* ------------------------------------------------------------------ */
  /*                           PUBLISH                                  */
  /* ------------------------------------------------------------------ */

  const handlePublish = async (id) => {
    if (!id) {
      showToast("Select a timetable to publish.", "warning");
      return;
    }

    const timetableToPublish = timetables.find((t) => t.id === id);
    if (!timetableToPublish) {
      showToast("Selected timetable not found.", "error");
      return;
    }

    setTimetables((prev) =>
      prev.map((t) => ({
        ...t,
        isPublished: t.id === id, // only one stays published
      }))
    );

    try {
      // Persist as published
      await mockApi.saveTimetable(timetableToPublish.data, "Published");
      setStatus("Published");

      if (mockApi.addActivity) {
        await mockApi.addActivity({
          event: `Timetable published${
            timetableToPublish.department
              ? ` (${timetableToPublish.department})`
              : ""
          }`,
          user: "Admin",
          status: "Success",
        });
      }

      showToast(
        "Timetable published! Faculty & students can now see it.",
        "success"
      );
    } catch (err) {
      console.error(err);
      showToast("Failed to publish timetable.", "error");
    }
  };

  /* ------------------------------------------------------------------ */
  /*                           EXPORT                                   */
  /* ------------------------------------------------------------------ */

  const handleExportPDF = () => {
    if (!activeTimetable) {
      showToast("Select a timetable to export.", "error");
      return;
    }
    exportTimetablePDF(activeTimetable.data);
  };

  const handleExportExcel = () => {
    if (!activeTimetable) {
      showToast("Select a timetable to export.", "error");
      return;
    }
    exportTimetableExcel(activeTimetable.data);
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  // Optional: filter versions by search (by name)
  const filteredTimetables = timetables.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ------------------------------------------------------------------ */
  /*                           RENDER                                   */
  /* ------------------------------------------------------------------ */

  return (
    <div className="font-display bg-background-light dark:bg-background-dark">
      <div className="relative flex min-h-screen">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          <AdminTopbar
            search={search}
            setSearch={setSearch}
            onLogout={handleLogout}
          />

          <div className="p-4 md:p-10 space-y-6">
            {/* Header */}
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
                {/* Department / Branch Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                    Branch / Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
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
                  onClick={handleGenerate}
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

                {/* Manual Assign Button */}
                <button
                  onClick={() => setOpenAssignModal(true)}
                  className="bg-gray-200 dark:bg-[#192131] px-4 py-2 rounded-lg text-gray-700 dark:text-white hover:-translate-y-0.5 transition-transform"
                >
                  Assign Manually
                </button>
              </div>
            </div>

            {/* Main Content */}
            {isGenerating || isDataLoading ? (
              <div className="flex justify-center py-10">
                <Spinner size="40" />
              </div>
            ) : timetables.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">
                Click “Generate Timetable” to begin. Timetable will be generated
                according to admin data (courses, faculty, rooms) and selected
                branch.
              </p>
            ) : (
              <div className="flex flex-col lg:flex-row gap-6 animate-[fadeIn_0.4s_ease-out]">
                {/* LEFT: Timetable Versions List */}
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
                        onClick={() => setActiveTimetableId(t.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg border text-sm transition 
                          ${
                            t.id === activeTimetableId
                              ? "border-primary bg-primary/10 text-primary dark:text-primary-300"
                              : "border-gray-200 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/70 text-gray-700 dark:text-gray-200"
                          }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium truncate">
                            {t.name}
                          </span>
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

                  {/* Publish Button for selected timetable */}
                  <button
                    onClick={() => handlePublish(activeTimetableId)}
                    disabled={!activeTimetableId}
                    className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-white text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed hover:bg-primary/90 transition"
                  >
                    <span className="material-symbols-outlined text-base">
                      upload
                    </span>
                    Publish Selected
                  </button>

                  <p className="text-[11px] text-gray-500 mt-2">
                    Published timetable will be visible on faculty & student
                    dashboards.
                  </p>
                </div>

                {/* RIGHT: Active timetable view + export actions */}
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

                        {/* Export Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={handleExportPDF}
                            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition"
                          >
                            <span className="material-symbols-outlined text-base">
                              picture_as_pdf
                            </span>
                            Export PDF
                          </button>

                          <button
                            onClick={handleExportExcel}
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
            )}
          </div>
        </div>
      </div>

      {/* Assign modal */}
      <AssignScheduleModal
        open={openAssignModal}
        onClose={() => setOpenAssignModal(false)}
        onSave={(entry) => {
          if (!activeTimetableId) {
            showToast("Generate or select a timetable first.", "error");
            return;
          }

          showToast("Added manually!", "success");

          setTimetables((prev) => {
            const updatedTimetables = prev.map((t) => {
              if (t.id !== activeTimetableId) return t;

              const dataCopy = { ...t.data };
              const daySlots = { ...(dataCopy[entry.day] || {}) };

              daySlots[entry.slot] = `${entry.course} – ${entry.teacher} (${entry.room})`;
              dataCopy[entry.day] = daySlots;

              return { ...t, data: dataCopy };
            });

            // Persist updated active timetable grid to mockApi
            const updatedActive = updatedTimetables.find(
              (t) => t.id === activeTimetableId
            );
            if (updatedActive) {
              mockApi.saveTimetable(updatedActive.data, status);
            }

            return updatedTimetables;
          });
        }}
      />
    </div>
  );
};

export default TimetablePage;
