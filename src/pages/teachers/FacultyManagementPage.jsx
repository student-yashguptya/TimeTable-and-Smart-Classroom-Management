// src/pages/faculty/FacultyManagementPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { mockApi } from "../../mock/mockApi";

import FacultyHeader from "../../components/faculty/FacultyHeader";
import FacultyTable from "../../components/faculty/FacultyTable";
import {
  TeacherModal,
  AssignSubjectsModal,
  AssignLecturesModal,
  ActivityModal,
  LeaveRequestsModal,
} from "../../components/faculty/modals/FacultyModals";

const FacultyManagementPage = () => {
  const [search, setSearch] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(null);
  const [assignSubjectsModal, setAssignSubjectsModal] = useState(null);
  const [assignLecturesModal, setAssignLecturesModal] = useState(null);
  const [activityModal, setActivityModal] = useState(null);
  const [leaveRequestsModal, setLeaveRequestsModal] = useState(null);

  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const { showToast } = useToast();

  const fileInputRef = useRef(null);

  /* ------------------------------------------------------------------ */
  /*                           LOAD DATA                                */
  /* ------------------------------------------------------------------ */

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [t, s] = await Promise.all([
        mockApi.getTeachers(),
        mockApi.getSubjects(),
      ]);
      setTeachers(t);
      setSubjects(s);
    } catch {
      showToast("Failed to load faculty.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ------------------------------------------------------------------ */
  /*                         AUTH / LOGOUT                              */
  /* ------------------------------------------------------------------ */

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully.", "info");
    navigate("/login", { replace: true });
  };

  /* ------------------------------------------------------------------ */
  /*                       DELETE TEACHER                               */
  /* ------------------------------------------------------------------ */

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;
    try {
      const toDelete = teachers.find((t) => t.id === id);

      await mockApi.deleteTeacher(id);
      showToast("Teacher deleted.", "success");

      await mockApi.addActivity({
        event: `Teacher deleted: ${toDelete?.name || "Unknown"}`,
        user: user?.email || "Admin",
        status: "Success",
      });

      loadData();
    } catch {
      showToast("Failed to delete teacher.", "error");
    }
  };

  /* ------------------------------------------------------------------ */
  /*                        EXCEL IMPORT                                */
  /* ------------------------------------------------------------------ */

  const handleExcelButtonClick = () => {
    fileInputRef.current?.click();
  };

  const parseExcelToTeachers = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];

          const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

          // Expected Excel columns: Name | Email | Department | TotalLectures
          const mapped = json.map((row, index) => ({
            name: row.Name || row.name || `Faculty ${index + 1}`,
            email: row.Email || row.email || "",
            department: row.Department || row.department || "",
            totalLectures: Number(row.TotalLectures || 0),
          }));

          resolve(mapped);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });

  const handleExcelChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const teachersFromExcel = await parseExcelToTeachers(file);

      if (!teachersFromExcel.length) {
        showToast("No faculty rows found in Excel.", "warning");
      } else {
        await mockApi.bulkAddTeachers(teachersFromExcel);

        await mockApi.addActivity({
          event: `Imported ${teachersFromExcel.length} faculty from Excel`,
          user: user?.email || "Admin",
          status: "Success",
        });

        showToast(
          `Imported ${teachersFromExcel.length} faculty from Excel.`,
          "success"
        );
        loadData();
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to import Excel file.", "error");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  /* ------------------------------------------------------------------ */
  /*                          DERIVED DATA                              */
  /* ------------------------------------------------------------------ */

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  /* ------------------------------------------------------------------ */
  /*                              RENDER                                */
  /* ------------------------------------------------------------------ */

  return (
    <div className="font-display bg-background-light dark:bg-background-dark">
      <div className="relative flex min-h-screen w-full">
        <AdminSidebar />

        <div className="flex-1 flex flex-col">
          <AdminTopbar onLogout={handleLogout} />

          <div className="p-4 md:p-10 space-y-6">
            {/* HEADER + SEARCH + ACTIONS */}
            <FacultyHeader
              search={search}
              onSearchChange={setSearch}
              isUploading={isUploading}
              onExcelClick={handleExcelButtonClick}
              onAddClick={() => setAddModal(true)}
            />

            {/* Hidden file input for Excel */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleExcelChange}
            />

            {/* TABLE AREA */}
            <FacultyTable
              isLoading={isLoading}
              teachers={filteredTeachers}
              onDelete={handleDelete}
              onEdit={(t) => setEditModal(t)}
              onAssignSubjects={(t) => setAssignSubjectsModal(t)}
              onAssignLectures={(t) => setAssignLecturesModal(t)}
              onActivity={(t) => setActivityModal(t)}
              onLeaves={(t) => setLeaveRequestsModal(t)}
            />
          </div>

          {/* MODALS */}
          {addModal && (
            <TeacherModal
              title="Add Faculty"
              onClose={() => setAddModal(false)}
              onSaved={loadData}
            />
          )}

          {editModal && (
            <TeacherModal
              title="Edit Faculty"
              initialData={editModal}
              onClose={() => setEditModal(null)}
              onSaved={loadData}
            />
          )}

          {assignSubjectsModal && (
            <AssignSubjectsModal
              teacher={assignSubjectsModal}
              subjects={subjects}
              onClose={() => setAssignSubjectsModal(null)}
              onSaved={loadData}
            />
          )}

          {assignLecturesModal && (
            <AssignLecturesModal
              teacher={assignLecturesModal}
              onClose={() => setAssignLecturesModal(null)}
              onSaved={loadData}
            />
          )}

          {activityModal && (
            <ActivityModal
              teacher={activityModal}
              onClose={() => setActivityModal(null)}
            />
          )}

          {leaveRequestsModal && (
            <LeaveRequestsModal
              teacher={leaveRequestsModal}
              onClose={() => setLeaveRequestsModal(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FacultyManagementPage;
