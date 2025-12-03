// src/pages/timetables/TimetablePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import Spinner from "../../components/ui/Spinner";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

import { generateTimetable } from "../../utils/timetableGenerator";
import AssignScheduleModal from "../../components/timetables/AssignScheduleModal";
import {
  exportTimetablePDF,
  exportTimetableExcel,
} from "../../utils/exportTimetable";
import { mockApi } from "../../mock/mockApi";

// ✅ new smaller components
import TimetableHeader from "../../components/timetables/TimetableHeader";
import TimetableContent from "../../components/timetables/TimetableContent";

const TimetablePage = () => {
  const [search, setSearch] = useState("");

  const [timetables, setTimetables] = useState([]);
  const [activeTimetableId, setActiveTimetableId] = useState(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);

  const [status, setStatus] = useState("Not Generated");

  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

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
            department: "",
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
        const data = generateTimetable({
          courses,
          teachers,
          rooms,
          department: selectedDepartment,
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

        await mockApi.saveTimetable(data, "Generated");
        setStatus("Generated");

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
        isPublished: t.id === id,
      }))
    );

    try {
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
            {/* 🔹 Header moved to TimetableHeader component */}
            <TimetableHeader
              status={status}
              departmentOptions={departmentOptions}
              selectedDepartment={selectedDepartment}
              onDepartmentChange={setSelectedDepartment}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              isDataLoading={isDataLoading}
              onOpenAssignModal={() => setOpenAssignModal(true)}
            />

            {/* 🔹 Content (list + active view) in TimetableContent */}
            {isGenerating || isDataLoading ? (
              <div className="flex justify-center py-10">
                <Spinner size="40" />
              </div>
            ) : (
              <TimetableContent
                timetables={timetables}
                filteredTimetables={filteredTimetables}
                activeTimetable={activeTimetable}
                activeTimetableId={activeTimetableId}
                onSelectTimetable={setActiveTimetableId}
                onPublish={handlePublish}
                onExportPDF={handleExportPDF}
                onExportExcel={handleExportExcel}
                formatDate={formatDate}
              />
            )}
          </div>
        </div>
      </div>

      {/* Assign modal (logic unchanged) */}
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
